import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "./Page.css";

export default function ContactPage() {
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

  // بارگذاری اولیه داده‌ها
  useEffect(() => {
    const savedRows = localStorage.getItem("monitoringRows");
    if (savedRows) {
      setRows(JSON.parse(savedRows));
      setLoading(false);
    } else {
      fetch("http://127.0.0.1:5000/during")
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
  }, []);

  // بارگذاری ضرایب a و b
  useEffect(() => {
    const a  = localStorage.getItem("field_17");
    if (a) setCoefficient1(Number(a));
    const b = localStorage.getItem("field_20");
    if (b) setCoefficient2(Number(b));
  }, []);

  // ذخیره خودکار لوکال
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("monitoringRows", JSON.stringify(rows));
    }
  }, [rows, loading]);

  // فرمت اعداد
  const formatInteger = (v) =>
    v === null || v === undefined
      ? ""
      : Math.trunc(Number(v)).toLocaleString("fa-ir", { useGrouping: false });

  const formatPrice = (v) =>
    v === null || v === undefined
      ? ""
      : Math.trunc(Number(v)).toLocaleString("fa-ir");

  const getCalculatedPrice = (row) => {
    if (row.calculate === 0) return null;
    if ((row.calculate === 1 || row.calculate === 2) && row.enableCalc) {
      const unit = Number(row.unitprice);
      if (isNaN(unit)) return "";
      return Math.trunc(a * b * unit);
    }
    return "";
  };

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

  const goToHome = () => {
    navigate("/");
  };

   
  const totalCalculatedPrice = rows.reduce((sum, r) => {
    const val = getCalculatedPrice(r);
    return sum + (val || 0);
  }, 0);

  // ستون‌های DataGrid
  const columns = [
    {
      field: "serial",
      headerName: "شماره ردیف",
      width: 150,
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
      width: 350,
      headerClassName: "header",
      headerAlign: "center",
      align: "right",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) => (
        <div style={{ direction: "rtl", whiteSpace: "normal" }}>{p.value}</div>
      ),
    },
    {
      field: "deliver",
      headerName: "تحویل شدنی",
      width: 140,
      headerClassName: "header",
      headerAlign: "center",
      align: "right",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
    },
    {
      field: "unitprice",
      headerName: "قیمت واحد",
      width: 120,
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) => formatPrice(p.value),
    },
    {
      field: "a",
      headerName: "اصلاح",
      width: 80,
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) => (p.row.calculate !== 0 && p.row.enableCalc ? a : ""),
    },
    {
      field: "b",
      headerName: "ویژگی",
      width: 80,
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) => (p.row.calculate !== 0 && p.row.enableCalc ? b : ""),
    },
    {
      field: "totalprice",
      headerName: "قیمت نهایی",
      width: 150,
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
      cellClassName: (params) =>
        params.row.calculate === 0 ? "row-zero" : "row-normal",
      renderCell: (p) => formatPrice(getCalculatedPrice(p.row)),
    },
    {
      field: "enableCalc",
      headerName: "انتخاب ردیف",
      headerClassName: "header",
      headerAlign: "center",
      align: "center",
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
        <h4 className="rtl,font:tahoma,bolder">نظارت حین اجرا</h4>
        <strong>
          مجموع: {totalCalculatedPrice.toLocaleString("fa-ir")} ریال
        </strong>
      </div>
 {/* دکمه‌ها */}
      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-success" onClick={enableAllValidCalculations}>
          انتخاب همه
        </button>
        <button className="btn btn-danger" onClick={disableAllCalculations}>
          پاک کردن همه
        </button>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          افزودن ردیف جدید
        </button>
        <button className="btn btn-warning" onClick={removeManualRows}>
          حذف ردیف جدید
        </button>
        <button className="btn btn-secondary" onClick={goToHome}>
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