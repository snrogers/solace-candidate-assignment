import { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const AdvocatesTableRowSkeleton: FC = () => (
  <tr className="animate-pulse border-b transition-colors hover:bg-muted/50">
    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
    <td className="p-4"><Skeleton className="h-4 w-20" /></td>
    <td className="p-4"><Skeleton className="h-4 w-16" /></td>
    <td className="p-4"><Skeleton className="h-4 w-20" /></td>
    <td className="p-4"><Skeleton className="h-4 w-12" /></td>
    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
  </tr>
);

export default AdvocatesTableRowSkeleton;
