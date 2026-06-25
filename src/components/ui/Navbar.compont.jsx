import React from "react";
import { NavLink } from "react-router-dom";
import { FaCoins } from "react-icons/fa";
import "./Navbar.css";

const Navbarcomponent = () => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">

        {/* لوگو */}
        <div className="navbar-brand d-flex align-items-center gap-2">
          <FaCoins className="navbar-logo" />
        </div>

        {/* موبایل */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
         <span className="navbar-toggler-icon"></span>
        </button>

        {/* منو */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            
            <NavItem to="/Aboutuspage"    label="َAbout" />
            <NavItem to="/Invoicepage"    label="خلاصه مالی" />
            <NavItem to="/Supportpage"    label="پشتیبانی" />
            <NavItem to="/Calculatepage"  label="پرداخت‌ها" />
            <NavItem to="/Billpage"       label="صورت وضعیت" />
            <NavItem to="/Afterpage"      label="بعد از اجرا" />
            <NavItem to="/Sitepage"       label="خدمات کارگاهی" />
            <NavItem to="/Casepage"       label="نظارت موردی" />
            <NavItem to="/Durringpage"    label="حین اجرا" />
            <NavItem to="/Beforpage"      label="قبل از اجرا" />
            <NavItem to="/Information"    label="اطلاعات پایه" />
            <NavItem to="/"               label="خانه" />

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
