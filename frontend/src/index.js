import reactDom from "react-dom"
import App from "./App.js"
import React from "react";

const Root = reactDom.createRoot(document.getElementById("root"));
Root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)