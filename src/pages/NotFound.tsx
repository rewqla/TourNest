import { Result } from "antd";

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist. Make sure you have entered a correct address"
    />
  );
};

export default NotFound;
