import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../models/user/UserProfile";
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

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
    }
  }, []);

  const mockUsers: any[] = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      username: "johndoe",
      password: "password123",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      username: "janesmith",
      password: "mypassword",
    },
  ];

  const registerUser = (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ) => {
    const isDuplicate = mockUsers.some(
      (u) => u.email === email || u.username === username
    );

    if (isDuplicate) {
      openNotification("error", "User already exists!");
      return;
    }

    const newUser = { firstName, lastName, email, username, password };
    mockUsers.push(newUser);

    // Simulate storing data in localStorage
    const token = "mockToken123";
    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify({ email: newUser.email, username: newUser.username })
    );

    setToken(token);
    setUser({ email: newUser.email, username: newUser.username });

    openNotification("success", "Register Success!");
    navigate("/search");
  };

  const loginUser = (username: string, password: string) => {
    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      openNotification("error", "Invalid username or password!");
      return;
    }

    const token = "mockToken123";
    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify({ email: user.email, username: user.username })
    );

    setToken(token);
    setUser({ email: user.email, username: user.username });

    openNotification("success", "Login Success!");
    navigate("/search");
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
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
