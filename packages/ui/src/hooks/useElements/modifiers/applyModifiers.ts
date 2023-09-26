import { ModifierType, ChildrenToArrayReturnType } from "./types";

const applyModifiers = (
  modifiers: ModifierType[],
  rawButtons: ChildrenToArrayReturnType | undefined,
  context: any
): ChildrenToArrayReturnType | undefined => {
  let buttons: ChildrenToArrayReturnType | undefined = rawButtons;
  for (let i = modifiers.length - 1; buttons && i >= 0; i--) {
    const modifier = modifiers[i];
    if (modifier) {
      buttons = modifier(buttons, context);
    }
  }

  return buttons;
};

export { applyModifiers };
