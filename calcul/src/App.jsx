import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import "./index.css";

import 'primeicons/primeicons.css';
        
import "primereact/resources/themes/lara-light-cyan/theme.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      {/* <button className="button_dark" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button> */}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
