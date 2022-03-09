import React from "react";
import { Button } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import InvoiceDetails from "./components/InvoiceDetails";
import Invoices from "./pages/Invoices";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Invoices />}></Route>
        <Route path="/invoiceDetails/:id" element={<InvoiceDetails />}></Route>
      </Routes>
    </div>
  );
}

export default App;
