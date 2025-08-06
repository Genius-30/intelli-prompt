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
import { useGetFolder } from "@/lib/queries/folder";
import { useGetPrompt } from "@/lib/queries/prompt";
import { useGetVersion } from "@/lib/queries/version";

const segmentLabelMap: Record<string, string> = {
  prompts: "Prompts",
  versions: "Versions",
  test: "Test",
  folders: "Folders",
};

function formatLabel(segment: string) {
  return (
    segmentLabelMap[segment] ??
    segment.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function BreadcrumbResponsive() {
  const pathname = usePathname();
  const { folderId, promptId, versionId } = useParams();

  // Only render full breadcrumbs for `/folders` path
  const isFoldersPath = pathname.startsWith("/folders");

  const { data: folder } = useGetFolder(folderId as string);
  const { data: prompt } = useGetPrompt(promptId as string);
  const { data: version } = useGetVersion(versionId as string);

  if (!isFoldersPath) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-lg">Main</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    let label = formatLabel(segment);

    if (segment === folderId) label = folder?.title ?? "...";
    else if (segment === promptId) label = prompt?.title ?? "...";
    else if (segment === versionId)
      label = version?.versionNumber ? `v${version.versionNumber}` : "...";

    return { label, href };
  });

  const lastCrumb = crumbs[crumbs.length - 1];

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center gap-y-0 sm:gap-y-0">
        {/* Mobile view: only last crumb */}
        <div className="block sm:hidden">
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">{lastCrumb.label}</BreadcrumbPage>
          </BreadcrumbItem>
        </div>

        {/* Desktop view: full crumbs */}
        <div className="hidden flex-wrap items-center gap-x-1.5 sm:flex">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <React.Fragment key={crumb.href}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="capitalize">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild className="capitalize">
                      <Link href={crumb.href} className="text-nowrap whitespace-nowrap">
                        {crumb.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </div>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
