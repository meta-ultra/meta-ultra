import QuerySection from "./QuerySection";
import {
  useQuerySectionContext,
  QuerySectionProvider,
} from "./useQuerySectionContext";
import { ButtonCreate } from "./buttons/ButtonCreate/ButtonCreate";
import { ButtonDelete } from "./buttons/ButtonDelete/ButtonDelete";
import { ButtonUpdate } from "./buttons/ButtonUpdate/ButtonUpdate";
import { ButtonSearch } from "./buttons/ButtonSearch/ButtonSearch";

type QuerySectionNamespace = {
  useQuerySectionContext: typeof useQuerySectionContext;
  QuerySectionProvider: typeof QuerySectionProvider;
  ButtonCreate: typeof ButtonCreate;
  ButtonUpdate: typeof ButtonUpdate;
  ButtonDelete: typeof ButtonDelete;
  ButtonSearch: typeof ButtonSearch;
};
const QuerySectionNamespace: typeof QuerySection &
  Partial<QuerySectionNamespace> = QuerySection;
QuerySectionNamespace.useQuerySectionContext = useQuerySectionContext;
QuerySectionNamespace.QuerySectionProvider = QuerySectionProvider;
QuerySectionNamespace.ButtonCreate = ButtonCreate;
QuerySectionNamespace.ButtonDelete = ButtonDelete;
QuerySectionNamespace.ButtonUpdate = ButtonUpdate;
QuerySectionNamespace.ButtonSearch = ButtonSearch;

export type { ButtonCreateProps } from "./buttons/ButtonCreate/ButtonCreate";
export type { ButtonDeleteProps } from "./buttons/ButtonDelete/ButtonDelete";
export type { ButtonUpdateProps } from "./buttons/ButtonUpdate/ButtonUpdate";
export type { ButtonSearchProps } from "./buttons/ButtonSearch/ButtonSearch";
export type { QuerySectionProps } from "./QuerySection";
export default QuerySectionNamespace as typeof QuerySection &
  QuerySectionNamespace;
