import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Page.css";
import API from "./api";


const Billpage = () => {

const STORAGE_PREFIX = "billpage_field_"; // پیش‌وند منحصربه‌فرد برای این جدول
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
  
    // بارگذاری داده‌ها از localStorage
  useEffect(() => {
    sections.forEach(section => {
      section.fields_bill.forEach(field => {
        const value = localStorage.getItem(`${STORAGE_PREFIX}${field.id}`);
        if (value) {
          const inputEl = document.getElementById(`input_${field.id}`);
          if (inputEl) inputEl.value = value;
        }
      });
    });
  }, );

  // ذخیره داده‌ها در localStorage هنگام تغییر
  const handleChange = (id, e) => {
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, e.target.value);
  };


  const Section = ({ title }) => (
    <tr className="table-primary text-center">
      <td colSpan={3} className="fw-bold">{title}</td>
    </tr>
  );

  const Row = ({ id, label }) => (
    <tr>
      <td className="text-center align-middle">{id}</td>
      <td className="text-end align-middle">{label}</td>
      <td>
        <input
          type="text"
          className="form-control"
          id={`input_${id}`}
          onChange={(e) => handleChange(id, e)}
        />
      </td>
    </tr>
  );

   const navigate = useNavigate();

  return (
      <div className="container mt-2" dir="rtl">
        <h4 className="Titlem mb-4">صورت وضعیت پیمانکار و پیشرفت پروژه </h4>
      
      <div className="mb-3 d-flex justify-content-between align-items-center">
  
  {/* دکمه‌ها – سمت راست */}
  <div className="d-flex gap-2">
    <button
      className="btn btn-success"
      onClick={() =>window.open(`${API}/download-excel`)

    >
      دانلود فایل
    </button>

    <button className="btn btn-secondary" onClick={() => navigate("/Calculatepage")}>
      مرحله بعد
    </button>
  </div>

  {/* متن – سمت چپ */}
  <strong className="text-start">
    ابتدا فایل را دانلود کرده سپس محاسبات را انجام داده و نتیجه را ثبت نمائید
  </strong>

</div>


        <table className="table table-bordered table-striped table-info text-center">
          <thead className="table-light">
            <tr>
              <th style={{ width: "6%" }}>ردیف</th>
              <th style={{ width: "30%" }}>شرح</th>
              <th style={{ width: "64%" }}>اطلاعات صورت وضعیت راوارد نمائید</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section, idx) => (
              <React.Fragment key={idx}>
                <Section title={section.title} />
                {section.fields_bill.map(field => (
                  <Row key={field.id} id={field.id} label={field.label} />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Billpage;
  
