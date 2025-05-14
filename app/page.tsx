"use client";

import { useState } from "react";
import { FileJson, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ChangelogViewer from "@/components/changelog-viewer";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const srcParam = searchParams.get("src");
  const [inputUrl, setInputUrl] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) {
      // TODO: Validation
      return;
    }
    router.push(`?src=${encodeURIComponent(inputUrl)}`);
  };

  if (srcParam) {
    return <ChangelogViewer changelogSrc={srcParam} />;
  } else {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full">
                <FileJson
                  size={40}
                  className="text-gray-700 dark:text-gray-300"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Changelog Viewer
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              View, search, and filter changelog entries from any JSON
              source.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="changelog-url"
                    className="text-sm font-medium text-left block">
                    Enter a URL to your changelog.json file
                  </label>
                  <Input
                    id="changelog-url"
                    type="text"
                    placeholder="https://example.com/changelog.json"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  View Changelog
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4 pt-8">
            <h2 className="text-xl font-semibold">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-full">1</div>
                <h3 className="font-medium">Enter URL</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Provide a link to your changelog.json file
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-full">2</div>
                <h3 className="font-medium">View</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  See your changelog in a clean, organized format
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-full">3</div>
                <h3 className="font-medium">Filter & Search</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Find specific changes with powerful filtering tools
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>
              Your changelog.json file should follow the{" "}
              <code className="bg-gray-200 text-xs px-2 py-1 rounded text-gray-700">
                chlog
              </code>{" "}
              format.
              <Link
                href="https://github.com/ammar-ahmed22/chlog"
                className={buttonVariants({
                  variant: "link",
                  className: "h-auto p-0 text-sm",
                })}>
                View format documentation
                <ExternalLink size={12} className="ml-1" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
