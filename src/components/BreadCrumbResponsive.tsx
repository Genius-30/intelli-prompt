"use client";

import * as React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams, usePathname } from "next/navigation";

import Link from "next/link";
import { useGetFolderMeta } from "@/lib/queries/folder";
import { useGetVersion } from "@/lib/queries/version";

const segmentLabelMap: Record<string, string> = {
  dashboard: "Dashboard",
  prompts: "Prompts",
  versions: "Versions",
  test: "Test",
  explore: "Explore",
  saved: "Saved",
  leaderboard: "Leaderboard",
  folders: "Folders",
};

const suppressPaths = [
  "/dashboard",
  "/explore",
  "/leaderboard",
  "/saved",
  "/billing",
  "/profile",
];

function formatLabel(segment: string) {
  return (
    segmentLabelMap[segment] ??
    segment.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function BreadcrumbResponsive() {
  const pathname = usePathname();
  const { folderId, promptId, versionId } = useParams();
  const { data: folder } = useGetFolderMeta(folderId as string);
  const { data: version } = useGetVersion(versionId as string);

  // Show fallback "Main" for suppressed routes
  if (suppressPaths.includes(pathname)) {
    return <BreadcrumbPage className="capitalize">Main</BreadcrumbPage>;
  }

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    let label = formatLabel(segment);
    if (segment === folderId) label = folder?.title ?? "...";
    if (segment === versionId)
      label = version?.version ? `v${version.version}` : "...";

    return { label, href };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <React.Fragment key={crumb.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="capitalize">
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
