import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
{/* Arka planda dönen Osimhen görselleri */}
<div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
  {[...Array(10)].map((_, i) => (
    <img
      key={i}
      src="/osimhen.png"
      alt="Osimhen"
      className={`absolute w-16 opacity-20 animate-spin-slow`}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${10 + Math.random() * 10}s`,
      }}
    />
  ))}
</div>
