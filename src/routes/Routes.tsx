import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import SignInPage from "../pages/SignInPage";
import { HOME_ROUTE, SIGN_IN_ROUTE } from "./routeConstants";

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: HOME_ROUTE,
      element: <HomePage />,
    },
    {
      path: SIGN_IN_ROUTE,
      element: <SignInPage />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
};
