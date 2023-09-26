import { createContext, useContext } from "react";

interface DialogContextType {
  setLoading: (loading: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);
const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw Error("useDialogContext must be inside of DialogContextProvider.");
  }

  return context;
};
const DialogContextProvider = DialogContext.Provider;

export type { DialogContextType };
export { useDialogContext, DialogContextProvider };
