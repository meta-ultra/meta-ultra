import { ReactFragment, ReactElement, ReactNode, DependencyList, useMemo, Children } from "react";
import { isFragment, isElement } from "react-is";
import {
  applyModifiers,
  visibleModifier,
  statusModifier,
  ChildrenToArrayReturnType,
  ModifierType,
} from "./modifiers";
import { ContextualType } from "./types";

type ContextualReactNodesType<ContextType> = ContextualType<ContextType, ReactNode[]> & {
  modifiers?: ModifierType[];
};

interface ContextualReactElementType<ContexType>
  extends ContextualType<ContexType, ReactFragment | ReactElement> {
  elements?: ReactFragment | ReactElement;
  modifiers?: ModifierType[];
}

type FactoryReturnType<ContextType> =
  | ReactFragment
  | ReactElement
  | ContextualReactElementType<ContextType>;

interface UseElements<BaseContexType = unknown> {
  <ContextType extends BaseContexType = BaseContexType>(
    factory: () => FactoryReturnType<ContextType>,
    deps: DependencyList
  ): ContextualReactNodesType<ContextType>;
}

const useElements = <ContextType>(
  factory: () => FactoryReturnType<ContextType>,
  deps: DependencyList
): ContextualReactNodesType<ContextType> => {
  return useMemo<ContextualReactNodesType<ContextType>>(() => {
    const elements = factory();

    let contextualElements;
    if (isElement(elements) || isFragment(elements)) {
      contextualElements = {
        elements,
        modifiers: [],
        context: undefined,
      };
    } else {
      contextualElements = {
        elements: (elements as ContextualReactElementType<ContextType>).elements,
        modifiers: (elements as ContextualReactElementType<ContextType>).modifiers ?? [],
        context: (elements as ContextualReactElementType<ContextType>).context,
      };
    }

    // TODO: drill into nested fragment
    let reactNodes: ChildrenToArrayReturnType | undefined = isFragment(contextualElements.elements)
      ? Children.toArray(contextualElements.elements.props.children)
      : ([contextualElements.elements] as ChildrenToArrayReturnType);

    // Caveat: the order of processing is from right to left.
    const contextedModifiers = [
      ...(contextualElements.modifiers ?? []),
      statusModifier,
      visibleModifier,
    ];

    reactNodes = applyModifiers(contextedModifiers, reactNodes, contextualElements.context);

    // in account of the properties of ReactElement are all read only,
    // map the children from ReactFragment or <></> into a normal array,
    // so as to add custom "context" and "modifiers" properties for additional information.
    const contextualReactNodes: ContextualReactNodesType<ContextType> = [];
    if (reactNodes) {
      contextualReactNodes.push(...reactNodes);
    }
    contextualReactNodes.context = contextualElements.context;
    contextualReactNodes.modifiers = contextualElements.modifiers;

    return contextualReactNodes;
  }, deps);
};

export type { ContextualReactNodesType, ContextualReactElementType, UseElements };
export { useElements };
