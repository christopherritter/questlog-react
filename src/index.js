import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ReactGA from "react-ga";

// const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development"

ReactGA.initialize(process.env.REACT_APP_MEASUREMENT_ID, {
  useExistingGa: true,
  siteSpeedSampleRate: 100,
  debug: false,
});
ReactGA.ga("create", process.env.REACT_APP_MEASUREMENT_ID, 'auto', { cookieFlags: "SameSite=None; Secure" });

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
