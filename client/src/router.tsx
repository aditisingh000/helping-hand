import { createBrowserRouter } from "react-router-dom";

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
    ],
  },
]);
