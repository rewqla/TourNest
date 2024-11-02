import axios from "axios";
import { UserProfileToken } from "../models/user/UserProfileToken";

const api = "http://localhost:7188/api/";

export const loginAPI = async (username: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "account/login", {
      username: username,
      password: password,
    });
    return data;
  } catch (error) {}
};

export const registerAPI = async (
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  password: string
) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "account/register", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: password,
    });
    return data;
  } catch (error) {}
};
