import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import UserContextProvider from "./context/userContext.tsx"; // Import UserContextProvider using named import syntax
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router } from "react-router-dom";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((err) => {
      console.log("Service Worker registration failed:", err);
    });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserContextProvider>
    <Toaster
      position="top-right"
      reverseOrder={true}
      containerStyle={{ marginTop: "80px" }}
    />
    <Router>
      <App />
    </Router>
    {/* <LoadingSpinnerComponent /> */}
  </UserContextProvider>
);
