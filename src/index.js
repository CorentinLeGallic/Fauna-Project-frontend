import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App.js";
import { HelmetProvider } from 'react-helmet-async';
import "./styles/index.scss"

const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(
    // <React.StrictMode>
    <HelmetProvider>
        <App />
    </HelmetProvider>
    /* </React.StrictMode> */
);