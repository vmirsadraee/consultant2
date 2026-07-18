import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Page.css";
import {formatPriceInput } from "../utils/funct"


const STORAGE_PREFIX = "billpage_field_";

// ۱. انتقال متغیر به بیرون از کامپوننت (برای رفع Warning)
const sections = [
  {
    title: "اطلاعات صورت وضعیت پیمانکار و پیشرفت کار را وارد نمائید",
    fields_bill: [
      { id: 1, label: "جمع کل مبلغ صورت وضعیت اصلاح شده فعلی با در نظر گرفتن مفاد بند 1-2-7-5 بخشنامه" },
      { id: 2, label: "جمع کل مبلغ صورت وضعیت اصلاح شده قبلی با در نظر گرفتن مفاد بند 1-2-7-5 بخشنامه" },
      { id: 3, label: "کارکرد ماهانه صورت وضعیت پیمانکار (تفاضل ردیف‌های 3و4) (F)" },
    ],
  },
];

const Billpage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const savedData = {};
    sections.forEach((section) => {
      section.fields_bill.forEach((field) => {
        const value = localStorage.getItem(`${STORAGE_PREFIX}${field.id}`);
        if (value) savedData[field.id] = value;
      });
    });
    setFormData(savedData);
    // حالا چون sections بیرون است، این آرایه خالی [] دیگر خطا یا هشدار نمی‌دهد
  }, []);

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, value);
  };

  return (
    <div className="container mt-2" dir="rtl">
      <h4 className="Titlem mb-4">صورت وضعیت پیمانکار و پیشرفت پروژه</h4>
      
      {/* دکمه‌ها و بخش‌های دیگر */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex gap-2">
          <button className="btn btn-outline-light">دانلود فایل</button>
          <button className="btn btn-secondary" onClick={() => navigate("/Calculatepage")}>
            مرحله بعد
          </button>
        </div>
      </div>

      <table className="table-custom ">
        <thead  >
          <tr >
            <th className="col-id">ردیف</th>
            <th className="col-label">شرح</th>
            <th className="col-value">مبلغ (ریال) </th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section, idx) => (
            <React.Fragment key={idx}>
              <tr >
                <td colSpan={3} className="section-title" >{section.title}</td>
              </tr>
              {section.fields_bill.map((field) => (
                <tr key={field.title}>
                  <td style={{textAlign: "center", verticalAlign: "middle" }}>{field.id}</td>
                  <td >{field.label}</td>
                  <td>
                    <input
                      type="text"
                      className="Title1"
                      value={formData[field.id] || ""}
                      onChange={(e) => handleChange(field.id,formatPriceInput(e.target.value))}
                    />
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Billpage;
