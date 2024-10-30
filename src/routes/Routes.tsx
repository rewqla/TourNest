import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import { HOME_ROUTE } from "./routeConstants";

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: HOME_ROUTE,
      element: <HomePage />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
};
