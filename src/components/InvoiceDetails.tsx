import { MdArrowBackIosNew } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "../store";
import { FaFileInvoiceDollar, FaFileInvoice } from "react-icons/fa";
import { GrNotes } from "react-icons/gr";
import { AiOutlineCloseCircle, AiOutlineQuestionCircle } from "react-icons/ai";
import Select from "react-select";
import { useEffect, useState } from "react";
import _ from "lodash";
import { updateInvoice, fetchInvoicesData } from "../store/invoices-actions";
import dateFormat from "dateformat";
import { fetchApproversData } from "../store/approvers-actions";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { fetchSuppliersData } from "../store/suppliers-action";
import { approversOptions } from "../store/approvers-slice";
import { suppliersOptions } from "../store/suppliers-slice";

export default function InvoiceDetails(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const invoices = useSelector((state: RootState) => state.invoices);
  const approvers = useSelector((state: RootState) => state.approvers);
  const suppliers = useSelector((state: RootState) => state.suppliers);
  const [invoiceSelected, setInvoiceSelected] = useState<any>();
  const [approversOptions, setApproversOption] = useState<approversOptions[]>(
    []
  );
  const [suppliersOptions, setSuppliersOption] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchSuppliersData());
    dispatch(fetchApproversData());
    dispatch(fetchInvoicesData());
  }, [dispatch]);

  useEffect(() => {
    const tempObj = _.filter(invoices.invoices, {
      id: window.location.href.split("/").pop(),
    });
    setInvoiceSelected(tempObj[0]);
  }, [setInvoiceSelected, invoices.invoices]);

  useEffect(() => {
    const approversOptions: approversOptions[] = [];
    const suppliersOptions: suppliersOptions[] = [];
    _.map(approvers.approvers, (approver) => {
      const tempObjApprover = {
        value: approver.name,
        label: approver.name,
        customAbbreviation: approver.imgUrl,
      };
      approversOptions.push(tempObjApprover);
    });
    setApproversOption(approversOptions);

    _.map(suppliers.suppliers, (supplier) => {
      const tempObjSupplier = {
        value: supplier.name,
        label: supplier.name,
      };
      suppliersOptions.push(tempObjSupplier);
    });
    setSuppliersOption(suppliersOptions);
  }, [approvers.approvers, suppliers.suppliers]);

  const approversDefaultOption = _.find(approversOptions, {
    label: invoiceSelected?.approver,
  });
  const suppliersDefaultOption = _.find(suppliersOptions, {
    label: invoiceSelected?.supplier,
  });

  return (
    <main className="tw-p-10">
      <div
        className="tw-cursor-pointer tw-text-silver"
        onClick={() => navigate("/")}
      >
        <MdArrowBackIosNew></MdArrowBackIosNew> Back
      </div>
      <div className="tw-flex tw-mt-3 tw-mb-8 tw-justify-between ">
        <div className="tw-flex tw-items-end">
          <FaFileInvoiceDollar className="tw-text-3xl"></FaFileInvoiceDollar>
          <span className="tw-font-bold tw-text-3xl tw-mx-3 ">Invoice</span>
          <span className="tw-py-1  tw-text-sm tw-px-5 tw-bg-opacity-50 tw-font-bold tw-text-red-700 tw-bg-red-300">
            {invoiceSelected?.status}
          </span>{" "}
        </div>

        <div className="tw-flex ">
          <button
            className="tw-border-none tw-py-2 tw-px-4 tw-bg-white"
            onClick={() => alert("we dont give credit notes to newbies!")}
          >
            <GrNotes className="tw-mr-1 tw-mb-1"></GrNotes> Ask for credit note
          </button>
          {invoiceSelected?.status !== "rejected" && (
            <button
              onClick={() =>
                dispatch(
                  updateInvoice(
                    { ...invoiceSelected, status: "rejected" },
                    invoiceSelected.id
                  )
                )
              }
              className="tw-px-5 tw-py-2 tw-mx-2 tw-border-none  tw-text-red-700 tw-border-red-700 tw-outline-1 tw-outline tw-bg-white"
            >
              <AiOutlineCloseCircle className="tw-mr-1 tw-mb-1"></AiOutlineCloseCircle>
              Reject the invoice
            </button>
          )}

          <button className="tw-px-5 tw-py-2 tw-border-none tw-text-white tw-font-bold tw-text-sm   tw-bg-[#3682ae]">
            <FaFileInvoice className="tw-mr-1 tw-mb-1"></FaFileInvoice>Record
            invoice
          </button>
          {invoiceSelected?.status !== "approved" && (
            <button
              onClick={() =>
                dispatch(
                  updateInvoice(
                    { ...invoiceSelected, status: "approved" },
                    invoiceSelected.id
                  )
                )
              }
              className="tw-px-5 tw-py-2 tw-border-none tw-mx-2 tw-font-bold tw-text-1 tw-text-sm tw-text-white tw-bg-[#01589f]"
            >
              {" "}
              <FaFileInvoice className="tw-mr-1 tw-mb-1"></FaFileInvoice>Approve
              invoice
            </button>
          )}
          <button
            onClick={() => alert("the three dots :D")}
            className="tw-border-none tw-px-3 tw-bg-white"
          >
            {" "}
            ...
          </button>
        </div>
      </div>
      <div className="tw-flex  tw-bg-white">
        <div className="tw-flex tw-w-auto  tw-p-5 tw-border-r tw-border-silver  tw-my-2">
          <div className="tw-rounded-full tw-w-20 tw-h-20 tw-bg-silverPrimary tw-flex tw-items-center tw-justify-center tw-mr-4">
            <span className="tw-text-3xl tw-font-bold">
              {invoiceSelected?.supplier[0]}
            </span>
          </div>
          <div className="tw-flex tw-flex-col tw-justify-items-end tw-items-end tw-mr-2">
            <h3 className="tw-text-3xl tw-text-silver tw-font-bold">
              {invoiceSelected?.supplier}
            </h3>
            <p className="tw-text-4xl tw-mb-0 tw-font-bold">{`${
              invoiceSelected?.total
            }.00 ${invoiceSelected?.currency === "eur" ? "€" : "$"} `}</p>
          </div>
          <span className="tw-self-end tw-text-silver tw-font-bold">
            Tax inclusive
          </span>
        </div>
        <div className="tw-p-5 tw-ml-auto tw-border-r tw-border-silver tw-my-2 ">
          <p className="tw-uppercase tw-font-bold tw-text-silver tw-text-2l tw-m-0">
            due date
          </p>
          <p className="tw-font-bold tw-text-2xl">
            {dateFormat(invoiceSelected?.due_date, "dd mmmm yyyy")}
          </p>
        </div>
        <div className="tw-p-5 tw-flex tw-items-center tw-border-silver tw-border-r">
          <div className="tw-px-2">
            <img
              className=" tw-rounded-full tw-w-24 tw-h-24 "
              src={approversDefaultOption?.customAbbreviation}
              alt="doc"
            />
          </div>
          <div className="tw-ml-4 tw-mr-20 ">
            <p className="tw-font-bold tw-uppercase tw-text-silver tw-text-1l">
              Approver
            </p>
            <Select
              options={approversOptions}
              value={approversDefaultOption}
              onChange={(value) => {
                dispatch(
                  updateInvoice(
                    { ...invoiceSelected, approver: value?.value },
                    invoiceSelected.id
                  )
                );
              }}
            />
          </div>
        </div>
        <div className="tw-flex tw-flex-col">
          <div className="tw-p-6">
            <BiMessageRoundedDetail></BiMessageRoundedDetail>
          </div>
          <div className=" tw-p-6 tw-border-1 tw-border-t tw-border-silver">
            <AiOutlineQuestionCircle></AiOutlineQuestionCircle>
          </div>
        </div>
      </div>
      <div className="tw-ml-auto tw-w-1/2 tw-mt-8 tw-bg-white tw-p-10">
        <div>
          <div className="tw-flex tw-justify-between">
            <h3 className="tw-text-2xl tw-font-bold">Supplier information</h3>{" "}
            <span
              className="tw-underline tw-text-blue-600 tw-cursor-pointer"
              onClick={() => alert("do something")}
            >
              {" "}
              + Add a new supplier
            </span>
          </div>
          <label className="tw-text-silver tw-font-bold tw-mt-5">
            Company Name
          </label>
          <Select
            options={suppliersOptions}
            value={suppliersDefaultOption}
            onChange={(value) => {
              dispatch(
                updateInvoice(
                  { ...invoiceSelected, supplier: value?.value },
                  invoiceSelected.id
                )
              );
            }}
          />
        </div>

        <div className="tw-mt-10">
          <div className="tw-flex tw-justify-between">
            <h3 className="tw-text-2xl tw-font-bold">Invoice information</h3>{" "}
            <span
              className="tw-underline tw-text-blue-600 tw-cursor-pointer"
              onClick={() => alert("do something")}
            >
              {" "}
              Mark as credit note
            </span>
          </div>
          <div className="tw-grid tw-grid-cols-2">
            <div>
              <label className="tw-text-silver tw-text-xl">Billing date</label>
              <p>{invoiceSelected?.invoice_date}</p>
            </div>
            <div>
              <label className="tw-text-silver tw-text-xl">Due date</label>
              <p>{invoiceSelected?.due_date}</p>
            </div>
            <div>
              <label className="tw-text-silver tw-text-xl">
                Invoice number{" "}
              </label>
              <p>{invoiceSelected?.invoice_number}</p>
            </div>
            <div>
              <label className="tw-text-silver tw-text-xl"> Total cost</label>
              <p>{`${invoiceSelected?.total}.00 ${
                invoiceSelected?.currency === "eur" ? "€" : "$"
              } `}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
