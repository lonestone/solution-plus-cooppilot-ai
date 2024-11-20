import DefaultLayout from "@/components/layouts/DefaultLayout";
import Help from "@/pages/Help";
import { News } from "@/pages/News";
import { backAdminConfig } from "@common/back-admin/backAdminConfig";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./globals.css";
import "./i18n";
import "./index.css";
import Chat from "./pages/Chat";

backAdminConfig.endpoint = import.meta.env.VITE_BACK_END_API_ENDPOINT;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          {
            index: true,
            path: "/chat",
            element: <Chat />,
          },
          {
            path: "/help",
            element: <Help />,
          },
          {
            path: "/news",
            element: <News />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
