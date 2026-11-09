import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import AlertProvider from "./context/AlertProvider/AlertProvider";
import OptionProvider from "./context/OptionProvider/OptionProvider";
import ContactProvider from "./context/contactProvider/contactProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AlertProvider>
        <OptionProvider>
          <ContactProvider>
            <App />
          </ContactProvider>
        </OptionProvider>
      </AlertProvider>
    </BrowserRouter>
  </React.StrictMode>
);
