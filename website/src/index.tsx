import ReactDOM from "react-dom/client";
import App from "./App";
import config from "./config";
import "./index.css";

if (config.MOCK_ENABLE) {
  const webpackContext = require.context(
    "./__mock__",
    false,
    /\/[a-z].*\.mock\.(j|t)s$/,
    "lazy-once"
  );
  webpackContext.keys().forEach(webpackContext);
}

window.addEventListener("unhandledrejection", (event) => {
  event.preventDefault();
  const error = event.reason as Error;
  if (error && error.message) {
    alert(error.message);
  }
});

const root = ReactDOM.createRoot(document.getElementById("app") as Element);
root.render(<App />);
