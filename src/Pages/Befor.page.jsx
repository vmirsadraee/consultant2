import React, { useCallback, useEffect, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "./Page.css";
//========================== import  ===================================
import {
  normalizeValue, normalizeNumber, faToEn, formatPriceInput,
  formatInteger, formatPrice
} from "../utils/funct"
//======================================================================

export default function Beforpage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPriceRow, setEditPriceRow] = useState(null);
  const [priceInput, setPriceInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    serial: "",
    subject: "",
    deliver: "",
    unitprice: "",
  });
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [a, setCoefficient1] = useState(0);
  const navigate = useNavigate();

  //=============== بارگذاری داده ها ===================

  const table_name = localStorage.getItem("table_name");
  useEffect(() => {
    if (!table_name) {
      alert("نام جدول مشخص نشده است");
      navigate("/");
    }
  }, [table_name, navigate]);

  useEffect(() => {
    const savedRows = localStorage.getItem("monitoringRows_befor");
    if (savedRows) {
      setRows(JSON.parse(savedRows));
      setLoading(false);
    } else {
      fetch(`http://localhost:5000/${table_name}/befor`)
        .then((res) => res.json())
        .then((data) => {
          const mapped = (Array.isArray(data) ? data : []).map((r) => ({
            ...r,
            enableCalc: false,
            isManual: false,
          }));
          setRows(mapped);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [table_name]);

  useEffect(() => {
    const aValue = localStorage.getItem("field_16");
    if (aValue) setCoefficient1(Number(aValue));
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("monitoringRows_befor", JSON.stringify(rows));
    }
  }, [rows, loading]);

  const getCalculatedPrice = useCallback((row) => {
    if (row.calculate === 0) return null;
    if ((row.calculate === 1 || row.calculate === 2) && row.enableCalc) {
      const unit = Number(row.unitprice);
      if (isNaN(unit)) return "";
      return Math.trunc(normalizeNumber(a) * unit);
    }
    return "";
  }, [a]);

  const totalCalculatedPrice = useMemo(() => {
    return rows.reduce((sum, r) => sum + (getCalculatedPrice(r) || 0), 0);
  }, [rows, getCalculatedPrice]);



  const enableAllValidCalculations = () => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.calculate === 1) return { ...r, enableCalc: true };
        if (r.calculate === 2 && Number(r.unitprice) > 0)
          return { ...r, enableCalc: true };
        return r;
      })
    );
  };

  const disableAllCalculations = () => {
    setRows((prev) =>
      prev.map((r) =>
        r.calculate === 1 || r.calculate === 2
          ? { ...r, enableCalc: false }
          : r
      )
    );
  };

  const addManualRow = () => {
    const price = Number(faToEn(manualForm.unitprice).replace(/[^\d]/g, ""));
    if (!price || price <= 0) {
      alert("قیمت واحد باید عدد مثبت باشد!");
      return;
    }

    const newRow = {
      ID: `manual-${Date.now()}`,
      serial: manualForm.serial,
      subject: manualForm.subject,
      deliver: manualForm.deliver,
      unitprice: price,
      calculate: 1,
      enableCalc: true,
      isManual: true,
    };
    setRows((prev) => [...prev, newRow]);
    setShowModal(false);
    setManualForm({ serial: "", subject: "", deliver: "", unitprice: "" });
  };

  const removeManualRows = () => {
    const confirmDelete = window.confirm(
      "آیا می‌خواهید این ردیف را حذف نمائید؟"
    );
    if (!confirmDelete) return;
    setRows((prev) => prev.filter((r) => !r.isManual));
  };

  const goTonext = () => {
    navigate("/durringpage");
  };


  const clearGrid = () => {
    if (window.confirm("داده‌های جدول پاک شود؟")) {
      localStorage.removeItem("monitoringRows_durring");
      setRows([]);
      fetch(`http://localhost:5000/${table_name}/monthly`)
        .then((res) => res.json())
        .then((data) => {
          const mapped = (Array.isArray(data) ? data : []).map((r) => ({
            ...r,
            enableCalc: false,
            isManual: false,
          }));
          setRows(mapped);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
    // دستوری که برای لود دوباره صفحه لازمه
  };

  useEffect(() => {
    localStorage.setItem("Final_befor", totalCalculatedPrice.toString());
  }, [totalCalculatedPrice]);


  const handleSubmitPrice = () => {
    if (!editPriceRow) return;
    const numericPrice = Number(faToEn(priceInput).replace(/[^\d]/g, ""));
    if (!numericPrice || numericPrice <= 0) {
      alert("قیمت باید عدد مثبت باشد");
      return;
    }
    setRows((prev) =>
      prev.map((r) =>
        r.ID === editPriceRow.ID ? { ...r, unitprice: numericPrice } : r
      )
    );
    setEditPriceRow(null);
    setPriceInput("");
  };
  //========================  آماده سازی اطلاعات برای پرینت و گزارش ===================
  const extractBeforeExecutionTable = useCallback((rows, a) => {
    const safeRows = rows ?? [];
    return {
      id: "report_before",
      title: "خدمات نظارت قبل از اجرا",

      columns: [
        "شماره ردیف",
        "شرح ردیف",
        "تحویل شدنی",
        "قیمت واحد",
        "ضریب اصلاح",
        "قیمت نهایی"
      ],

      rows: safeRows
        .map((r) => {
          if (!r) return null;
          return {
            kind: "data1",
            title_1: Number(r.calculate) || "",
            serial: normalizeValue(r.serial) ?? "",
            subject: normalizeValue(r.subject) ?? "",
            deliver: normalizeValue(r.deliver) ?? "",
            unitprice: normalizeNumber(r.unitprice) ?? "",
            coefficienta: normalizeNumber(a) ?? "",
            totalprice:
              normalizeNumber(getCalculatedPrice(r)) ?? "",
          };
        })
        .filter(Boolean),
      total: safeRows.reduce(
        (sum, r) => sum + (getCalculatedPrice(r) || 0), 0),
      currency: "ریال"
    };
  }, [getCalculatedPrice]);

  useEffect(() => {
    const saveBeforeExecutionTable = () => {
      const beforeTable = extractBeforeExecutionTable(rows, a);
      localStorage.setItem("beforeExecutionTable", JSON.stringify(beforeTable));
    };
    // اجرای اولیه
    saveBeforeExecutionTable();
    // گوش دادن به تغییرات storage
    window.addEventListener("storage", saveBeforeExecutionTable);
    // cleanup
    return () => { window.removeEventListener("storage", saveBeforeExecutionTable); };

  }, [rows, a, extractBeforeExecutionTable]);


  //=============== ستون‌ها =================
  const columns = [
    {
      field: "serial",
      headerName: "شماره ردیف",
      flex: 0.1,
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      renderCell: (p) => formatInteger(p.value),
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
    },
    {
      field: "subject",
      headerName: "شرح ردیف",
      flex: 0.3,
      headerClassName: "header",
      headerAlign: "center",
      align: "right",
      renderCell: (p) => (
        <div className="wrap-cell" style={{ direction: "rtl", whiteSpace: "normal" }} >
          {p.value}
        </div>
      ),
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
    },
    {
      field: "deliver",
      headerName: "تحویل شدنی",
      flex: 0.15,
      headerClassName: "header",
      headerAlign: "center",
      align: "right",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) => (p.row.calculate === 0 ? "" : p.value),
    },
    {
      field: "unitprice",
      headerName: "قیمت واحد",
      flex: 0.15,
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      editable: false, // غیرفعال کردن ویرایش مستقیم
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: ({ row }) => {
        const { calculate, unitprice } = row;

        if (calculate === 0) return "";
        if (unitprice == null || isNaN(unitprice)) return "";

        return formatPrice(unitprice);
      },
    },
    {
      field: "a",
      headerName: "اصلاح",
      flex: 0.08,
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      renderCell: (p) => (p.row.calculate !== 0 && p.row.enableCalc ? a : ""),
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
    },
    {
      field: "totalprice",
      headerName: "قیمت نهایی",
      flex: 0.15,
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      renderCell: (p) => (p.row.calculate !== 0 ? formatPrice(getCalculatedPrice(p.row)) : ""),
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
    },
    {
      field: "enableCalc",
      headerName: "انتخاب ردیف",
      headerClassName: "header",
      headerAlign: "center",
      flex: 0.07,
      align: "center",
      renderCell: (p) =>
        p.row.calculate === 0 ? null : (
          <input
            type="checkbox"
            checked={p.row.enableCalc}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((r) =>
                  r.ID === p.row.ID ? { ...r, enableCalc: e.target.checked } : r
                )
              )
            }
          />
        ),
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
    },
  ];

  if (loading) return <h3>در حال بارگذاری...</h3>;

  return (
    <div style={{ width: "100%", padding: 20, direction: "rtl" }}>
      <div className="d-flex justify-content-between mb-2">
        <h4 className="Titlem rtl">خدمات نظارت قبل از اجرا</h4>
        <strong>
          مجموع: {totalCalculatedPrice.toLocaleString("fa-ir")} ریال
        </strong>
      </div>

      <div className="mb-3 d-flex gap-2">
        <button
          className="btn btn-success"
          onClick={enableAllValidCalculations}
        >
          انتخاب همه
        </button>
        <button className="btn btn-outline-light" onClick={disableAllCalculations}>
          پاک کردن همه
        </button>

        <button className="btn btn-outline-light" onClick={() => {
          if (!selectedRowId) { alert("یک ردیف برای ویرایش انتخاب کنید"); return; }
          const row = rows.find(r => r.ID === selectedRowId);
          setEditPriceRow(row);
          setPriceInput(row.unitprice ? formatPrice(row.unitprice) : "");
        }}>ویرایش قیمت</button>

        <button className="btn btn-outline-light" onClick={() => setShowModal(true)}>
          افزودن ردیف جدید
        </button>
        <button className="btn btn-outline-light" onClick={removeManualRows}>
          حذف ردیف جدید
        </button>
        <button className="btn btn-outline-light" onClick={clearGrid}>
          صفحه جدید
        </button>
        <button className="btn btn-secondary" onClick={goTonext}>
          مرحله بعد
        </button>
      </div>
      <DataGrid
        sx={{
          direction: "rtl",
          "& .MuiDataGrid-virtualScrollerContent": { marginLeft: 0 },
        }}
        rows={rows}
        columns={columns}
        getRowId={(r) => r.ID}
        pageSize={10}
        getRowHeight={(params) => {
          if (!params?.row) return 50;
          return params.row.calculate === 0 ? 120 : "auto";
        }}
        getRowClassName={(p) => (p.row.isManual ? "manual-row" : "")}
        onRowClick={(params) => {
          if (params.row.calculate === 2) setSelectedRowId(params.row.ID);
        }}
      />

      {/* Modal افزودن ردیف دستی */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h5>افزودن ردیف دستی</h5>
            {["serial", "subject", "deliver", "unitprice"].map((f) => (
              <input
                key={f}
                placeholder={f}
                value={manualForm[f]}
                onChange={(e) =>
                  setManualForm({ ...manualForm, [f]: e.target.value })
                }
              />
            ))}
            <div className="mt-2 d-flex gap-2">
              <button className="btn btn-success" onClick={addManualRow}>
                ثبت
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ویرایش قیمت */}
      {editPriceRow && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h5>ویرایش قیمت</h5>
            <input
              value={priceInput}
              onChange={(e) =>
                setPriceInput(formatPriceInput(e.target.value))
              }
              placeholder="قیمت جدید"
            />
            <div className="mt-2 d-flex gap-2">
              <button className="btn btn-success" onClick={handleSubmitPrice}>
                ثبت
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditPriceRow(null)}
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
