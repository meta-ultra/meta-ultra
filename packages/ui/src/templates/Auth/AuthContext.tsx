import {
  createContext,
  useContext,
  useRef,
  useMemo,
  type FC,
  type ComponentType,
  type PropsWithChildren,
} from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import useEvent from "./useEvent";

/**----------------------
 *    AuthContext
 *------------------------**/
type AuthContextType = {
  state?: object;
  login: (state: object) => void;
  logout: (redirectTo?: string) => void;
  isLogin: () => boolean;
  NavigateToLogin: ComponentType<{ redirectTo?: string }>;
  NavigateToRequireAuth: ComponentType;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
/*---- END OF AuthContext ----*/

/**----------------------
 *    useAuth
 *------------------------**/
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw Error(`useAuth must be inside of AuthProvider.`);
  }

  return context;
};
/*---- END OF useAuth ----*/

/**----------------------
 *    AuthProvider
 *------------------------**/
type AuthProviderProps = PropsWithChildren<{
  initialState?: object;
  loginPath?: string;
  requireAuthIndexPath?: string;
  onLogin?: (state: object) => void;
  onLogout?: () => void;
}>;

const assembleLoginPath = (loginPath: string, redirectTo?: string) => {
  if (redirectTo) {
    const jointmark = loginPath.indexOf("?") === -1 ? "?" : "&";
    return loginPath + jointmark + new URLSearchParams([["redirectTo", redirectTo]]).toString();
  } else {
    return loginPath;
  }
};

const AuthProvider: FC<AuthProviderProps> = ({
  children,
  initialState,
  loginPath = "/login",
  requireAuthIndexPath: requireAuthPath = "/dashboard",
  onLogin,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const stateRef = useRef<object | undefined>(initialState);

  const login = useEvent<AuthContextType["login"]>((state) => {
    stateRef.current = state;
    navigate(redirectTo || requireAuthPath);
    onLogin && onLogin(state);
  });

  const logout = useEvent<AuthContextType["logout"]>((redirectTo) => {
    console.log("red", redirectTo);
    stateRef.current = undefined;
    navigate(assembleLoginPath(loginPath, redirectTo));
    onLogout && onLogout();
  });

  const isLogin = useEvent<AuthContextType["isLogin"]>(() => stateRef.current !== undefined);

  const NavigateToLogin = useMemo(
    () =>
      function NavigateToLogin({ redirectTo }: { redirectTo?: string }) {
        return <Navigate to={assembleLoginPath(loginPath, redirectTo)} />;
      },
    [loginPath]
  );
  const NavigateToRequireAuth = useMemo(
    () =>
      function NavigateToRequireAuth() {
        return <Navigate to={redirectTo || requireAuthPath} />;
      },
    [redirectTo, requireAuthPath]
  );

  return (
    <AuthContext.Provider
      value={{
        state: stateRef.current,
        login,
        logout,
        isLogin,
        NavigateToLogin: NavigateToLogin,
        NavigateToRequireAuth: NavigateToRequireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
/*---- END OF AuthProvider ----*/

export { useAuth, AuthProvider };
export default { useAuth, AuthProvider };
