import axios from "axios";
import { openNotification } from "../context/openNotification";

export const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    var err = error.response;
    if (Array.isArray(err?.data.errors)) {
      for (let val of err?.data.errors) {
        openNotification("error", val.description);
      }
    } else if (typeof err?.data.errors === "object") {
      for (let e in err?.data.errors) {
        openNotification("error", err.data.errors[e][0]);
      }
    } else if (err?.data) {
      openNotification("error", err.data);
    } else if (err?.status == 401) {
      openNotification("error", "Please login");
      window.history.pushState({}, "LoginPage", "/login");
    } else if (err) {
      openNotification("error", err?.data);
    }
  }
};
