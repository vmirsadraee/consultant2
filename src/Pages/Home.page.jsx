import React, { useEffect, useState } from "react";
import "./Page.css";

const Homepage = () => {
  const [table_Name, setTableName] = useState("");
  const [bText, setBText] = useState("");
  const [selectedYear, setSelectedYear] = useState(""); // ← کنترل select

  useEffect(() => {
    const savedTable = localStorage.getItem("table_name");
    const savedBText = localStorage.getItem("bText");

    if (savedTable) setTableName(savedTable);
    if (savedBText) setBText(savedBText);
  }, []);

  // ذخیره table_Name در localStorage
  useEffect(() => {
    if (table_Name) localStorage.setItem("table_name", table_Name);
    if (bText) localStorage.setItem("bText", bText);
  }, [table_Name, bText]);

  // تابع بروزرسانی table_name و توضیح
  const refrence_select = (yearValue) => {
    let table_name = "";
    let b = "";

    switch (yearValue) {
      case "1":
        table_name = "tablea1400";
        b = "این صورت حساب بر اساس تعرفه بخشنامه سال 1400 تنظیم می شود.";
        break;
      case "2":
        table_name = "tablea1401";
        b = "این صورت حساب بر اساس تعرفه بخشنامه سال 1401 تنظیم می شود.";
        break;
      case "3":
        table_name = "tablea1402";
        b = "این صورت حساب بر اساس تعرفه بخشنامه سال 1402 تنظیم می شود.";
        break;
      case "4":
        table_name = "tablea1403";
        b = "این صورت حساب بر اساس تعرفه بخشنامه سال 1403 تنظیم می شود.";
        break;
      case "5":
        table_name = "tablea1404";
        b = "این صورت حساب بر اساس تعرفه بخشنامه سال 1404 تنظیم می شود.";
        break;
      default:
        table_name = "";
        b = "";
        break;
    }

    setTableName(table_name);
    setBText(b);
  };

  const importLocalStorage = (e) => {
    if (!e?.target?.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        localStorage.clear(); // پاک کردن قبلی‌ها

        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });

        // بروزرسانی جدول و توضیح بعد از restore
        refrence_select(selectedYear);

        alert("LocalStorage با موفقیت بازیابی شد");
      } catch (err) {
        alert("فایل JSON معتبر نیست");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="title-kader p-3 rounded text-center">
          <h5 className="Titlem mb-0">
            به سایت محاسبه حق الزحمه مشاوران خوش آمدید
          </h5>
        </div>
      </div>

      {/* Content */}
      <div className="row align-items-center">
        {/* Left Column */}
        <div className="col-md-7" dir="rtl">
          <p className="mb-3">
            این برنامه به شما کمک میکند صورت حساب حق الزحمه خود را تهیه نمائید .
          </p>
          <p className="mb-3">
            یک پروژه جدید را شروع نمائید یا اطلاعات قبلی خود را دانلود نمائید .
          </p>
          <p className="mb-3" id="p1">{bText}</p>
        </div>

        {/* Right Column */}
        <div
          className="col-md-5 d-flex flex-column align-items-center"
          style={{ marginTop: "80px" }}
        >
          <div className="card p-4 mt-1 w-75 text-center shadow-sm">
            <select
              className="form-select form-select-sm mb-3 text-center"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">بخشنامه تنظیم قرارداد</option>
              <option value="1">سال 1400</option>
              <option value="2">سال 1401</option>
              <option value="3">سال 1402</option>
              <option value="4">سال 1403</option>
              <option value="5">سال 1404</option>
            </select>

            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: "20px" }}
              onClick={() => {
                if (!selectedYear) return alert("لطفاً سال را انتخاب کنید");
                if (window.confirm("همه داده‌ها پاک شود؟")) {
                  localStorage.clear();
                  refrence_select(selectedYear);
                }
              }}
            >
              پروژه جدید
            </button>
          </div>

          <h4 className="Titlem" style={{ marginTop: "40px" }}>
            چنانچه فایل مشخصات دارید دانلود نمائید
          </h4>
          <input
            className="btn btn-outline-light"
            style={{ marginBlockEnd: "20px" }}
            type="file"
            accept="application/json"
            onChange={importLocalStorage}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
