// context related types' declaration
type ContextualType<ContextType, T extends object> = Omit<T, "context"> & {
  context?: ContextType;
};

export type { ContextualType };
