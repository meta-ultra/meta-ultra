import { createContext, useContext } from "react";
import { FormInstance } from "antd";
import { DialogContextType } from "../Dialog/useDialogContext";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FormDialogContextType<RecordType = any> extends DialogContextType {
  form: FormInstance;
  record: RecordType;
}

const FormDialogContext = createContext<FormDialogContextType | undefined>(undefined);
const FormDialogContextProvider = FormDialogContext.Provider;
const useFormDialogContext = () => {
  const context = useContext(FormDialogContext);
  if (context === undefined) {
    throw Error("useFormDialogContext must be inside of FormDialogContextProvider");
  }

  return context;
};

/**
 * @example declare useFormDialogContext for specific RecordType (inspired by reduxjs/tookit)
 * const useUserFormDialogContext: TypedUseFormDialogContext<UserType> = useFormDialogContext;
 */
type TypedUseFormDialogContext<RecordType> = () => FormDialogContextType<RecordType>;

export type { FormDialogContextType, TypedUseFormDialogContext };
export { useFormDialogContext, FormDialogContextProvider };
