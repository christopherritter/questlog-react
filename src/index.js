import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ReactGA from "react-ga";

ReactGA.initialize(process.env.REACT_APP_MEASUREMENT_ID);

// ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
