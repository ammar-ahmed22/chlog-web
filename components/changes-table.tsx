import { ChangelogChange } from "@/lib/types";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useRouter, useSearchParams } from "next/navigation";
import CodeBadge from "./ui/code-badge";

export interface ChangesTableProps {
  version: string;
  changes: ChangelogChange[];
  className?: string;
}

export default function ChangesTable({
  version,
  changes,
  className,
}: ChangesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow className="text-muted-foreground">
          <TableCell className="w-[100px]">Commit(s)</TableCell>
          <TableCell>Title</TableCell>
          <TableCell className="w-[100px]">Tags</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {changes.map((change) => {
          return (
            <TableRow
              key={change.id}
              onClick={() => {
                const currentParams = new URLSearchParams(
                  searchParams,
                );
                currentParams.set(
                  "version",
                  encodeURIComponent(version),
                );
                currentParams.set("id", change.id);
                router.push(`?${currentParams.toString()}`);
              }}
              className="hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer">
              <TableCell>
                {change.commits.map((commit) => {
                  return (
                    <CodeBadge key={change.id + commit}>
                      {commit.substring(0, 7)}
                    </CodeBadge>
                  );
                })}
              </TableCell>
              <TableCell>{change.title}</TableCell>
              <TableCell>
                {change.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
