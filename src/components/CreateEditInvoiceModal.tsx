import { Modal, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { approversOptions } from "../store/approvers-slice";
import { suppliersOptions } from "../store/suppliers-slice";
import _ from "lodash";
import { v4 as uuid } from "uuid";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { createNewInvoice, updateInvoice } from "../store/invoices-actions";
import { useEffect } from "react";

export interface ICreateInvoiceModalProps {
  show: boolean;
  handleClose: any;
  editModal: boolean;
  editModalData: any;
  approvers: approversOptions[];
  suppliers: suppliersOptions[];
}

export interface IFormInputs {
  id?: string;
  invoice_number?: string;
  invoice_date?: string;
  total?: string;
  due_date?: string;
  supplier?: string;
  approver?: string;
  currency?: string;
  status?: string;
}
const schema = yup
  .object({
    invoice_number: yup.string().required("Invoice number is required"),
    supplier: yup.string().required("Select supplier"),
    total: yup.number().positive().integer().required("Total required"),
    due_date: yup.string().required("Invoice due date required"),
    approver: yup.string().required("Select approver"),
    currency: yup.string().required("currency required"),
  })
  .required();

export default function CreateInvoiceModal({
  show,
  handleClose,
  editModal,
  approvers,
  suppliers,
  editModalData,
}: ICreateInvoiceModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const createInvoiceSubmitHandler = (data: IFormInputs) => {
    const newInvoice = { ...data };
    //this its pretty bad approuch  need to change it after
    _.set(newInvoice, "id", uuid());
    _.set(newInvoice, "status", "new");
    _.set(newInvoice, "invoice_date", new Date().toLocaleDateString());
    newInvoice.total = _.toString(newInvoice.total);
    dispatch(createNewInvoice(newInvoice));
    reset();
    handleClose();
  };
  useEffect(() => {
    if (editModal) {
      const fields: any[] = [
        "invoice_number",
        "supplier",
        "total",
        "currency",
        "due_date",
        "approver",
      ];
      fields.forEach((field) => setValue(field, editModalData[field]));
    }
  }, [editModal, setValue, editModalData]);
  const editInvoiceSubmitHandler = (data: IFormInputs) => {
    const invoiceId: string = editModalData.id;

    let tempObj = { ...data };
    _.set(tempObj, "status", "new");
    _.set(tempObj, "invoice_date", new Date().toLocaleDateString());
    tempObj.total = _.toString(tempObj.total);

    dispatch(updateInvoice(tempObj, invoiceId));
    reset();
    handleClose();
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Form
        onSubmit={handleSubmit(
          editModal ? editInvoiceSubmitHandler : createInvoiceSubmitHandler
        )}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editModal ? "Edit" : "New"} invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="invoice_number">
            <Form.Label>Invoice Number:</Form.Label>
            <Form.Control {...register("invoice_number")} type="text" />
            {errors.invoice_number && (
              <Form.Text className="text-danger">
                {errors.invoice_number.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="supplier">
            <Form.Label>Select Supplier </Form.Label>
            <Form.Select
              aria-placeholder="select supplier"
              {...register("supplier")}
            >
              {_.map(suppliers, (supplier) => (
                <option key={supplier.id} value={supplier.name}>
                  {supplier.name}
                </option>
              ))}
            </Form.Select>
            {errors.supplier && (
              <Form.Text className="text-danger">
                {errors.supplier.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="Total">
            <Form.Label>Total </Form.Label>
            <Form.Control {...register("total")} type="number " min={0} />
            {errors.total && (
              <Form.Text className="text-danger">
                {errors.total.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="currency">
            <Form.Label>Currency</Form.Label>
            <Form.Control {...register("currency")} type="text" min={0} />
            {errors.currency && (
              <Form.Text className="text-danger">
                {errors.currency.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="due_date">
            <Form.Label>Invoice Due date</Form.Label>
            <Form.Control {...register("due_date")} type="date" min={0} />
            {errors.due_date && (
              <Form.Text className="text-danger">
                {errors.due_date.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="approver">
            <Form.Label>Select Approver</Form.Label>
            <Form.Select
              aria-placeholder="select approver"
              {...register("approver")}
            >
              {_.map(approvers, (approver) => (
                <option key={approver.id} value={approver.name}>
                  {approver.name}
                </option>
              ))}
            </Form.Select>
            {errors.approver && (
              <Form.Text className="text-danger">
                {errors.approver.message}
              </Form.Text>
            )}
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              {editModal ? "Edit" : "New"} invoice
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
