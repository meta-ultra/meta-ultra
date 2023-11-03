import { FC } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import type { SealedAuthMeta } from "./sealAuthMeta";

interface AuthLayoutProps {
  meta: SealedAuthMeta;
}

const AuthLayout: FC<AuthLayoutProps> = ({ meta }) => {
  const location = useLocation();
  const { isLogin, NavigateToLogin } = useAuth();

  /**----------------------
   *    Authentication
   *------------------------**/
  if (!isLogin()) {
    return <NavigateToLogin redirectTo={location.pathname} />;
  }
  /*---- END OF Authentication ----*/

  /**----------------------
   *    Authorization
   *------------------------**/
  if (meta.authorize) {
    meta.authorize(location.pathname);
  }
  /*---- END OF Authorization ----*/

  return <Outlet />;
};

export type { AuthLayoutProps };
export default AuthLayout;
