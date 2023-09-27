import { FormInstance } from "antd";
import { createContext } from "../../../hooks/createContext";

const [useQuerySectionContext, QuerySectionProvider] = createContext<{
  form: FormInstance;
  formItemCount: number;
}>("useQuerySectionContext");

export { useQuerySectionContext, QuerySectionProvider };
