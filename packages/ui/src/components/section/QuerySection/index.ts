import QuerySection from "./QuerySection";
import {
  useQuerySectionContext,
  QuerySectionProvider,
} from "./useQuerySectionContext";

type QuerySectionNamespace = {
  useQuerySectionContext: typeof useQuerySectionContext;
  QuerySectionProvider: typeof QuerySectionProvider;
};
const QuerySectionNamespace: typeof QuerySection &
  Partial<QuerySectionNamespace> = QuerySection;
QuerySectionNamespace.useQuerySectionContext = useQuerySectionContext;
QuerySectionNamespace.QuerySectionProvider = QuerySectionProvider;

export type { QuerySectionProps } from "./QuerySection";
export default QuerySectionNamespace as typeof QuerySection &
  QuerySectionNamespace;
