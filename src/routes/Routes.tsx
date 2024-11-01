import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import { HOME_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE } from "./routeConstants";

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: HOME_ROUTE,
          element: <HomePage />,
        },
        {
          path: SIGN_IN_ROUTE,
          element: <SignInPage />,
        },
        {
          path: SIGN_UP_ROUTE,
          element: <SignUpPage />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
