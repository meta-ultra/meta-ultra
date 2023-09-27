import { CURD, useCURDTableColumns, useCURDQueryButtons } from "./CURD";
import { useCURDInitials } from "./useCURDInitials";
import { useCURDQuery } from "./useCURDQuery";

type CURDNamespace = {
  useCURDTableColumns: typeof useCURDTableColumns;
  useCURDQueryButtons: typeof useCURDQueryButtons;
  useCURDInitials: typeof useCURDInitials;
  useCURDQuery: typeof useCURDQuery;
};
const CURDNamespace: typeof CURD & Partial<CURDNamespace> = CURD;
CURDNamespace.useCURDTableColumns = useCURDTableColumns;
CURDNamespace.useCURDQueryButtons = useCURDQueryButtons;
CURDNamespace.useCURDInitials = useCURDInitials;
CURDNamespace.useCURDQuery = useCURDQuery;

export type { UseCURDTableColumns } from "./CURD";
export default CURDNamespace as typeof CURD & CURDNamespace;
