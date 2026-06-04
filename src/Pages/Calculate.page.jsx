import React , { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Page.css";

export default function Calculatepage() {

  const [a1, setCoefficient1] = useState(0);
  const [a2, setCoefficient2] = useState(0);
  const [a3, setCoefficient3] = useState(0);
  const [durringprice_befor , setTototalPrice_durring] = useState(0);
  const [siteprice_befor    , setTototalPrice_site] = useState(0);
  const [a4, setCoefficient4] = useState(0);
  const [a5, setCoefficient5] = useState(0);
  const [a6, setCoefficient6] = useState(0);
  const [a7, setCoefficient7] = useState(0);
  const [a8, setCoefficient8] = useState(0);

  const navigate = useNavigate();
  const formatPrice = (v) =>
    v === null || v === undefined
      ? ""
      : Math.trunc(Number(v)).toLocaleString("fa-ir");

  // بارگذاری ضرایب a و b
    useEffect(() => {
      const a1  = localStorage.getItem("field_7"); 
      if (a1) setCoefficient1(Number(a1));
      const a2 = localStorage.getItem("billpage_field_3"); // کارکرد اصلاح شده پیمانکار در این ماه
      if (a2) setCoefficient2(Number(a2));
      const a3 = localStorage.getItem("field_11"); 
      if (a3) setCoefficient3(Number(a3)); 
      const a4 = localStorage.getItem("field_20"); //ضریب ویژگی کار
      if (a4) setCoefficient4(Number(a4));
      const a5 = localStorage.getItem("field_22"); // تردد کارگاهی
      if (a5) setCoefficient5(Number(a5));
      const a6 = localStorage.getItem("field_23"); // منطقه ای
      if (a6) setCoefficient6(Number(a6));
      const a7 = localStorage.getItem("field_21"); // ضذریب تطابق
      if (a7) setCoefficient7(Number(a7));
      const a8 = localStorage.getItem("field_8"); //صقف معاملات کوچک
      if (a8) setCoefficient8(Number(a8));
      
      const durringprice_befor = localStorage.getItem("totalPrice_durring");
      if (durringprice_befor) { setTototalPrice_durring(Number(durringprice_befor));}  
      
      const siteprice_befor = localStorage.getItem("totalPrice_site");
      if (siteprice_befor) { setTototalPrice_site(Number(siteprice_befor));}    
   
    }, []);
    
     const A1 = a1 !== 0 ? a2 / a1* 100 : 0; // درصد پیشرفت ماهانه پروژه 
     const A2 = A1 !== 0 ? A1 * a3 /100 : 0;  // مبلغ کارکرد  ماهانه پروژه بر اساس پیشرفت پروژه 
     const Final_durring=
           Math.min(A2, durringprice_befor) + 0.35 * Math.abs(durringprice_befor - A2); // صورت حساب قطعی خدمات ماهانه مشاور      
     //=============== محاسبه حق الزحمه فنی کارگاهی ===============
     const Db =  8 * (a2 / 1000) ** 0.64 * a4 * a5 * a6 * a7 *1000; // پیشرفت کار
     const bossprice = 1254545450;

     function calcValue(Db, a8, siteprice_befor) {
         if (siteprice_befor >= Db) {
         if (Db > 2 * a8 && siteprice_befor >= 3.5 * Db) {
         return 2 * Db;
                       }
         return Db + 0.4 * (siteprice_befor - Db);
                       }

         if (siteprice_befor < 0.5 * Db) {
         return siteprice_befor;
                       }

         return siteprice_befor + 0.4 * (Db - siteprice_befor);
         }

     const Final_site = Math.max(
           calcValue(Db, a8, siteprice_befor),
           bossprice
         );

    useEffect(() => {
  if (Final_durring !== undefined && Final_durring !== null) {
    localStorage.setItem("Final_durring", String(Final_durring));
  }
}, [Final_durring]);

useEffect(() => {
  if (Final_site !== undefined && Final_site !== null) {
    localStorage.setItem("Final_site", String(Final_site));
  }
}, [Final_site]);


     
  return (  

    <div style={{ width: "100%", padding: 5, direction: "rtl" }}>
    <div className="mb-1 d-flex gap-0">
        <button className="btn btn-secondary" onClick={() => navigate("/Supportpage")}>   
        مرحله بعد
        </button>
       
       
    </div>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        direction: "rtl",
        fontFamily: "Tahoma",
        tableLayout: "fixed",
        fontSize: "13px"
      }}
    >
     {/* ====== HEADER ====== */}
      {/*<thead>
        <tr>
          <th className="th">1</th>
          <th className="th">2</th>
          <th className="th">3</th>
          <th className="th">4</th>
          <th className="th">5</th>
          <th className="th">6</th>
          <th className="th">7</th>
        </tr>
      </thead>*/}
      <thead>
        <tr>
          <td className="Title">مبلغ پيمان ( C ) با در نظر گرفتن مفاد بند 1-2-7-5 بخشنامه(ريال)</td>
          <td className="Title">سقف نصاب معاملات کوچک (ریال)</td>
          <td className="Title">برآورد کل حق الزحمه نظارت ماهانه حین اجراي مشاور بر اساس قرارداد (Ba)</td>
          <td className="Title">برآورد کل حق الزحمه نظارت فنی کارگاهی در قرارداد (Bb)</td>
          <td className="Title">ضریب ویژگی کار q</td>
          <td className="Title">ضریب منطقه ای (r)</td>
          <td className="Title">ضریب تردد کارگاهی طبق قرارداد (K)</td>


        </tr>
      </thead>

      <tbody>
        {/* ====== اطلاعات قراردادی ====== */}
        <tr>
          <td className="cream">{formatPrice(localStorage.getItem("field_7"))}</td>
          <td className="cream">{formatPrice(localStorage.getItem("field_8"))}</td>
          <td className="cream">{formatPrice(localStorage.getItem("field_11"))}</td>
          <td className="cream">{formatPrice(localStorage.getItem("field_14"))}</td>
          <td className="cream">{localStorage.getItem("field_20")}</td>
          <td className="cream">{localStorage.getItem("field_23")}</td>
          <td className="cream">{localStorage.getItem("field_22")}</td>        
        </tr>


 
            {/* ======   تیتر بخش ماهانه حین احرا====== */}
        <tr>
          <td style={{ background: "#d9d9d9", fontWeight: "bold" }} colSpan={7}>
           محاسبه و پرداخت حق‌الزحمه خدمات ماهانه حین اجرا (ریال)
          </td>
        </tr>

        
            {/* ======   اطلاعات حین احرا====== */}

        {/*<td style={td}>{data.monthlyFeePercent}%</td>
          <td style={td}>{data.F.toLocaleString()}</td>*/}
        <tr>
          <td className="Title">
           جمع کل مبلغ صورت وضعیت اصلاح شده فعلی با در نظر گرفتن مفاد بند 1-2-7-5 بخشنامه
          </td>
          <td className="Title">جمع کل مبلغ صورت وضعیت اصلاح شده قبلی با در نظر گرفتن مفاد بند 1-2-7-5 بخشنامه</td>
          <td className="Title">کارکرد ماهانه صورت وضعیت پیمانکار (تفاضل ردیف‌های 3و4) (F)</td>
          <td className="Title">پیشرفت ماهانه پروژه 𝑷=𝑭/𝑪</td>
          <td className="Title">برآورد حق‌الزحمه  بر اساس پیشرفت ماهانه پروژه </td>
          <td className="Title">حق الزحمه ماهانه کارکرد مشاور (Ea)</td>
          <td className="Title">حق الزحمه درخواستی مشاور  موضوع بند 3-1-3 (ریال)</td>
        </tr>

        {/* ====== جمع کل ====== */}
        <tr>
          <td className="cream">{formatPrice(localStorage.getItem("billpage_field_1"))}</td>
          <td className="cream">{formatPrice(localStorage.getItem("billpage_field_2"))}</td>
          <td className="cream">{formatPrice(localStorage.getItem("billpage_field_3"))}</td>

          <td className="cream">{A1.toLocaleString()}%</td>
          <td className="cream">{A2.toLocaleString("fa-ir")}</td>
          <td className="cream">{durringprice_befor.toLocaleString("fa-ir")}</td>
          <td className="cream">{Final_durring.toLocaleString("fa-ir")}</td>
        </tr>

                        {/* ======  تیتر بخش ====== */}
        <tr>
          <td style={{ background: "#d9d9d9", fontWeight: "bold" }} colSpan={7}>
            محاسبه و پرداخت حق‌الزحمه خدمات فنی کارگاهی (ریال)
          </td>
        </tr>
               {/* ====== تیتر کارگاهی ====== */}
        <tr>
          <td className="Title">جمع کل مبلغ صورت وضعیت اصلاح شده فعلی با در نظر گرفتن مفاد بند 1-2-7-5 بخشنامه</td>
          <td className="Title">جمع کل مبلغ صورت وضعیت اصلاح شده قبلی با در نظر گرفتن مفاد بند 1-2-7-5 بخشنامه</td>
          <td className="Title">کارکرد ماهانه صورت وضعیت پیمانکار (تفاضل ردیف‌های 3و4) (F)</td>
          <td className="Title" colSpan={2}>برآورد حق‌الزحمه  بر اساس کارکرد ماهانه پروژه         〖𝟖𝑭〗^(𝟎.𝟔𝟒)×𝒒×𝒓×𝒌×j </td>
          <td className="Title">حق الزحمه ماهانه کارکرد مشاور (Eb)</td>
          <td className="Title">حق الزحمه درخواستی مشاور موضوع بند 4-3-3 (ریال) </td>
        </tr>
  
        <tr>
          <td className="cream">{formatPrice(localStorage.getItem("billpage_field_1"))}</td>
          <td className="cream">{formatPrice(localStorage.getItem("billpage_field_2"))}</td>
          <td className="cream">{formatPrice(localStorage.getItem("billpage_field_3"))}</td>
          <td className="cream" colSpan={2} >{Db.toLocaleString("fa-ir")}</td>
          <td className="cream">{siteprice_befor.toLocaleString("fa-ir")}</td>
          <td className="cream">{Final_site.toLocaleString("fa-ir")}</td>
        </tr>
       </tbody>
    </table>
  </div>
  );
}
