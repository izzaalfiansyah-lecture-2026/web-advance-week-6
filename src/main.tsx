import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RegistrationForm from "./form/registration.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RegistrationForm />
  </StrictMode>,
);
