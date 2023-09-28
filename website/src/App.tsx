import { StrictMode } from "react";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { hot } from "react-hot-loader/root";
import { CacheProvider } from "@meta-ultra/cache";
import { cache } from "./cache";
import "@meta-ultra/ui/style.css";

const App = () => {
  return (
    <StrictMode>
      <StyleProvider hashPriority="high">
        <ConfigProvider locale={zhCN}>
          <CacheProvider cache={cache}>
            <RouterProvider router={router} />
          </CacheProvider>
        </ConfigProvider>
      </StyleProvider>
    </StrictMode>
  );
};

export default hot(App);
