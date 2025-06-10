import { notification } from "antd";

type NotificationType = "success" | "error";

export const openNotification = (type: NotificationType, message: string) => {
  notification[type]({
    message: message,
    placement: "bottomRight",
  });
};
