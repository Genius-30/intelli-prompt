"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MoreVertical,
  SquarePenIcon,
  TestTube2Icon,
  GitBranchIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";

const mockVersions = [
  {
    _id: "v5",
    title: "Version 5",
    updatedAt: new Date().toISOString(),
    isActive: false,
  },
  {
    _id: "v4",
    title: "Version 4",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    isActive: true,
  },
  {
    _id: "v3",
    title: "Version 3",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    isActive: false,
  },
  {
    _id: "v2",
    title: "Version 2",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    isActive: false,
  },
  {
    _id: "v1",
    title: "Version 1",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
    isActive: false,
  },
];

export default function PromptVersionsPage() {
  const { promptId } = useParams();
  const activeVersionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeVersionRef.current) {
      activeVersionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  return (
    <div className="sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Versions</h1>
          <p className="text-muted-foreground text-sm">
            View and manage all versions of this prompt
          </p>
        </div>
        <Button>+ New Version</Button>
      </div>

      {/* Scrollable Timeline */}
      <div className="relative border-l border-muted pl-6 max-h-[calc(100vh-150px)] overflow-y-auto sm:pr-4">
        {mockVersions.map((version, index) => (
          <div
            key={version._id}
            ref={version.isActive ? activeVersionRef : null}
            className="relative pb-10 group"
          >
            {/* Connector line */}
            {index < mockVersions.length - 1 && (
              <span className="absolute left-[-1px] top-6 h-full w-px bg-muted z-0" />
            )}

            {/* Dot */}
            <span className="absolute -left-[8px] top-[8px] z-10">
              {version.isActive && (
                <span className="absolute inset-0 rounded-full bg-primary opacity-75 animate-ping" />
              )}
              <span
                className={`relative block w-4 h-4 ${
                  version.isActive ? "bg-primary" : "bg-background"
                } border-2 border-primary rounded-full`}
              />
            </span>

            {/* Content */}
            <div className="pl-6 pr-4 pt-2 pb-3 bg-background rounded-lg shadow-sm border border-muted relative z-10 ml-4 sm:ml-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-base font-medium">
                  <GitBranchIcon className="w-4 h-4" />
                  {version.title}
                  {version.isActive && (
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {!version.isActive && (
                      <DropdownMenuItem>
                        <CheckIcon className="w-4 h-4 mr-2" /> Set as Active
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <CopyIcon className="w-4 h-4 mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-muted-foreground mt-1">
                Updated {formatDistanceToNow(new Date(version.updatedAt))} ago
              </p>

              <div className="mt-3 flex gap-2">
                <Button asChild size="sm" variant="outline" className="px-3">
                  <Link href={`/prompts/${promptId}/versions/${version._id}`}>
                    <SquarePenIcon className="w-4 h-4 mr-1" /> Edit
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="default"
                  className="bg-green-500 hover:bg-green-600 px-3"
                >
                  <Link
                    href={`/prompts/${promptId}/versions/${version._id}/test`}
                  >
                    <TestTube2Icon className="w-4 h-4 mr-1" /> Test
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
