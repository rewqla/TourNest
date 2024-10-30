import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { HOME_ROUTE } from "./routeConstants";

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: HOME_ROUTE,
      element: <HomePage />,
    },
  ]);

  return <RouterProvider router={router} />;
};
