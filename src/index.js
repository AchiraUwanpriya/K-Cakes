import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";


//axios.defaults.baseURL = "http://localhost:50447/api";
axios.defaults.baseURL = process.env.NODE_ENV === "development"
  ? "/api"
  : "https://testtuitionbackend.dockyardsoftware.com/api";

if (process.env.NODE_ENV === "development") {
  // Override axios.create to handle custom instance baseUrls (like in AuthContext)
  const originalCreate = axios.create;
  axios.create = function (config) {
    if (config && typeof config.baseURL === "string" && config.baseURL.startsWith("https://testtuitionbackend.dockyardsoftware.com/api")) {
      config.baseURL = config.baseURL.replace("https://testtuitionbackend.dockyardsoftware.com/api", "/api");
    }
    const instance = originalCreate.call(this, config);
    // Intercept requests on custom instances
    instance.interceptors.request.use((cfg) => {
      if (cfg.url && cfg.url.startsWith("https://testtuitionbackend.dockyardsoftware.com/api")) {
        cfg.url = cfg.url.replace("https://testtuitionbackend.dockyardsoftware.com/api", "/api");
      }
      return cfg;
    });
    return instance;
  };

  // Intercept global axios requests
  axios.interceptors.request.use((config) => {
    if (config.url && config.url.startsWith("https://testtuitionbackend.dockyardsoftware.com/api")) {
      config.url = config.url.replace("https://testtuitionbackend.dockyardsoftware.com/api", "/api");
    }
    return config;
  });

  // Intercept global fetch requests
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === "string" && input.startsWith("https://testtuitionbackend.dockyardsoftware.com/api")) {
      input = input.replace("https://testtuitionbackend.dockyardsoftware.com/api", "/api");
    } else if (input instanceof URL && input.href.startsWith("https://testtuitionbackend.dockyardsoftware.com/api")) {
      input = new URL(input.href.replace("https://testtuitionbackend.dockyardsoftware.com/api", "/api"));
    } else if (input && typeof input === "object" && typeof input.url === "string" && input.url.startsWith("https://testtuitionbackend.dockyardsoftware.com/api")) {
      input = new Request(input.url.replace("https://testtuitionbackend.dockyardsoftware.com/api", "/api"), input);
    }
    return originalFetch(input, init);
  };
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
