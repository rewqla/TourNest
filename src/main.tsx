import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import UserProvider from "./context/useAuth";
import "./index.css";
import { Router } from "./routes/Routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <Router />
    </UserProvider>
  </StrictMode>
);
