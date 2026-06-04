import React, { useCallback, useEffect, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "./Page.css";
import { normalizeValue, normalizeNumber, faToEn, formatPriceInput } from "../utils/funct";

export default function Beforpage() {
  const navigate = useNavigate();

  // State Management
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPriceRow, setEditPriceRow] = useState(null);
  const [priceInput, setPriceInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [manualForm, setManualForm] = useState({ serial: "", subject: "", deliver: "", unitprice: "" });
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [coefficient1, setCoefficient1] = useState(0);
  const table_name = localStorage.getItem("table_name");

  // 1. Initial Logic & Data Fetching
  useEffect(() => {
    if (!table_name) {
      alert("نام جدول مشخص نشده است");
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const savedRows = localStorage.getItem("monitoringRows_befor");
        if (savedRows) {
          setRows(JSON.parse(savedRows));
        } else {
          const res = await fetch(`http://localhost:5000/${table_name}/befor`);
          const data = await res.json();
          const mapped = (Array.isArray(data) ? data : []).map((r) => ({
            ...r,
            enableCalc: false,
            isManual: false,
          }));
          setRows(mapped);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    const aValue = localStorage.getItem("field_16");
    if (aValue) setCoefficient1(Number(aValue));

    fetchData();
  }, [table_name, navigate]);

  // 2. Persisting Rows
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("monitoringRows_befor", JSON.stringify(rows));
    }
  }, [rows, loading]);

  // 3. Helper Functions (Memoized)
  const getCalculatedPrice = useCallback((row) => {
    if (row.calculate === 0) return 0;
    if ((row.calculate === 1 || row.calculate === 2) && row.enableCalc) {
      const unit = Number(row.unitprice);
      return isNaN(unit) ? 0 : Math.trunc(normalizeNumber(coefficient1) * unit);
    }
    return 0;
  }, [coefficient1]);

  // 4. Calculated Values (Optimized with useMemo)
  const totalCalculatedPrice = useMemo(() => {
    return rows.reduce((sum, r) => sum + (getCalculatedPrice(r) || 0), 0);
  }, [rows, getCalculatedPrice]);

  // Sync total with localStorage
  useEffect(() => {
    localStorage.setItem("Final_befor", totalCalculatedPrice.toString());
  }, [totalCalculatedPrice]);

  // 5. Handlers
  const handleToggleRow = useCallback((id, checked) => {
    setRows(prev => prev.map(r => r.ID === id ? { ...r, enableCalc: checked } : r));
  }, []);

  const enableAllValidCalculations = () => {
    setRows(prev => prev.map(r => ({
      ...r,
      enableCalc: (r.calculate === 1 || (r.calculate === 2 && Number(r.unitprice) > 0))
    })));
  };

  // 6. Report Data Sync (Professional approach)
  useEffect(() => {
    const beforeTable = {
      id: "report_before",
      title: "خدمات نظارت قبل از اجرا",
      rows: rows.map(r => ({
        kind: "data1",
        serial: normalizeValue(r.serial),
        subject: normalizeValue(r.subject),
        deliver: normalizeValue(r.deliver),
        unitprice: normalizeNumber(r.unitprice),
        coefficienta: normalizeNumber(coefficient1),
        totalprice: getCalculatedPrice(r),
      })),
      total: totalCalculatedPrice,
      currency: "ریال"
    };
    localStorage.setItem("beforeExecutionTable", JSON.stringify(beforeTable));
  }, [rows, totalCalculatedPrice, coefficient1, getCalculatedPrice]);

  // 7. Grid Columns Definition (Memoized)
  const columns = useMemo(() => [
    {
      field: "serial",
      headerName: "شماره ردیف",
      flex: 0.1,
      align: "center",
      headerAlign: "center",
      renderCell: (p) => p.value?.toLocaleString("fa-ir"),
    },
    {
      field: "subject",
      headerName: "شرح ردیف",
      flex: 0.3,
      headerAlign: "center",
      renderCell: (p) => <div className="wrap-cell text-right">{p.value}</div>,
    },
    {
      field: "unitprice",
      headerName: "قیمت واحد",
      flex: 0.15,
      headerAlign: "center",
      align: "center",
      renderCell: (p) => p.row.calculate !== 0 ? Math.trunc(p.value).toLocaleString("fa-ir") : "",
    },
    {
      field: "totalprice",
      headerName: "قیمت نهایی",
      flex: 0.15,
      headerAlign: "center",
      align: "center",
      renderCell: (p) => getCalculatedPrice(p.row).toLocaleString("fa-ir"),
    },
    {
      field: "enableCalc",
      headerName: "انتخاب",
      flex: 0.07,
      align: "center",
      renderCell: (p) => p.row.calculate !== 0 && (
        <input
          type="checkbox"
          checked={p.value}
          onChange={(e) => handleToggleRow(p.row.ID, e.target.checked)}
        />
      ),
    },
  ], [getCalculatedPrice, handleToggleRow]);

  if (loading) return <div className="loading-container"><h3>در حال بارگذاری...</h3></div>;

  return (
    <div className="page-container" style={{ direction: "rtl" }}>
      {/* UI Parts... */}
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.ID}
        autoHeight
        getRowClassName={(p) => p.row.calculate === 0 ? "row-zero" : "row-normal"}
      />
      {/* Modals... */}
    </div>
  );
}
