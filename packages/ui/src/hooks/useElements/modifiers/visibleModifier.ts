import type { ChildrenToArrayReturnType } from "./types";
import { isElement } from "react-is";
import { getPureKey } from "../../../utils/key";

const visibleModifier = <ContextType>(
  elements: ChildrenToArrayReturnType,
  context?: ContextType
): ChildrenToArrayReturnType | undefined => {
  if (!context) return elements;

  return elements.filter((element) => {
    if (isElement(element)) {
      if (element.key) {
        const key = getPureKey(element.key);
        if (key && typeof context === "object") {
          const relatedContext = (context as Record<string | number, unknown>)[key];
          if (typeof relatedContext == "boolean") {
            if (relatedContext == false) {
              return false;
            }
          } else if (relatedContext && (relatedContext as { visible?: boolean }).visible == false) {
            return false;
          }
        }
      }
    }
    return true;
  });
};

export { visibleModifier };
