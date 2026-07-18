import React from "react";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "./Page.css";
//=========== ایمپورت توابع دیگر صفحات ==================

export default function Invoicepage() {
  const navigate = useNavigate();

  const goToHome = () => navigate("/");

  const formatPrice = (v) =>
    v === null || v === undefined ? "" : Math.trunc(Number(v)).toLocaleString("fa-ir");

  // تبدیل عدد به حروف فارسی
  function numberToPersianWords(num) {
    if (!num) return "صفر";

    const ones = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
    const tens = ["", "ده", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
    const teens = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
    const hundreds = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
    const thousands = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

    function convertBelowThousand(n) {
      let result = [];
      if (n >= 100) {
        result.push(hundreds[Math.floor(n / 100)]);
        n %= 100;
      }
      if (n >= 10 && n <= 19) result.push(teens[n - 10]);
      else {
        if (n >= 20) {
          result.push(tens[Math.floor(n / 10)]);
          n %= 10;
        }
        if (n > 0) result.push(ones[n]);
      }
      return result.join(" و ");
    }

    let words = [];
    let groupIndex = 0;
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) words.unshift(`${convertBelowThousand(chunk)} ${thousands[groupIndex]}`.trim());
      num = Math.floor(num / 1000);
      groupIndex++;
    }

    return words.join(" و ");
  }

  //=================================== Export پروژه به JSON  =============================
  const exportLocalStorage = async () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    const json = JSON.stringify(data, null, 2);

    const a = document.createElement("a");
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "localstorage-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

 
  // Export Excel
  const exportExcel = () => {
    const table = document.querySelector("table");
    if (!table) return alert("جدولی پیدا نشد!");

    const wb = XLSX.utils.table_to_book(table, { sheet: "گزارش حق الزحمه" });
    XLSX.writeFile(wb, "گزارش_حق_الزحمه.xlsx");
  };

  // همه ردیف‌ها از localStorage به صورت داینامیک
  const rows = [
    { id: 2, title: "خدمات نظارت قبل از اجرا", field: "Final_befor", source: ["field_10", "field_24", "Final_befor"] },
    { id: 3, title: "خدمات نظارت ماهانه حین اجرا", field: "Final_durring", source: ["field_11", "field_25", "Final_durring"] },
    { id: 3, title: "خدمات نظارت موردی حین اجرا", field: "Final_case", source: ["field_12", "field_26", "Final_case"] },
    { id: 3, title: "خدمات نظارت فنی کارگاهی", field: "Final_site", source: ["field_13", "field_27", "Final_site"] },
    { id: 4, title: "خدمات نظارت بعد از اجرا", field: "Final_befor", source: ["field_14", "field_28", "Final_befor"] },
    { id: 5, title: "خدمات نظارت پشتیبانی", field: "Final_support", source: ["field_15", "field_29", "Final_support"] },
  ];

  //==========================================
  // 🚀 ارسال JSON کامل به بک‌اند
  const sendToBackend = async () => {

    try {

      // خواندن داده آماده
      const beforeExecutionTable = JSON.parse(localStorage.getItem("beforeExecutionTable") || "{}");
      const durringExecutionTable = JSON.parse(localStorage.getItem("durringExecutionTable") || "{}");
      const caseExecutionTable = JSON.parse(localStorage.getItem("caseExecutionTable") || "{}");
      const aftereExecutionTable = JSON.parse(localStorage.getItem("aftereExecutionTable") || "{}");

      const payload = {
        project: {
          createdAt: new Date().toISOString(),
        },

        tables: {
          before: beforeExecutionTable,
          durring: durringExecutionTable,
          case: caseExecutionTable,
          after: aftereExecutionTable
        },
      };

      console.log(beforeExecutionTable);
      console.log(durringExecutionTable);
      console.log(caseExecutionTable);
      console.log(aftereExecutionTable);



      //console.log(JSON.stringify(beforeExecutionTable, null, 2));
      const res = await fetch(
        "https://consultant2-v2.vercel.app/api/report/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",      // ← اضافه
            "Pragma": "no-cache",             // ← اضافه
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Server error");
      }

      const blob = await res.blob();

      saveAs(blob, "report.docx");

    } catch (err) {

      console.error(err);

      alert("خطا در ارسال");

    }

  };



  //========================================== 
  return (
    <div style={{ width: "100%", padding: 5, direction: "rtl" }}>
      <h4 className="Titlem">خلاصه مالی حق الزحمه مشاوران</h4>

      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-outline-light" onClick={exportExcel}>
          گزارش با Excel
        </button>
        <button className="btn btn-outline-light" onClick={sendToBackend}>
          گزارش با Word
        </button>
        <button className="btn btn-outline-light" onClick={exportLocalStorage}>
          ذخیره کردن پروژه
        </button>
        <button className="btn btn-secondary" onClick={goToHome}>
          صفحه اصلی
        </button>
      </div>
     


      <table className="table-custom"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          direction: "rtl",
          fontFamily: "Tahoma",
          tableLayout: "fixed",
          fontSize: "13px",
        }}
      >
        <thead>
          <tr>
            <td className="Title" style={{ width: "6%" }} >شماره فصل</td>
            <td className="Title">شرح فصل</td>
            <td className="Title">مبلغ قراردادی (ریال)</td>
            <td className="Title">مبلغ تجمعی تائید شده قبلی (ریال)</td>
            <td className="Title">حق الزحمه این ماه مشاور(ریال)</td>
            <td className="Title" style={{ width: "25%" }}>مبلغ به حروف (ریال)</td>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="cream">{row.id}</td>
              <td className="cream">{row.title}</td>
              <td className="cream">{formatPrice(localStorage.getItem(row.source[0]))}</td>
              <td className="cream">{formatPrice(localStorage.getItem(row.source[1]))}</td>
              <td className="cream">{formatPrice(localStorage.getItem(row.source[2]))}</td>
              <td className="cream">{numberToPersianWords(Number(localStorage.getItem(row.source[2]) || 0))} ریال</td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );

}
