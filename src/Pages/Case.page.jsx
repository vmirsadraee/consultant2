import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "./Page.css";
//========================== import  ===================================
import { normalizeValue, normalizeNumber, formatInteger, formatPrice, faToEn, formatPriceInput } from "../utils/funct"
//======================================================================

export default function Casepage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPriceRow, setEditPriceRow] = useState(null);
  const [priceInput, setPriceInput] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    serial: "",
    subject: "",
    deliver: "",
    unitprice: "",
  });

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const navigate = useNavigate();
  const goTonext = () => {
    navigate("/Sitepage");
  };
  const handleSubmitPrice = () => {
    if (!editPriceRow) return;

    const numericPrice = Number(
      faToEn(priceInput).replace(/[^\d]/g, "")
    );

    if (!numericPrice || numericPrice <= 0) {
      alert("قیمت باید عدد مثبت باشد");
      return;
    }

    setRows((prev) =>
      prev.map((r) =>
        r.ID === editPriceRow.ID
          ? { ...r, unitprice: numericPrice }
          : r
      )
    );

    setEditPriceRow(null);
    setPriceInput("");
  };

  /* =========================
     بارگذاری اولیه ردیف‌ها
     ========================= */

  const table_name = localStorage.getItem("table_name");
  useEffect(() => {
    if (!table_name) {
      alert("نام جدول مشخص نشده است");
      navigate("/");
    }
  }, [table_name, navigate]);
  /*====================================================*/

  useEffect(() => {
    const saved = localStorage.getItem("monitoringRows_case");
    if (saved) {
      setRows(JSON.parse(saved));
      setLoading(false);
    } else {
      fetch(`http://localhost:5000/${table_name}/special`)
        .then((res) => res.json())
        .then((data) => {
          const mapped = (Array.isArray(data) ? data : []).map((r) => ({
            ...r,
            // c: r.c ?? 0, 

            isManual: false,
          }));
          setRows(mapped);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [table_name]);


  /* =========================
     بارگذاری ضرایب (FIX TDZ)
     ========================= */
  useEffect(() => {
    const storedA = localStorage.getItem("field_18");
    const storedB = localStorage.getItem("field_20");

    if (storedA !== null) setA(Number(storedA));
    if (storedB !== null) setB(Number(storedB));
  }, []);

  /* =========================
     ذخیره خودکار
     ========================= */
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("monitoringRows_case", JSON.stringify(rows));
    }
  }, [rows, loading]);

  /* =========================
     محاسبه قیمت هر ردیف
     ========================= */
  const getCalculatedPrice = useCallback((row) => {
    const unit = Number(row.unitprice);
    const cVal = Number(row.c);

    if (!row.calculate) return 0;
    if (!unit || !cVal || !a || !b) return 0;

    return Math.trunc(a * b * cVal * unit);
  }, [a, b]);

  useEffect(() => {
    console.log("ROWS LENGTH:", rows.length, rows);
  }, [rows]);


  /* =========================
     جمع کل (FIX useMemo)
     ========================= */
  const totalCalculatedPrice = useMemo(() => {
    if (!rows.length) return 0;

    return rows.reduce(
      (sum, r) => sum + getCalculatedPrice(r),
      0
    );
  }, [rows, getCalculatedPrice]);

  useEffect(() => {
    localStorage.setItem(
      "Final_case",
      totalCalculatedPrice.toString()
    );
  }, [totalCalculatedPrice]);

  useEffect(() => {
    console.log("ROWS UPDATED (from useEffect):", rows);
    console.log("TOTAL CALCULATED PRICE:", totalCalculatedPrice);
  }, [rows, totalCalculatedPrice]);




  /* =========================
     افزودن ردیف دستی
     ========================= */
  const addManualRow = () => {
    if (manualForm.unitprice === "" || isNaN(Number(manualForm.unitprice))) {
      alert("قیمت واحد باید عدد معتبر باشد");
      return;
    }

    const newRow = {
      ID: `manual-${Date.now()}`,
      serial: manualForm.serial,
      subject: manualForm.subject,
      deliver: manualForm.deliver,
      unitprice: Number(manualForm.unitprice),
      calculate: 1,
      c: 0,

      isManual: true,
    };

    setRows((prev) => [...prev, newRow]);
    setShowModal(false);
    setManualForm({
      serial: "",
      subject: "",
      deliver: "",
      unitprice: "",
    });
  };

  const removeManualRows = () => {
    if (!window.confirm("آیا از حذف ردیف‌های دستی مطمئن هستید؟")) return;
    setRows((prev) => prev.filter((r) => !r.isManual));
  };


  const clearGrid = () => {
    if (window.confirm("داده‌های جدول پاک شود؟")) {
      localStorage.removeItem("monitoringRows_case");
      setRows([]);
      fetch(`http://localhost:5000/${table_name}/special`)
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
  //===============  آماده سازی اطلاعات برای پرینت و گزارش ===================


  const extractCaseExecutionTable = useCallback((rows, a, b, c) => {
    const safeRows = rows ?? [];
    return {
      id: "report_case",
      type: "direct",
      title: "خدمات نظارت موردی",
      columns: [
        "شماره ردیف",
        "شرح ردیف",
        "تحویل شدنی",
        "قیمت واحد",
        "ضریب اصلاح",
        "ضریب ویژگی",
        "تعداد",
        "قیمت نهایی"
      ],
      rows: safeRows
        .map((r) => {
          if (!r) return null;

          return {
            kind: "data3",
            title_1: Number(r.calculate) || "",
            serial: normalizeValue(r.serial) ?? "",
            subject: normalizeValue(r.subject) ?? "",
            deliver: normalizeValue(r.deliver) ?? "",
            unitprice: normalizeNumber(r.unitprice),
            coefficienta: normalizeNumber(a) ?? "",
            coefficientb: normalizeNumber(b) ?? "",
            coefficientc: normalizeNumber(r.c) ?? "",
            totalprice: normalizeNumber(getCalculatedPrice(r)) ?? ""
          };
        })
        .filter(Boolean),
      total: safeRows.reduce((sum, r) => sum + (getCalculatedPrice(r) || 0), 0),
      currency: "ریال"
    };
  }, [getCalculatedPrice]);


  useEffect(() => {
    const saveCaseExecutionTable = () => {
      const caseTable = extractCaseExecutionTable(rows, a, b);
      localStorage.setItem("caseExecutionTable", JSON.stringify(caseTable));
    };
    // اجرای اولیه
    saveCaseExecutionTable();
    // گوش دادن به تغییرات storage
    window.addEventListener("storage", saveCaseExecutionTable);
    // cleanup
    return () => { window.removeEventListener("storage", saveCaseExecutionTable); };

  }, [rows, a, b, extractCaseExecutionTable]);


  /* =========================
     ستون‌ها
     ========================= */
  const columns = [
    {
      field: "serial",
      headerName: "شماره",
      flex: 0.15,
      headerClassName: "header",
      align: "center",
      headerAlign: "center",
      renderCell: (p) => formatInteger(p.value),
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
    },

    {
      field: "subject",
      headerName: "شرح",
      flex: 0.25,
      headerClassName: "header",
      align: "right",
      Height: "auto",
      headerAlign: "center",
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
      headerName: " تحویل شدنی",
      flex: 0.15,
      headerClassName: "header",
      align: "right",
      headerAlign: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) =>
        (p.row.calculate === 0 ? "" : p.value),
    },
    {
      field: "unitprice",
      headerName: "قیمت واحد",
      flex: 0.12,
      headerClassName: "header",
      align: "center",
      headerAlign: "center",
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
      field: "c",
      headerName: "تعداد",
      flex: 0.08,
      headerClassName: "header",
      type: "number",
      editable: (params) => params.row.calculate !== 0,
      align: "center",
      headerAlign: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
    },
    {
      field: "a",
      headerName: "اصلاح",
      flex: 0.08,
      headerClassName: "header",
      align: "center",
      headerAlign: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) => (p.row.calculate !== 0 && p.row.c ? a : ""),
    },
    {
      field: "b",
      headerName: "ویژگی",
      flex: 0.08,
      headerClassName: "header",
      align: "center",
      headerAlign: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) => (p.row.calculate !== 0 && p.row.c ? b : ""),
    },
    {
      field: "totalprice",
      headerName: "قیمت نهایی",
      flex: 0.15,
      headerClassName: "header",
      align: "center",
      headerAlign: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) =>
        p.row.calculate
          ? formatPrice(getCalculatedPrice(p.row))
          : "",
    },
  ];

  if (loading) return <h4>در حال بارگذاری...</h4>;
  return (
    <div style={{ padding: 20, direction: "rtl" }}>
      <div className="d-flex justify-content-between mb-2">
        <h4 className="Titlem">حق الزحمه نظارت موردی</h4>
        <strong>
          مجموع: {formatPrice(totalCalculatedPrice)} ریال
        </strong>
      </div>

      <div>
        <div className="mb-3 d-flex gap-2">

          <button
            className="btn btn-info" onClick={() => {
              if (!selectedRowId) {
                alert("یک ردیف برای ویرایش انتخاب کنید");
                return;
              }
              const row = rows.find(r => r.ID === selectedRowId);
              setEditPriceRow(row);
              setPriceInput(row.unitprice ? formatPrice(row.unitprice) : "");
            }}
          >
            ویرایش قیمت
          </button>

          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            افزودن ردیف جدید
          </button>
          <button className="btn btn-warning" onClick={removeManualRows}>
            حذف ردیف جدید
          </button>
          <button className="btn btn-outline-light" onClick={clearGrid}>
            صفحه جدید
          </button>
          <button className="btn btn-secondary" onClick={goTonext}>
            مرحله بعد
          </button>
        </div>
      </div>

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.ID}
        pageSizeOptions={[10]}
        editMode="cell"
        getRowHeight={(params) => {
          // چک امن
          if (!params?.row) return 52; // ارتفاع پیش‌فرض
          return params.row.calculate === 0 ? 120 : 'auto'; // تیتر ثابت، بقیه داینامیک
        }}
        onRowClick={(params) => {
          if (params.row.calculate === 2)
            setSelectedRowId(params.row.ID);
        }}


        processRowUpdate={(updatedRow, oldRow) => {
          const newRows = rows.map((r) =>
            r.ID === updatedRow.ID ? updatedRow : r
          );
          setRows(newRows);
          console.log("ROWS UPDATED:", newRows);
          console.log("TOTAL CALCULATED PRICE:",
            newRows.reduce((sum, r) => {
              const unit = Number(r.unitprice);
              const cVal = Number(r.c);
              if (!r.calculate || !unit || !cVal || !a || !b) return sum;
              return sum + a * b * cVal * unit;
            }, 0)


          );

          return updatedRow;
        }}
      />


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
            <button
              className="btn btn-dark"
              onClick={() => {
                console.log(extractCaseExecutionTable());
              }}
            >
              تست خروجی Casepage
            </button>

          </div>
        </div>
      )}

    </div>
  );
}


