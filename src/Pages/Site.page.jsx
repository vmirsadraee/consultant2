import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "./Page.css";

export default function Sitepage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPriceRow, setEditPriceRow] = useState(null);
  const [priceInput, setPriceInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [manualForm, setManualForm] = useState({
    serial: "",
    subject: "",
    jopclass: "",
    rank: "",
    WorkHistory: "",
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
      jopclass: manualForm.jopclass,
      rank: manualForm.rank,
      WorkHistory: manualForm.WorkHistory,
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
      jopclass: "",
      rank: "",
      WorkHistory: "",
      unitprice: "",
      place_eff: ""
    });
  };

  const removeSelectedRow = () => {
  if (!selectedRowId) {
    alert("لطفاً ابتدا یک ردیف را از جدول انتخاب کنید.");
    return;
  }
  const confirmDelete = window.confirm("آیا می‌خواهید این ردیف را حذف نمائید؟");
  if (!confirmDelete) return;
  
  setRows((prev) => prev.filter((r) => r.ID !== selectedRowId));
  setSelectedRowId(null); // ریست کردن انتخاب
};


  const goTonext = () => {
    navigate("/Afterpage");
  };


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
      headerName: " ردیف",
      flex: 0.05,
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
      field: "jopclass",
      headerName: " شغل",
      flex: 0.07,
      headerClassName: "header1",
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
      field: "WorkHistory",
      headerName: "سایقه کار ",
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
      headerClassName: "header1",
      headerAlign: "center",
      align: "center",
      cellClassName: "row-normal",
      renderCell: (p) => (formatPrice(p.value)),

    },

    {
      field: "normaloperation",
      headerName: " ساعت کارعادی",
      flex: 0.08,
      headerClassName: "header1",
      type: "number",
      editable: true,
      align: "center",
      headerAlign: "center",
      cellClassName: "row-normal",
    },

    {
      field: "nightoperation",
      headerName: "ساعت کارشبانه",
      flex: 0.08,
      headerClassName: "header1",
      type: "number",
      editable: true,
      align: "center",
      headerAlign: "center",
      cellClassName: "row-normal",

    },

    {
      field: "place_eff",
      headerName: "ضریب منطقه ",
      flex: 0.08,
      headerClassName: "header1",
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
      headerClassName: "header1",
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

          <button className="btn btn-outline-light" onClick={() => setShowModal(true)}>
            افزودن ردیف 
          </button>
          <button className="btn btn-outline-light" onClick={removeSelectedRow}>
            حذف ردیف 
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
        onRowClick={(params) => setSelectedRowId(params.id)}
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
      
      {/* فیلدهای متنی ساده */}
      <input
        placeholder="شماره ردیف"
        value={manualForm.serial}
        onChange={(e) => setManualForm({ ...manualForm, serial: e.target.value })}
      />
      <input
        placeholder="نام و نام خانوادگی"
        value={manualForm.subject}
        onChange={(e) => setManualForm({ ...manualForm, subject: e.target.value })}
      />

      {/* انتخاب طبقه شغلی (jopclass) */}
      <select
        className="form-select mb-2"
        value={manualForm.jopclass}
        onChange={(e) => setManualForm({ ...manualForm, jopclass: e.target.value })}
      >
        <option value="">انتخاب طبقه شغلی...</option>
        <option value="سرناظر">سرناظر</option>
        <option value="ناظر">ناظر</option>
        <option value="کمک ناظر">کمک ناظر</option>
      </select>

      {/* انتخاب رتبه شغلی (rank) */}
      <select
        className="form-select mb-2"
        value={manualForm.rank}
        onChange={(e) => setManualForm({ ...manualForm, rank: e.target.value })}
      >
        <option value="">انتخاب رتبه شغلی...</option>
        <option value="1">لیسانس و بالاتر</option>
        <option value="2">زیر لیسانس</option>
      </select>

      {/* انتخاب سابقه کار (WorkHistory) بر اساس جدول پیوست */}
      <select
        className="form-select mb-2"
        value={manualForm.WorkHistory}
        onChange={(e) => setManualForm({ ...manualForm, WorkHistory: e.target.value })}
      >
        <option value="">انتخاب رتبه سابقه کار...</option>
        <option value="+20 سال">رتبه ۱ (سابقه ۲۰+ سال)</option>
        <option value="13-20 سال">رتبه ۲ (سابقه ۱۳-۲۰ سال)</option>
        <option value="8-13 سال">رتبه ۳ (سابقه ۸-۱۳ سال)</option>
        <option value="3-8 سال">رتبه ۴ (سابقه ۳-۸ سال)</option>
        <option value="0-3 سال">رتبه ۵ (سابقه ۰-۳ سال)</option>
      </select>

      <input
        placeholder="بهای پایه نظارت (ریال)"
        value={manualForm.unitprice}
        onChange={(e) => setManualForm({ ...manualForm, unitprice: e.target.value })}
      />
      <input
        placeholder="ضریب منطقه‌ای"
        value={manualForm.place_eff}
        onChange={(e) => setManualForm({ ...manualForm, place_eff: e.target.value })}
      />

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

