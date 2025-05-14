import { ChangelogEntry } from "@/lib/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { formatDate, truncateString } from "@/lib/utils";
import CodeBadge from "@/components/ui/code-badge";
import { Badge } from "@/components/ui/badge";
import ShareButton from "@/components/share-button";

export interface ChangeViewProps {
  version: string;
  changelog: ChangelogEntry[];
  id: string;
}

export default function ChangeView({
  version,
  changelog,
  id,
}: ChangeViewProps) {
  const searchParams = useSearchParams();
  const srcParam = searchParams.get("src")!;
  const entry = useMemo(() => {
    return changelog.find((entry) => entry.version === version);
  }, [changelog, version]);

  const change = useMemo(() => {
    return entry?.changes.find((change) => change.id === id);
  }, [entry?.changes, id]);

  if (!change || !entry) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="py-24 flex flex-col items-center justify-center h-full">
          <p className="text-xl">Oops!</p>
          <p className="text-muted-foreground">
            Could not find change &quot;{id}&quot; for version &quot;
            {version}&quot;
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`?src=${encodeURIComponent(srcParam)}`}>
                Changelog
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`?src=${encodeURIComponent(srcParam)}&version=${encodeURIComponent(version)}`}>
                Version {version}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {truncateString(change.title, 50)}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <ShareButton />
      </div>

      <h1 className="text-3xl font-bold mb-2">{change.title}</h1>
      <div className="flex gap-2 flex-wrap mb-2">
        {change.tags.map((tag) => {
          return (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          );
        })}
      </div>
      <p className="text-muted-foreground text-sm mb-2">
        {formatDate(entry.date)}
      </p>
      <h2 className="text-xl font-bold mb-2">What&apos;s New</h2>
      <p className="text-muted-foreground mb-4">
        {change.description}
      </p>
      <h2 className="text-xl font-bold mb-2">Impact</h2>
      <p className="text-muted-foreground mb-4">{change.impact}</p>
      <h2 className="text-xl font-bold mb-2">Commits</h2>
      <div className="flex gap-2 flex-wrap mb-4">
        {change.commits.map((commit) => {
          return (
            <CodeBadge key={change.id + commit}>
              {commit.substring(0, 7)}
            </CodeBadge>
          );
        })}
      </div>
    </div>
  );
}
