import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router";
import {
  fetchInvoicesData,
  deleteInvoice,
  updateInvoice,
} from "../store/invoices-actions";
import _ from "lodash";
import {
  Hooks,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Select from "react-select";
import { fetchApproversData } from "../store/approvers-actions";
import { approversOptions } from "../store/approvers-slice";
import {
  Button,
  Stack,
  Container,
  Dropdown,
  ButtonGroup,
  Table,
  Pagination,
  Card,
} from "react-bootstrap";
import { MdDescription, MdFilterAlt, MdCircle } from "react-icons/md";
import {
  TiArrowUnsorted,
  TiArrowSortedDown,
  TiArrowSortedUp,
} from "react-icons/ti";
import CreateEditInvoiceModal, {
  IFormInputs,
} from "../components/CreateEditInvoiceModal";
import { fetchSuppliersData } from "../store/suppliers-action";
import { GlobalFilter } from "../components/globalFilter";

const Invoices: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const invoices = useSelector((state: RootState) => state.invoices);
  const approvers = useSelector((state: RootState) => state.approvers);
  const filteredInvoices = useSelector(
    (state: RootState) => state.invoices.filteredInvoices
  );
  const suppliers = useSelector((state: RootState) => state.suppliers);
  const [isShowedEditCreateModal, setIsShowedEditCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState<IFormInputs[]>([]);
  const [showFilters, setIsShowedFilters] = useState(false);
  const totalExpenses = useSelector(
    (state: RootState) => state.invoices.totalExpenses
  );
  const [approversOptions, setApproversOption] = useState<approversOptions[]>(
    []
  );
  const [filteredData, setFilteredData] = useState(false);
  const dispatch = useDispatch();

  const allInvoicesLength = invoices.invoices.length;
  const newInvoicesLength = _.filter(invoices.invoices, {
    status: "new",
  }).length;
  const reccorededInvoicesLength = _.filter(invoices.invoices, {
    status: "recorded",
  }).length;
  const approvedInvoicesLength = _.filter(invoices.invoices, {
    status: "approved",
  }).length;
  const rejectedInvoicesLength = _.filter(invoices.invoices, {
    status: "rejected",
  }).length;

  useEffect(() => {
    dispatch(fetchInvoicesData());
    dispatch(fetchApproversData());
    dispatch(fetchSuppliersData());
  }, [dispatch]);

  useEffect(() => {
    const approversOptions: approversOptions[] = [];
    _.map(approvers.approvers, (approver) => {
      let tempObj = {
        value: approver.name,
        label: approver.name,
        customAbbreviation: approver.imgUrl,
      };
      approversOptions.push(tempObj);
    });
    setApproversOption(approversOptions);
  }, [approvers.approvers]);
  console.log(invoices.invoices);

  type CurrencyType = "usd" | "eur";

  const getCurrencySymbol = useCallback((currency: CurrencyType) => {
    const currencySymbol = {
      usd: "$",
      eur: "€",
    };
    return currencySymbol[currency];
  }, []);

  const formatOptionLabel = (props: approversOptions) => {
    return (
      <div>
        <img
          width="30px"
          height="30px"
          style={{ borderRadius: "50%", marginRight: "5px" }}
          src={props.customAbbreviation}
          alt="ugly thingy"
        />
        <span>{props.label}</span>
      </div>
    );
  };
  const tableHooks = (hooks: Hooks): void => {
    hooks.visibleColumns.push((columns: any) => [
      ...columns,
      {
        id: "EditDelete",
        Header: "",
        disableSortBy: true,
        Cell: ({ row }: any) => {
          return (
            <Stack direction="horizontal">
              <Dropdown
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Dropdown.Toggle
                  variant="primary"
                  title="Click to update status"
                >
                  Update Status
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    title="Click to approve this invoice"
                    onClick={() =>
                      dispatch(
                        updateInvoice(
                          { ...row.original, status: "approved" },
                          row.original.id
                        )
                      )
                    }
                  >
                    Approve Invoice
                  </Dropdown.Item>
                  <Dropdown.Item
                    title="Click to reject this invoice"
                    onClick={() =>
                      dispatch(
                        updateInvoice(
                          { ...row.original, status: "rejected" },
                          row.original.id
                        )
                      )
                    }
                  >
                    Reject Invoice
                  </Dropdown.Item>
                  <Dropdown.Item
                    title="Click to record this invoice"
                    onClick={() =>
                      dispatch(
                        updateInvoice(
                          { ...row.original, status: "recorded" },
                          row.original.id
                        )
                      )
                    }
                  >
                    Record Invoice
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Button
                variant="secondary"
                title="Click to edit this invoice"
                className="ms-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditModalData(row.original);
                  setIsShowedEditCreateModal(true);
                  setEditModal(true);
                }}
              >
                Edit
              </Button>
              <Button
                title="Click to delete this invoice"
                variant="danger"
                className="mx-1"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(deleteInvoice(row.original.id));
                }}
              >
                Delete
              </Button>
            </Stack>
          );
        },
      },
    ]);
  };
  let invoicesData = invoices.invoices;
  if (filteredData) {
    invoicesData = filteredInvoices;
  }
  const productsData = useMemo(() => [...invoicesData], [invoicesData]);
  const productColumns = useMemo(
    () =>
      invoicesData[0]
        ? _.chain(invoicesData[0])
            .keys()
            .filter((key) => !["id", "currency"].includes(key))
            .value()
            .map((key) => {
              if (key === "approver") {
                return {
                  Header: _.toUpper(_.replace(key, "_", " ")),
                  accessor: key,
                  Cell: (value: any) => {
                    const approver = value.cell.value;
                    const defaultValue: any = _.find(approversOptions, {
                      label: approver,
                    });
                    const row = value.row.original;
                    return (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Select
                          onChange={(value) => {
                            dispatch(
                              updateInvoice(
                                { ...row, approver: value?.value },
                                row.id
                              )
                            );
                          }}
                          defaultValue={defaultValue}
                          options={approversOptions}
                          formatOptionLabel={formatOptionLabel}
                        />
                      </div>
                    );
                  },
                };
              }
              if (key === "total") {
                return {
                  Header: _.toUpper(_.replace(key, "_", " ")),
                  accessor: key,
                  Cell: (value: any) => (
                    <p>{`${value.value}.00 ${getCurrencySymbol(
                      value.row.original.currency
                    )}`}</p>
                  ),
                };
              }

              return {
                Header: _.toUpper(_.replace(key, "_", " ")),
                accessor: key,
              };
            })
        : [],

    [invoicesData, approversOptions, dispatch, getCurrencySymbol]
  );

  const tableInstance = useTable<any>(
    {
      columns: productColumns,
      data: productsData,
      initialState: { pageIndex: 0 },
    },
    tableHooks,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    headerGroups,
    rows,
    page,
    canNextPage,
    canPreviousPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    state: { pageIndex, pageSize, globalFilter },
    prepareRow,
    setGlobalFilter,
    getTableBodyProps,
  } = tableInstance;
  return (
    <div>
      <Container>
        <Stack direction="horizontal" gap={1} className="my-5">
          <h1 className="fs-3 fw-bold">
            <MdDescription></MdDescription>Pending supplier invoices
          </h1>
          <small className="fs-7 text-muted ">({allInvoicesLength})</small>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            setGlobalFilter={setGlobalFilter}
            globalFilter={globalFilter}
          />
          <Card
            style={{
              width: "280px",
              height: "40px",
              padding: "0px 5px",
              marginLeft: "25px",
              border: "none",
              borderRadius: "10px",
              boxShadow: "0px 5px 8px #ebeced",
            }}
          >
            <Card.Body className="d-flex align-items-center p-0">
              <p className="m-0">
                Open expenses:
                <strong className="text-primary font-weight-bold">
                  &nbsp;&nbsp;{totalExpenses + ".00"}
                  {getCurrencySymbol("eur")}
                </strong>
                <span className="text-secondary">
                  &nbsp;({preGlobalFilteredRows.length})
                </span>
              </p>
            </Card.Body>
          </Card>
          <Button
            variant="secondary"
            onClick={() => setIsShowedFilters((prevState) => !prevState)}
          >
            <MdFilterAlt></MdFilterAlt>
            {showFilters ? "Hide " : "Show "}filters
          </Button>

          <Button
            variant="success"
            onClick={() => {
              setIsShowedEditCreateModal(true);
              setEditModal(false);
            }}
          >
            Create Invoice +
          </Button>
        </Stack>
        {showFilters && (
          <Stack direction="horizontal" className="my-4">
            <ButtonGroup>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setFilteredData(false);
                  dispatch(fetchInvoicesData());
                }}
                value="All"
              >
                <MdCircle style={{ color: "pink" }}></MdCircle>All(
                {allInvoicesLength})
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setFilteredData(true);
                  dispatch(fetchInvoicesData("?status=new"));
                }}
                value="New"
              >
                <MdCircle style={{ color: "yellow" }}></MdCircle>New(
                {newInvoicesLength})
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setFilteredData(true);
                  dispatch(fetchInvoicesData("?status=recorded"));
                }}
                value="Recorded"
              >
                <MdCircle style={{ color: "blue" }}></MdCircle>Recorded(
                {reccorededInvoicesLength})
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setFilteredData(true);
                  dispatch(fetchInvoicesData("?status=approved"));
                }}
                value="Approved"
              >
                <MdCircle style={{ color: "green" }}></MdCircle>Approved(
                {approvedInvoicesLength})
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setFilteredData(true);
                  dispatch(fetchInvoicesData("?status=rejected"));
                }}
                value="Rejected"
              >
                <MdCircle style={{ color: "red" }}></MdCircle>Rejected(
                {rejectedInvoicesLength})
              </Button>
            </ButtonGroup>
          </Stack>
        )}
        {productsData.length === 0 && (
          <h1 className="text-center fw-bold text-danger">No data!</h1>
        )}
        <Table
          {...getTableProps()}
          variant="light"
          bordered
          striped
          className="table-hover"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="text-center fs-7 text-muted"
              >
                {_.map(headerGroup.headers, (column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {_.includes(
                      ["total", "invoice_date", "due_date", "invoice_number"],
                      column.id
                    ) && (
                      <span className="mx-1">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <TiArrowSortedDown></TiArrowSortedDown>
                          ) : (
                            <TiArrowSortedUp></TiArrowSortedUp>
                          )
                        ) : (
                          <TiArrowUnsorted></TiArrowUnsorted>
                        )}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  style={{ cursor: "pointer" }}
                  {...row.getRowProps()}
                  onClick={() => {
                    navigate(`/invoiceDetails/${row.original.id}`);
                  }}
                  title="Click to view this invoice"
                >
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>
                        {cell.render("Cell", { rowId: cell.row.original.id })}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Pagination className="justify-content-end align-items-center ">
          <span className="fs-5 justify-self-center me-auto text-success">
            Showing the first 20 results of {rows.length} rows
          </span>
          <span className="fs-5 ">
            Page
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span className="fs-6 mx-1">
            | Go to page:
            <input
              className="mx-2"
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>{" "}
          <div className="mx-1 d-flex">
            <Pagination.First
              onClick={(): void => gotoPage(0)}
              disabled={!canPreviousPage}
            />
            <Pagination.Prev
              onClick={(): void => previousPage()}
              disabled={!canPreviousPage}
            />
            <Pagination.Next
              onClick={(): void => nextPage()}
              disabled={!canNextPage}
            />

            <Pagination.Last
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            />
          </div>
          <select
            className="form-select w-auto "
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {_.map([5, 10, 20, 30, 40, 50], (pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </Pagination>

        <br />
      </Container>
      <CreateEditInvoiceModal
        show={isShowedEditCreateModal}
        editModal={editModal}
        editModalData={isShowedEditCreateModal ? editModalData : []}
        handleClose={() => setIsShowedEditCreateModal(false)}
        approvers={approvers.approvers}
        suppliers={suppliers.suppliers}
      />
    </div>
  );
};

export default Invoices;
