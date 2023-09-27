/**
 * TODO: Add capablity to set "width" and other properties.
 */
import type {
  ContextRenderType,
  ContextNextRenderType,
  RenderReturnType,
} from "./modifiers/renderTableColumnModifier";
import { Children } from "react";
import { isElement, isFragment } from "react-is";
import { getPureKey } from "../../../../utils/key";
import { RecordTypeConstraint } from "./types";

const createContextActions = <RecordType extends RecordTypeConstraint>(
  ...args: (
    | string
    | ((record: RecordType, index?: number) => RenderReturnType<RecordType> | string)
  )[]
): { actions: { render: ContextRenderType<RecordType> } } => {
  const ContextActionsRender = (
    value: unknown,
    record: RecordType,
    index: number,
    next: ContextNextRenderType<RecordType>
  ): RenderReturnType<RecordType> => {
    const existings = next();
    const existingElements = isFragment(existings)
      ? Children.toArray(existings.props.children)
      : [existings];

    const [removings, addings] = args.reduce<[string[], RenderReturnType<RecordType>[]]>(
      (prev, curr) => {
        if (typeof curr == "string") {
          prev[0].push(curr);
        } else {
          const result = curr(record, index);
          if (typeof result == "string") {
            prev[0].push(result);
          } else if (result) {
            prev[1].push(result);
          }
        }
        return prev;
      },
      [[], []]
    );

    const remainingElements = (existingElements as unknown[]).filter((element) => {
      if (isElement(element)) {
        return !removings.find((key) => key == getPureKey(element.key));
      }
      return true;
    });

    return (
      <>
        {remainingElements}
        {addings}
      </>
    );
  };

  return {
    actions: {
      render: ContextActionsRender,
    },
  };
};

export { createContextActions };
