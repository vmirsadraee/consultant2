import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "./Page.css";

//import { HeaderWrapper } from "docx";
//import { VscWordWrap } from "react-icons/vsc";

export default function Beforpage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPriceRow, setEditPriceRow] = useState(null);
  const [priceInput, setPriceInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    serial: "",
    subject: "",
    exprience: "",
    jopclass: "",
    WorkHistory: "",
    rank: "",
    unitprice: "",
    place_eff: "",
  });


  const faToEn = (str = "") =>
    str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

  const [a, setCoefficient1] = useState(0);
  const [b, setCoefficient2] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const a = localStorage.getItem("field_22");
    const b = localStorage.getItem("field_20");

    if (a) setCoefficient1(Number(a));
    if (b) setCoefficient2(Number(b));
  }, []);



  // بارگذاری اولیه داده‌ها

  useEffect(() => {
    const savedRows1 = localStorage.getItem("monitoringRows_site");

    if (savedRows1) {
      setRows(JSON.parse(savedRows1));
    } else {
      setRows([]); // دیتای خالی ولی معتبر
    }

    setLoading(false); // 🔑 همیشه باید اجرا شود
  }, []);


  // ذخیره خودکار لوکال
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("monitoringRows_site", JSON.stringify(rows));
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

  const formatPriceInput = (value) => {
    const cleaned = faToEn(value).replace(/[^\d]/g, "");
    if (!cleaned) return "";
    return Number(cleaned).toLocaleString("fa-IR");
  };

  const getCalculatedPrice = (row) => {
    const unit = Number(row.unitprice);
    const day = Number(row.normaloperation || 0);
    const night = Number(row.nightoperation || 0);
    const place = Number(row.place_eff || 1);

    if (
      isNaN(unit) ||
      isNaN(day) ||
      isNaN(night) ||
      isNaN(place) ||
      isNaN(a) ||
      isNaN(b)
    ) {
      return "";
    }

    return Math.trunc(a * b * place * (day + 1.4 * night) * unit);
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
      exprience: manualForm.exprience,
      jopclass: manualForm.jopclass,
      WorkHistory: manualForm.WorkHistory,
      rank: manualForm.rank,
      unitprice: manualForm.unitprice,
      place_eff: manualForm.place_eff,
      calculate: 1,
      isManual: true,
    };
    setRows((prev) => [...prev, newRow]);
    setShowModal(false);
    setManualForm({
      serial: "",
      subject: "",
      exprience: "",
      jopclass: "",
      WorkHistory: "",
      rank: "",
      unitprice: "",
      place_eff: ""
    });
  };

  const removeManualRows = () => {
    const confirmDelete = window.confirm("آیا می‌خواهید این ردیف را حذف نمائید؟");
    if (!confirmDelete) return;
    setRows((prev) => prev.filter((r) => !r.isManual));
  };

  const goTonext = () => {
    navigate("/Afterpage");
  };

  const fields = [
    { key: "serial", label: "شماره ردیف" },
    { key: "subject", label: "نام و نام خانوادگی" },
    { key: "exprience", label: "تخصص" },
    { key: "jopclass", label: "طبقه شغلی" },
    { key: "WorkHistory", label: "سابقه کار" },
    { key: "rank", label: "رتبه شغلی" },
    { key: "unitprice", label: "بهای پایه نظارت (ریال)" },
    { key: "place_eff", label: "ضریب منطقه‌ای" },
  ];


  const totalCalculatedPrice = rows.reduce((sum, r) => {
    const val = Number(getCalculatedPrice(r));
    return sum + (isNaN(val) ? 0 : val);
  }, 0);



  useEffect(() => {
    localStorage.setItem(
      "totalPrice_site",
      totalCalculatedPrice.toString()
    );
  }, [totalCalculatedPrice]);

  const clearGrid = () => {
    if (window.confirm("داده‌های جدول پاک شود؟")) {
      localStorage.removeItem("monitoringRows_case");
      setRows([]);
    }
  };
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


  // ستون‌های DataGrid
  const columns = [
    {
      field: "serial",
      headerName: "شماره ردیف",
      flex: 0.12,
      headerClassName: "header1",
      headerAlign: "center",
      align: "center",
      cellClassName: "row-normal",
      renderCell: (p) => formatInteger(p.value),
    },
    {
      field: "subject",
      headerName: "نام ونام خانوادگی",
      flex: 0.18,
      headerClassName: "header1",
      headerAlign: "center",
      align: "center",
      cellClassName: "row-normal",
      renderCell: (p) => (
        <div style={{ direction: "rtl", whiteSpace: "normal" }}>{p.value}</div>
      ),
    },
    {
      field: "exprience",
      headerName: "تخصص ",
      flex: 0.07,
      headerClassName: "header2",
      headerAlign: "center",
      align: "right",
      cellClassName: "row-normal",
    },
    {
      field: "jopclass",
      headerName: "طبقه شغلی",
      flex: 0.07,
      headerClassName: "header2",
      headerAlign: "center",
      align: "center",
      cellClassName: "row-normal",
    },
    {
      field: "WorkHistory",
      headerName: "سایقه کار ",
      flex: 0.07,
      headerClassName: "header2",
      headerAlign: "center",
      align: "center",
      cellClassName: "row-normal",
    },

    {
      field: "rank",
      headerName: "رتبه شغلی",
      flex: 0.07,
      headerClassName: "header1",
      headerAlign: "center",
      align: "center",
      cellClassName: "row-normal",
    },
    {
      field: "unitprice",
      headerName: "بهای پایه نظارت (ریال)",
      flex: 0.12,
      headerClassName: "header2",
      headerAlign: "center",
      align: "center",
      cellClassName: "row-normal",
      renderCell: (p) => (formatPrice(p.value)),

    },

    {
      field: "normaloperation",
      headerName: " ساعت کارعادی",
      flex: 0.08,
      headerClassName: "header2",
      type: "number",
      editable: true,
      align: "center",
      headerAlign: "center",
      cellClassName: "row-normal",
    },

    {
      field: "nightoperation",
      headerName: "ساعت کارکرد شبانه",
      flex: 0.08,
      headerClassName: "header2",
      type: "number",
      editable: true,
      align: "center",
      headerAlign: "center",
      cellClassName: "row-normal",

    },

    {
      field: "place_eff",
      headerName: "ضریب منطقه ای",
      flex: 0.08,
      headerClassName: "header2",
      type: "number",
      align: "center",
      headerAlign: "center",
      editable: true,
      cellClassName: "row-normal",

    },
    {
      field: "totalprice",
      headerName: "جمع کل (ریال)",
      flex: 0.15,
      headerClassName: "header2",
      type: "number",
      align: "center",
      headerAlign: "center",
      cellClassName: "row-normal",
      renderCell: (p) => formatPrice(getCalculatedPrice(p.row)),
    },


  ];

  if (loading) return <h3>در حال بارگذاری...</h3>;

  return (
    <div style={{ width: "100%", padding: 20, direction: "rtl" }}>
      <div className="d-flex justify-content-between mb-2">
        <h4 className="Titlem rtl">نظارت کارگاهی</h4>
        <strong>
          مجموع: {totalCalculatedPrice.toLocaleString("fa-ir")} ریال
        </strong>
      </div>
      {/* دکمه‌ها */}
      <div>
        <div className="mb-3 d-flex gap-2">

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
          if (!params?.row) return 50; // ارتفاع پیش‌فرض
          return 'auto'; // تیتر ثابت، بقیه داینامیک
        }}

        getRowClassName={(p) => (p.row.isManual ? "manual-row" : "")}
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



      {/* Modal افزودن ردیف دستی */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h5>افزودن ردیف دستی</h5>
            {fields.map(({ key, label }) => (
              <input
                key={key}
                placeholder={label}
                value={manualForm[key]}
                onChange={(e) =>
                  setManualForm({ ...manualForm, [key]: e.target.value })
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

