import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./Page.css";

export default function FaqPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔴 حذف اعشار و تبدیل به عدد صحیح
  const formatInteger = (value) => {
    if (value === null || value === undefined || value === "None") return "";
    return Math.trunc(Number(value));
  };

  // 🔴 فرمت قیمت سه‌رقمی بدون اعشار
  const formatPrice = (value) => {
    if (value === null || value === undefined || value === "None") return "";
    return Math.trunc(Number(value)).toLocaleString("en-US");
  };

  const columnCaptions = {
    serial: "شماره ردیف",
    subject: "شرح ردیف",
    deliver: "تحویل شدنی",
    unitprice: "قیمت واحد"
  };

  const columnOrder = ["serial", "subject", "deliver", "unitprice"];

  useEffect(() => {
    fetch("http://localhost:50573/")
      .then((res) => res.json())
      .then((data) => {
        setRows(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setRows([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>در حال بارگذاری...</h2>;
  if (!rows || rows.length === 0) return <h2>داده‌ای وجود ندارد</h2>;

  const columns = columnOrder.map((key) => ({
    field: key,
    headerName: columnCaptions[key],
    width: key === "subject" ? 500 : 180,
    headerAlign: "center",
    align: "center",

    // 🔴 به‌جای valueFormatter از renderCell استفاده شد
    renderCell:
      key === "serial"
        ? (params) => formatInteger(params.value)
        : key === "unitprice"
        ? (params) => formatPrice(params.value)
        : undefined,
  }));
  
  
  return (
    <div style={{ height: 650, width: "100%", padding: 20, direction: "rtl" }}>
      <h1>نظارت قبل از اجرا</h1>

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.ID}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        disableRowSelectionOnClick
        getRowHeight={() => "auto"}
      />
    </div>
  );
}
