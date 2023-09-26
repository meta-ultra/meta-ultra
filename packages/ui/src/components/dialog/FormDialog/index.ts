import FormDialog from "./FormDialog";
import {
  useFormDialogContext,
  FormDialogContextProvider,
} from "./useFormDialog";

const FormDialogNamespace: typeof FormDialog & {
  useFormDialogContext?: typeof useFormDialogContext;
  FormDialogContextProvider?: typeof FormDialogContextProvider;
} = FormDialog;
FormDialogNamespace.useFormDialogContext = useFormDialogContext;
FormDialogNamespace.FormDialogContextProvider = FormDialogContextProvider;

export type { FormDialogProps } from "./FormDialog";
export type {
  FormDialogContextType,
  TypedUseFormDialogContext,
} from "./useFormDialog";
export default FormDialogNamespace as typeof FormDialog & {
  useFormDialogContext: typeof useFormDialogContext;
  FormDialogContextProvider: typeof FormDialogContextProvider;
};
