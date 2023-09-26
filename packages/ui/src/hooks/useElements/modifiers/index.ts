import { createPropertySetterModifier } from "./createPropertySetterModifier";

const statusModifier = createPropertySetterModifier(["status"]);
const buttonSearchModifier = createPropertySetterModifier(
  ["refreshText", "searchText"],
  ["search"]
);
const buttonTextModifier = createPropertySetterModifier(["text"], ["create", "update", "delete"]);

export type { ChildrenToArrayReturnType, ModifierType } from "./types";
export { applyModifiers } from "./applyModifiers";
export { visibleModifier } from "./visibleModifier";
export { createPropertySetterModifier, statusModifier, buttonSearchModifier, buttonTextModifier };
