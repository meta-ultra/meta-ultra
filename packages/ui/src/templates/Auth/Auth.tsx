import {
  createContext,
  useContext,
  useRef,
  type FC,
  type ComponentType,
  type PropsWithChildren,
} from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

type AuthContextType = {
  state?: object;
  login: (state: object) => void;
  logout: (redirectTo?: string) => void;
  isLogin: () => boolean;
  NavigateToLogin: ComponentType<{ redirectTo?: string }>;
  NavigateToRequireAuth: ComponentType;
};

const Context = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw Error(`useAuth must be inside of AuthProvider.`);
  }

  return context;
};

type AuthProviderProps = PropsWithChildren<{
  initialState?: object;
  loginPath?: string;
  requireAuthPath?: string;
  onLogin?: (state: object) => void;
  onLogout?: () => void;
}>;

const AuthProvider: FC<AuthProviderProps> = ({
  children,
  initialState,
  loginPath = "/login",
  requireAuthPath = "/dashboard",
  onLogin,
  onLogout,
}) => {
  const navigate = useNavigate();
  const { redirectTo } = useParams();
  const stateRef = useRef<object | undefined>(initialState);
  const login = useRef<AuthContextType["login"]>((state) => {
    stateRef.current = state;
    navigate(redirectTo || requireAuthPath);
    onLogin && onLogin(state);
  });
  const logout = useRef<AuthContextType["logout"]>((redirectTo) => {
    stateRef.current = undefined;
    navigate(
      loginPath +
        (redirectTo ? "?" + new URLSearchParams([["redirectTo", redirectTo]]).toString() : "")
    );
    onLogout && onLogout();
  });
  const isLogin = useRef<AuthContextType["isLogin"]>(() => stateRef.current !== undefined);
  const NavigateToLogin = useRef<AuthContextType["NavigateToLogin"]>(({ redirectTo }) => (
    <Navigate
      to={
        loginPath +
        (redirectTo ? "?" + new URLSearchParams([["redirectTo", redirectTo]]).toString() : "")
      }
    />
  ));
  const NavigateToRequireAuth = useRef(() => <Navigate to={redirectTo || requireAuthPath} />);

  return (
    <Context.Provider
      value={{
        state: stateRef.current,
        login: login.current,
        logout: logout.current,
        isLogin: isLogin.current,
        NavigateToLogin: NavigateToLogin.current,
        NavigateToRequireAuth: NavigateToRequireAuth.current,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { useAuth, AuthProvider };
export default { useAuth, AuthProvider };
