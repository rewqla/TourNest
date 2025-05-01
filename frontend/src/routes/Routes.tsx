import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import DirectionPage from "../pages/Direction";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import ProfilePage from "../pages/ProfilePage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import TestPage from "../pages/test";
import ProtectedRoute from "./ProtectedRoute";
import {
  DIRECTION_ROUTE,
  HOME_ROUTE,
  PRIVACY_ROUTE,
  PROFILE_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
} from "./routeConstants";

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
          path: DIRECTION_ROUTE,
          element: <DirectionPage />,
        },
        {
          path: PRIVACY_ROUTE,
          element: <PrivacyPolicyPage />,
        },
        {
          path: PROFILE_ROUTE,
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
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
