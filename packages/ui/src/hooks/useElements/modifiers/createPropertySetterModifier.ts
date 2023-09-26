import { Key, cloneElement } from "react";
import { isElement } from "react-is";
import { getPureKey } from "../../../utils/key";
import { ChildrenToArrayReturnType } from "./types";

const createPropertySetterModifier =
  (names: string[], keys?: Key[]) =>
  <ContextType>(
    elements: ChildrenToArrayReturnType,
    context?: ContextType
  ): ChildrenToArrayReturnType | undefined => {
    if (!context) return elements;

    return elements.map((element) => {
      if (isElement(element)) {
        const key = getPureKey(element.key);

        if (key && typeof context === "object") {
          if (keys && keys.indexOf(key) == -1) return element;

          const relatedContext = (context as Record<string | number, unknown>)[key];
          if (relatedContext && typeof relatedContext == "object") {
            const mapContext = relatedContext as unknown as Record<string, unknown>;
            const kvs: Record<string, unknown> = {};
            for (let i = 0; i < names.length; i++) {
              const name = names[i];
              if (name) {
                const value = mapContext[name];
                if (value != undefined) {
                  kvs[name] = value;
                }
              }
            }
            return cloneElement(element, {
              ...element.props,
              ...kvs,
              key: element.key,
            });
          }
        }
      }

      return element;
    });
  };

export { createPropertySetterModifier };
