import Dialog, { DialogProps } from "./Dialog";
import {
  useDialogContext,
  DialogContextProvider,
  DialogContextType,
} from "./useDialogContext";

const DialogNamespace: typeof Dialog & {
  useDialogContext?: typeof useDialogContext;
  DialogContextProvider?: typeof DialogContextProvider;
} = Dialog;
DialogNamespace.useDialogContext = useDialogContext;
DialogNamespace.DialogContextProvider = DialogContextProvider;

export type { DialogProps, DialogContextType };
export default DialogNamespace as typeof Dialog & {
  useDialogContext: typeof useDialogContext;
  DialogContextProvider: typeof DialogContextProvider;
};
