import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import "./index.css";
import Admin from "../src/pages/admin.jsx";
// PrimeReact and CSS Imports
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";

function App() {
  // 1. 💡 تعديل الحالة: قراءة القيمة من localStorage عند التهيئة
  const [darkMode, setDarkMode] = useState(() => {
    // محاولة قراءة القيمة المخزنة
    const savedMode = localStorage.getItem('darkMode');
    // إذا كانت القيمة مخزنة، قم بتحويلها إلى قيمة منطقية (Boolean).
    // إذا لم تكن موجودة (null)، استخدم القيمة الافتراضية (false).
    return savedMode === 'true' ? true : false;
  });

  // 2. 💡 Effect لتطبيق الفئة وحفظ القيمة في localStorage
  useEffect(() => {
    // أ. تطبيق الفئة على جسم الصفحة
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light"); // إزالة light لضمان التبديل النظيف
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }

    // ب. حفظ القيمة الجديدة في localStorage
    localStorage.setItem('darkMode', darkMode);

  }, [darkMode]); // يتم تشغيل هذا التأثير عند تغير darkMode فقط

  return (
    <>
      {/* زر التبديل يبقى كما هو، يستدعي setDarkMode مباشرة */}
      <button
        onClick={() => setDarkMode(prevMode => !prevMode)} // استخدام دالة للحصول على القيمة السابقة
        // 💡 الأنماط المضمنة للموضع فقط
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1000
        }}
        // 💡 فئات CSS الجديدة
        className={`mode-toggle-btn ${darkMode ? "dark-mode" : "light-mode"}`}
      >
        {/* تبديل أيقونة الإظهار مع تغيير اسم الزر ليتوافق مع الوضع الذي سيتم التبديل إليه */}
        {darkMode ?
          <>
            <i className="pi pi-sun"></i> Light Mode
          </>
          :
          <>
            <i className="pi pi-moon"></i> Dark Mode
          </>
        }
      </button>


      {/* Router setup */}
      <BrowserRouter>
        <Routes>
          {/* Main route */}
          <Route path="/" element={<Home />} />
          <Route path="/Supprot-Admin-Calcul-Fac-2025-2026@dev" element={<Admin />} />

          {/* Catch-all route for any other path, also rendering Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;