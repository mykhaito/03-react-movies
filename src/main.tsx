import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "modern-normalize/modern-normalize.css";
import "./index.css";
import App from "./components/App/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <>
      <App />
      <Toaster position="top-right" />
    </>
  </React.StrictMode>
);