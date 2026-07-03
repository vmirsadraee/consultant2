import React from 'react';
import aboutImg from "../assets/images/about.png";

const Aboutuspage = () => {
  const downloadPersianPDF = () => {
    const link = document.createElement("a");
    link.href = "/persian-guide.pdf";
    link.download = "persian-guide.pdf";
    link.click();
  };

  const downloadEnglishPDF = () => {
    const link = document.createElement("a");
    link.href = "/english-guide.pdf";
    link.download = "english-guide.pdf";
    link.click();
  };

   // متد جدید برای دانلود فایل نمونه پروژه JSON
  const downloadSampleJSON = () => {
    const link = document.createElement("a");
    link.href = "/sample-project.json";
    link.download = "sample-project.json";
    link.click();
  };

  return (
    <div
      className="container-fluid px-4 py-3"
      style={{ backgroundColor: "#17c37b", minHeight: "100vh" }}
    >
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-info rounded p-3 text-center">
            <h3 className="m-0">About Us and Help</h3>
          </div>
        </div>
      </div>

      <div className="row align-items-start">
        <div className="col-md-4 text-start mb-4">
          <img
            src={aboutImg}
            alt="about"
            className="img-fluid"
            style={{ maxWidth: "320px" }}
          />
        </div>

        <div className="col-md-8">
          <div
            className="p-3 mb-4"
            dir="rtl"
            style={{ textAlign: "right", color: "#1f1f1f" }}
          >
            <p className="mb-3">
              این برنامه با React و با پشتیبانی FastAPI تنظیم شده است.
              جهت دریافت اطلاعات بیشتر و آگاهی از نحوه کار برنامه،
              دستورالعمل زیر را مطالعه نمایید. با ما تماس بگیرید.
            </p>

            <p className="mb-3">
              <strong>ایمیل:</strong> vmirsadraee2195@gmail.com
            </p>

            <button className="btn btn-primary" onClick={downloadPersianPDF}>
              دانلود دستورالعمل (PDF)
            </button>
           
          </div>

          <div
            className="p-3"
            dir="ltr"
            style={{ textAlign: "left", color: "#1f1f1f" }}
          >
            <p className="mb-3">
              This application is built with React and supported by FastAPI.
              To obtain more information and learn how the program works,
              please read the following instructions. Contact us.
            </p>

            <p className="mb-3">
              <strong>Email Address:</strong> vmirsadraee2195@gmail.com
            </p>

            <button className="btn btn-success" onClick={downloadEnglishPDF}>
              Download Instruction (PDF)
            </button>
             {/* کلید مورد نظر شما با کپشن Download sample */}
            
          </div>
          <div
            className="p-3"
            dir="ltr"
            style={{ textAlign: "left", color: "#1f1f1f" }}
          >
             <button className="btn btn-dark " dir="ltr" onClick={downloadSampleJSON}>
                Download sample
             </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Aboutuspage;
