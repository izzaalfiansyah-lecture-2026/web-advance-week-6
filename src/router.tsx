import { createBrowserRouter } from "react-router";
import LoginPage from "./form/login";
import RegistrationPage from "./form/registration";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegistrationPage />,
  },
]);
