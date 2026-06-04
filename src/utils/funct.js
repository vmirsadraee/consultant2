
export const faToEn = (str) =>
  str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

export const formatPriceInput = (value) => {
  const cleaned = faToEn(value).replace(/[^\d]/g, "");
  if (!cleaned) return "";
  return Number(cleaned).toLocaleString("fa-IR");

};

// فرمت اعداد
  export const formatInteger = (v) => {
    const n = Number(v);
    if (!isFinite(n)) return "";
    return Math.trunc(n).toLocaleString("fa-ir", { useGrouping: false });
  };

  export const formatPrice = (v) => {
    const n = Number(v);
    if (!isFinite(n)) return "";
    return Math.trunc(n).toLocaleString("fa-ir");
  };



//============== Normalize =================
export const normalizeValue = (v) => {
    if (v === "None" || v === undefined || v === null) return null;
    return v;
};

export const normalizeNumber = (v) => {
    if (v === "None" || v === undefined || v === null || v === "") return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
};

export const isSectionRow = (r) => {
    if (!r) return false;
    const serial = String(r.serial ?? "");
    return r.calculate === 0 || serial.endsWith("000");
};
//==================================================
export const saveBeforeExecution = (beforeT) => {

  localStorage.setItem( "beforeExecution", JSON.stringify(beforeT) );

};
