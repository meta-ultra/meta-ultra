import { Children } from "react";

type ChildrenToArrayReturnType = ReturnType<typeof Children.toArray>;

type ModifierType = (
  elements: ChildrenToArrayReturnType,
  context: any
) => ChildrenToArrayReturnType | undefined;

export type { ChildrenToArrayReturnType, ModifierType };
