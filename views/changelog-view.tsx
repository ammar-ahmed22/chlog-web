"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { compareAsc, parseISO, compareDesc } from "date-fns";
import { Search, Tag } from "lucide-react";
import TagFilter from "@/components/ui/tag-filter";
import DateRangeFilter from "@/components/ui/date-range-filter";
import { DateRange } from "react-day-picker";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import EntryView from "./entry-view";
import {
  formatDate,
  isChangelogEntryArray,
  matchChange,
} from "@/lib/utils";
import ChangesTable from "@/components/changes-table";
import { ChangelogEntry } from "@/lib/types";
import ChangeView from "./change-view";
import ShareButton from "@/components/share-button";
import FullScreenLoading from "@/components/ui/full-screen-loading";
import FullScreenError from "@/components/ui/full-screen-error";

export interface ChangelogViewProps {
  changelogSrc: string;
}

export default function ChangelogView({
  changelogSrc,
}: ChangelogViewProps) {
  const searchParams = useSearchParams();
  const versionParam = searchParams.get("version");
  const idParam = searchParams.get("id");
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [fetchingError, setFetchingError] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(changelogSrc)
      .then((response) => response.json())
      .then((data) => {
        if (!isChangelogEntryArray(data)) {
          console.error("Invalid changelog format");
          setFetchingError("Changelog is not in the correct format.");
          setLoading(false);
          return;
        }
        setChangelog(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching changelog:", error);
        setFetchingError(
          "There was an error fetching the changelog.",
        );
        setLoading(false);
      });
  }, [changelogSrc]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    undefined,
  );
  const [expandedEntries, setExpandedEntries] = useState<
    Record<string, boolean>
  >({});

  // Get all unique tags from the changelog
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    changelog.forEach((entry) => {
      entry.changes.forEach((change) => {
        change.tags.forEach((tag) => tags.add(tag));
      });
    });
    return Array.from(tags).sort();
  }, [changelog]);

  // Get all unique versions from the changelog
  const allVersions = useMemo(() => {
    return changelog.map((entry) => entry.version);
  }, [changelog]);

  // Toggle expanded state for an entry
  const toggleExpanded = (version: string) => {
    setExpandedEntries((prev) => ({
      ...prev,
      [version]: !prev[version],
    }));
  };

  // Add a tag to the filter
  const addTagFilter = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Remove a tag from the filter
  const removeTagFilter = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedVersion("");
    setDateRange(undefined);
  };

  const hasFilters = useMemo(() => {
    return (
      searchQuery.length > 0 ||
      selectedTags.length > 0 ||
      (selectedVersion !== "" && selectedVersion !== "all") ||
      dateRange !== undefined
    );
  }, [searchQuery, selectedTags, selectedVersion, dateRange]);

  // Filter the changelog based on all filters
  const filteredChangelog = useMemo(() => {
    return changelog.filter((entry) => {
      // Filter by version
      if (
        selectedVersion &&
        selectedVersion !== "all" &&
        entry.version !== selectedVersion
      ) {
        return false;
      }

      // Filter by date range
      if (dateRange?.from && parseISO(entry.date) < dateRange?.from) {
        return false;
      }
      if (dateRange?.to && parseISO(entry.date) > dateRange?.to) {
        return false;
      }

      // Filter by search query and tags at the change level
      const matchingChanges = entry.changes.filter((change) =>
        matchChange(change, searchQuery, selectedTags),
      );

      return matchingChanges.length > 0;
    });
  }, [
    changelog,
    selectedVersion,
    dateRange?.from,
    dateRange?.to,
    searchQuery,
    selectedTags,
  ]);

  const dateRangeBounds: DateRange | undefined = useMemo(() => {
    if (changelog.length !== 0) {
      const parsedDates = changelog.map((entry) =>
        parseISO(entry.date),
      );
      const oldest = parsedDates.reduce((min, curr) =>
        compareAsc(min, curr) <= 0 ? min : curr,
      );
      const newest = parsedDates.reduce((max, curr) =>
        compareDesc(max, curr) <= 0 ? max : curr,
      );
      return {
        from: oldest,
        to: newest,
      };
    }

    return undefined;
  }, [changelog]);

  useEffect(() => {
    // If has filters, expand all
    if (hasFilters && filteredChangelog.length > 0) {
      setExpandedEntries((prev) => {
        const copy = { ...prev };
        filteredChangelog.forEach((entry) => {
          if (!(entry.version in prev) || !prev[entry.version]) {
            copy[entry.version] = true;
          }
        });
        return copy;
      });
    } else {
      setExpandedEntries({});
    }
  }, [hasFilters, filteredChangelog, setExpandedEntries]);

  if (loading) {
    return <FullScreenLoading />;
  } else if (fetchingError) {
    return <FullScreenError message={fetchingError} />;
  } else {
    if (versionParam && !idParam) {
      return (
        <EntryView version={versionParam} changelog={changelog} />
      );
    } else if (versionParam && idParam) {
      return (
        <ChangeView
          version={versionParam}
          id={idParam}
          changelog={changelog}
        />
      );
    } else {
      return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Changelog</h1>
            <ShareButton />
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Search changes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={selectedVersion}
                onValueChange={setSelectedVersion}>
                <SelectTrigger className="w-full md:w-[180px] cursor-pointer">
                  <Tag className="size-4" />
                  <SelectValue placeholder="Filter by version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All versions</SelectItem>
                  {allVersions.map((version) => (
                    <SelectItem key={version} value={version}>
                      {version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DateRangeFilter
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                disabled={(date) => {
                  if (dateRangeBounds) {
                    if (
                      dateRangeBounds.from &&
                      date < dateRangeBounds.from
                    ) {
                      return true;
                    }
                    if (
                      dateRangeBounds.to &&
                      date > dateRangeBounds.to
                    ) {
                      return true;
                    }
                  }
                  return false;
                }}
              />
            </div>

            <TagFilter
              tags={allTags}
              selectedTags={selectedTags}
              onTagSelect={addTagFilter}
              onTagDeselect={removeTagFilter}
            />
          </div>

          {/* Changelog entries */}
          {filteredChangelog.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No changelog entries match your filters.
              </p>
              <Button variant="link" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredChangelog.map((entry) => {
                // Filter changes based on search query and selected tags
                const filteredChanges = entry.changes.filter(
                  (change) =>
                    matchChange(change, searchQuery, selectedTags),
                );

                if (filteredChanges.length === 0) return null;

                return (
                  <Card
                    key={entry.version}
                    className="overflow-hidden py-0 gap-0">
                    <Link
                      href={`?src=${encodeURIComponent(changelogSrc)}&version=${encodeURIComponent(entry.version)}`}>
                      <CardHeader className="bg-gray-50 dark:bg-gray-900 py-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl flex items-center">
                            Version {entry.version}
                          </CardTitle>
                          <div className="text-sm text-gray-500">
                            {formatDate(entry.date)}
                          </div>
                        </div>
                      </CardHeader>
                    </Link>

                    <CardContent className="p-0">
                      <Collapsible
                        open={expandedEntries[entry.version]}
                        onOpenChange={() =>
                          toggleExpanded(entry.version)
                        }>
                        <CollapsibleTrigger className="w-full text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors p-4 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              {filteredChanges.length} change
                              {filteredChanges.length !== 1
                                ? "s"
                                : ""}
                            </div>
                            <div className="text-sm text-gray-500">
                              {entry.from_ref} → {entry.to_ref}
                            </div>
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="px-4 py-2">
                          <ChangesTable
                            version={entry.version}
                            changes={filteredChanges}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      );
    }
  }
}
