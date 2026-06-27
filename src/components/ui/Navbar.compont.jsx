import React from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector"; // اگر فایل جای دیگری است، مسیر را اصلاح کن
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbarcomponent = () => {
  const { t } = useTranslation();

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <LanguageSelector />

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <NavItem to="/" label={t("home")} />
            <NavItem to="/Information" label={t("basicInfo")} />
            <NavItem to="/Beforpage" label={t("beforeExecution")} />
            <NavItem to="/Durringpage" label={t("duringExecution")} />
            <NavItem to="/Casepage" label={t("expertReview")} /> 
            <NavItem to="/Sitepage" label={t("services")} />
            <NavItem to="/Afterpage" label={t("afterExecution")} />
            <NavItem to="/Billpage" label={t("invoiceStatus")} />
            <NavItem to="/Calculatepage" label={t("payments")} />
            <NavItem to="/Supportpage" label={t("support")} />
            <NavItem to="/Invoicepage" label={t("financialSummary")} />
            <NavItem to="/Aboutuspage" label={t("about")} />
                    
          </ul>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ to, label }) => (
  <li className="nav-item">
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "nav-link active-link" : "nav-link"
      }
    >
      {label}
    </NavLink>
  </li>
);

export default Navbarcomponent;
