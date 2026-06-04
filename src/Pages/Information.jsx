import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Page.css";

const MonitoringStatement = () => {

  const navigate = useNavigate();
  const goTonext = () => {
    navigate("/Beforpage");
  };


  // تعریف همه بخش‌ها و فیلدها
  const sections = [
    {
      title: "اطلاعات عمومی و پایه پروژه",
      fields: [
        { id: 1, label: "نام پروژه" },
        { id: 2, label: "شماره قرارداد" },
        { id: 3, label: "تاریخ قرارداد" },
        { id: 4, label: "کارفرما" },
        { id: 5, label: "مشاور" },
        { id: 6, label: "پیمانکار" },
        { id: 7, label: "مبلغ پيمان ( C ) با در نظر گرفتن مفاد بند 1-2-7-5 بخشنامه(ريال)" },
        { id: 8, label: "سقف نصاب معاملات کوچک (ریال)" },
        { id: 9, label: "مدت پیمان" },

      ],
    },
    {
      title: "حق الزحمه و هزینه‌های مشاور در قرارداد",
      fields: [
        { id: 10, label: "برآورد حق الزحمه خدمات نظارت قبل از اجرا" },
        { id: 11, label: "برآورد حق الزحمه خدمات نظارت ماهانه حین اجرا" },
        { id: 12, label: "برآورد حق الزحمه خدمات نظارت موردی" },
        { id: 13, label: "برآورد حق الزحمه خدمات نظارت ماهانه بعد از اجرا" },
        { id: 14, label: "برآورد حق الزحمه خدمات نظارت کارگاهی" },
        { id: 15, label: "برآورد حق الزحمه خدمات نظارت پشتیبانی" },
      ],
    },

    {
      title: "  ضرایب اصلی پروژه",
      fields: [
        { id: 16, label: "ضریب اصلاح خدمات نظارت - قبل از اجرا" },
        { id: 17, label: "ضریب اصلاح خدمات نظارت - ماهانه حین اجرا" },
        { id: 18, label: "ضریب اصلاح خدمات نظارت - موردی حین اجرا" },
        { id: 19, label: "ضریب اصلاح خدمات نظارت - بعد از اجرا" },
        { id: 20, label: "ضریب ویژگی" },
        { id: 21, label: "ضریب تطابق سال" },
      ],
    },

    {
      title: "ضرایب کارگاهی",
      fields: [
        { id: 22, label: "ضریب تردد کارگاهی طبق قرارداد (K)" },
        { id: 23, label: "ضریب منطقه‌ای (r)" },

      ],
    },

    {
      title: " آخرین صورت وضعیت تائید شده تجمعی مشاور",
      fields: [
        { id: 24, label: "مبلغ خدمات نظارت - قبل از اجرا" },
        { id: 25, label: "مبلغ خدمات نظارت - ماهانه حین اجرا" },
        { id: 26, label: "مبلغ خدمات نظارت -موردی " },
        { id: 27, label: "مبلغ خدمات نظارت - کارگاهی " },
        { id: 28, label: "مبلغ خدمات نظارت - بعد از اجرا" },
        { id: 29, label: "مبلغ خدمات نظارت - پشتیبانی" },

      ],
    },

  ];

  // بارگذاری داده‌ها از localStorage
  useEffect(() => {
    sections.forEach(section => {
      section.fields.forEach(field => {
        const value = localStorage.getItem(`field_${field.id}`);
        if (value) {
          const inputEl = document.getElementById(`input_${field.id}`);
          if (inputEl) inputEl.value = value;
        }
      });
    });
  },);

  // ذخیره داده‌ها در localStorage هنگام تغییر
  const handleChange = (id, e) => {
    localStorage.setItem(`field_${id}`, e.target.value);
  };

  const Section = ({ title }) => (
    <tr className="table-primary text-center">
      <td colSpan={3} className="fw-light">{title}</td>
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

  const clearPageData = () => {
    if (window.confirm("همه داده‌ها در این صفحه پاک شود؟")) {
      sections.forEach(section => {
        section.fields.forEach(field => {
          localStorage.removeItem(`field_${field.id}`);
          const inputEl = document.getElementById(`input_${field.id}`);
          if (inputEl) inputEl.value = "";
        });
      });
    }
  };
  //====================   آماده سازی اطلاعات برای پرینت و گزارش ===================
  /*  const extractMonitoringBaseInfo = () => {
     return {
       id: "monitoring_base_info",
       type: "source",
       page: "MonitoringStatement",
       title: "اطلاعات پایه محاسبات خدمات نظارت",
       sections: sections.map(section => ({
         title: section.title,
         fields: section.fields.map(field => ({
           id: field.id,
           key: `field_${field.id}`,
           label: field.label,
           value: localStorage.getItem(`field_${field.id}`) || ""
         }))
       }))
     };
   };
 */

  return (

    <div dir="rtl">
      <h4 className="Titlem text-center mb-4">صورت وضعیت خدمات نظارت - ثبت اطلاعات پایه محاسبات</h4>
      {/* دکمه‌ها */}
      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-outline-light" onClick={clearPageData}>
          صفحه جدید
        </button>

        <button className="btn btn-secondary" onClick={goTonext}>
          مرحله بعد
        </button>
      </div>


      <table className="table table-bordered table-striped table-info text-center ">
        <thead className="table-light">
          <tr>
            <th className="row-normal" style={{ width: "6%" }}>ردیف</th>
            <th className="row-normal" style={{ width: "30%" }}>شرح</th>
            <th className="row-normal" style={{ width: "64%" }}>اطلاعات پروژه را وارد نمائید</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section, idx) => (
            <React.Fragment key={idx}>
              <Section title={section.title} />
              {section.fields.map(field => (
                <Row key={field.id} id={field.id} label={field.label} />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonitoringStatement;
