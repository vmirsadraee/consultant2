import React, { useCallback, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "./Page.css";

//========================== import  ===================================
import { normalizeValue, normalizeNumber, formatInteger, formatPrice }
  from "../utils/funct"
import API from "./api";
  //======================================================================


export default function Durringpage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    serial: "",
    subject: "",
    deliver: "",
    unitprice: "",
  });

  const [a, setCoefficient1] = useState(0);
  const [b, setCoefficient2] = useState(0);
  const navigate = useNavigate();
  /*============================================================*/

  const table_name = localStorage.getItem("table_name");
  useEffect(() => {
    if (!table_name) {
      alert("نام جدول مشخص نشده است");
      navigate("/");
    }
  }, [table_name, navigate]);
  // بارگذاری اولیه داده‌ها
  useEffect(() => {
    const savedRows1 = localStorage.getItem("monitoringRows_durring");
    if (savedRows1) {
      setRows(JSON.parse(savedRows1));
      setLoading(false);
    } else {
      API.get(`/${table_name}/monthly`)
        .then((res) => {
    const data = res.data;
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

  // بارگذاری ضرایب a و b
  useEffect(() => {
    const a = localStorage.getItem("field_17");
    if (a) setCoefficient1(Number(a));
    const b = localStorage.getItem("field_20");
    if (b) setCoefficient2(Number(b));
  }, []);

  // ذخیره خودکار لوکال
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("monitoringRows_durring", JSON.stringify(rows));
    }
  }, [rows, loading]);


  //========================================================


  const getCalculatedPrice = useCallback((row) => {
    if (row.calculate === 0) return null;
    if ((row.calculate === 1 || row.calculate === 2) && row.enableCalc) {
      const unit = Number(row.unitprice);
      if (isNaN(unit)) return "";
      return Math.trunc(a * b * unit);
    }
    return "";
  }, [a, b]);

  // دکمه‌ها
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
    if (manualForm.unitprice === "" || isNaN(Number(manualForm.unitprice))) {
      alert("قیمت واحد باید یک عدد معتبر باشد!");
      return;
    }
    const newRow = {
      ID: `manual-${Date.now()}`,
      serial: manualForm.serial,
      subject: manualForm.subject,
      deliver: manualForm.deliver,
      unitprice: manualForm.unitprice,
      calculate: 1,
      enableCalc: true,
      isManual: true,
    };
    setRows((prev) => [...prev, newRow]);
    setShowModal(false);
    setManualForm({ serial: "", subject: "", deliver: "", unitprice: "" });
  };

  const removeManualRows = () => {
    const confirmDelete = window.confirm("آیا می‌خواهید این ردیف را حذف نمائید؟");
    if (!confirmDelete) return;
    setRows((prev) => prev.filter((r) => !r.isManual));
  };

  const goTonext = () => {
    navigate("/Casepage");
  };


  const totalCalculatedPrice = rows.reduce((sum, r) => {
    const val = getCalculatedPrice(r);
    return sum + (val || 0);
  }, 0);


  useEffect(() => {
    localStorage.setItem(
      "totalPrice_durring",
      totalCalculatedPrice.toString()
    );
  }, [totalCalculatedPrice]);



  const clearGrid = () => {
    if (window.confirm("داده‌های جدول پاک شود؟")) {
      localStorage.removeItem("monitoringRows_durring");
      setRows([]);
      API.get(`/${table_name}/monthly`)
        .then((res) => {
         const data = res.data;
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

  //===============  آماده سازی اطلاعات برای پرینت و گزارش ===================

  const extractDurringExecutionTable = useCallback((rows, a, b) => {
    const safeRows = rows ?? [];
    return {
      id: "report_durring",
      type: "direct",
      title: "خدمات نظارت حین اجرا",
      columns: [
        "شماره ردیف",
        "شرح ردیف",
        "تحویل شدنی",
        "قیمت واحد",
        "ضریب اصلاح",
        "ضریب ویژگی",
        "قیمت نهایی"
      ],
      rows: safeRows
        .map((r) => {
          if (!r) return null;
          return {
            kind: "data2",
            title_1: Number(r.calculate) || "",
            serial: normalizeValue(r.serial) ?? "",
            subject: normalizeValue(r.subject) ?? "",
            deliver: normalizeValue(r.deliver) ?? "",
            unitprice: normalizeNumber(r.unitprice),
            coefficienta: normalizeNumber(a),
            coefficientb: normalizeNumber(b),
            totalprice: normalizeNumber(getCalculatedPrice(r)) ?? 0
          }
        })
        .filter(Boolean),
      total: safeRows.reduce((sum, r) => sum + (getCalculatedPrice(r) || 0), 0),
      currency: "ریال"
    };
  }, [getCalculatedPrice]);


  useEffect(() => {
    const saveDurringExecutionTable = () => {
      const durringTable = extractDurringExecutionTable(rows, a, b);
      localStorage.setItem("durringExecutionTable", JSON.stringify(durringTable));
    };
    // اجرای اولیه
    saveDurringExecutionTable();
    // گوش دادن به تغییرات storage
    window.addEventListener("storage", saveDurringExecutionTable);
    // cleanup
    return () => { window.removeEventListener("storage", saveDurringExecutionTable); };

  }, [rows, a, b, extractDurringExecutionTable]);


  // ستون‌های DataGrid
  const columns = [
    {
      field: "serial",
      headerName: "شماره ردیف",
      flex: 0.1,
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) => formatInteger(p.value),
    },
    {
      field: "subject",
      headerName: "شرح ردیف",
      flex: 0.27,
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
      flex: 0.14,
      headerClassName: "header",
      headerAlign: "center",
      align: "right",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) =>
        (p.row.calculate === 0 ? "" : p.value),
    },
    {
      field: "unitprice",
      headerName: "قیمت واحد",
      flex: 0.13,
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) => (p.row.calculate === 0 ? "" : formatPrice(p.value)),

    },
    {
      field: "a",
      headerName: "اصلاح",
      flex: 0.07,
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) => (p.row.calculate ? b : ""),
    },
    {
      field: "b",
      headerName: "ویژگی",
      flex: 0.07,
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) => (p.row.calculate ? b : ""),
    },
    {
      field: "totalprice",
      headerName: "قیمت نهایی",
      flex: 0.15,
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) => p.row.calculate === 0 ? "" : formatPrice(getCalculatedPrice(p.row)),
    },
    {
      field: "enableCalc",
      headerName: "انتخاب ردیف",
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      flex: 0.07,
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
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
    },
  ];

  if (loading) return <h3>در حال بارگذاری...</h3>;

  return (
    <div style={{ width: "100%", padding: 20, direction: "rtl" }}>
      <div className="d-flex justify-content-between mb-2">
        <h4 className="Titlem rtl">نظارت حین اجرا</h4>
        <strong>
          مجموع: {totalCalculatedPrice.toLocaleString("fa-ir")} ریال
        </strong>
      </div>
      {/* دکمه‌ها */}
      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-outline-light" onClick={enableAllValidCalculations}>
          انتخاب همه
        </button>
        <button className="btn btn-outline-light" onClick={disableAllCalculations}>
          پاک کردن همه
        </button>

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
          '& .MuiDataGrid-virtualScrollerContent': {
            marginLeft: 0,
          },
        }}

        rows={rows}
        columns={columns}
        getRowId={(r) => r.ID}
        pageSize={10}
        getRowHeight={(params) => {
          // چک امن
          if (!params?.row) return 52; // ارتفاع پیش‌فرض
          return params.row.calculate === 0 ? 120 : 'auto'; // تیتر ثابت، بقیه داینامیک
        }}

        getRowClassName={(p) => (p.row.isManual ? "manual-row" : "")}
        onCellEditCommit={(params) => {
          setRows((prev) =>
            prev.map((r) =>
              r.ID === params.id ? { ...r, [params.field]: params.value } : r
            )
          );
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
    </div>
  );
}
