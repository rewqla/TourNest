import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../models/user/UserProfile";
import { registerAPI, loginAPI } from "../services/AuthService";
import { openNotification } from "./openNotification";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ) => void;
  loginUser: (username: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

export const UserContext = createContext<UserContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useAuthContext has to be used within main.tsx");
  }

  return context;
};

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ) => {
    await registerAPI(firstName, lastName, email, username, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            email: res?.data.email,
          };
          localStorage.setItem("user", JSON.stringify(userObj));

          setToken(res?.data.token!);
          setUser(userObj!);

          openNotification("success", "Register Success!");
          navigate("/search");
        }
      })
      .catch((e) => openNotification("error", "Server error occured"));
  };

  const loginUser = async (username: string, password: string) => {
    await loginAPI(username, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            email: res?.data.email,
          };
          localStorage.setItem("user", JSON.stringify(userObj));

          setToken(res?.data.token!);
          setUser(userObj!);

          openNotification("success", "Login Success!");
          navigate("/search");
        }
      })
      .catch((e) => openNotification("error", "Server error occured"));
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken("");
    navigate("/");
  };

  const contextValue: UserContextType = {
    user,
    token,
    registerUser,
    loginUser,
    logout,
    isLoggedIn,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
