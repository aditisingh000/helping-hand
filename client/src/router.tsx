import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import { HomePage } from "./routes/HomePage";
import { RootLayout } from "./routes/RootLayout";
import { SettingsPage } from "./routes/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "request-password-reset", element: <ResetPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "profile", element: <Profile /> },
      { path: "profile/:id", element: <Profile /> },
    ],
  },
]);
