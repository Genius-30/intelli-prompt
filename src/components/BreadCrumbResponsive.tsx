"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGetPromptMeta } from "@/lib/queries/prompt";
import { useGetVersion } from "@/lib/queries/version";

const segmentLabelMap: Record<string, string> = {
  prompts: "Your Prompts",
  versions: "Versions",
  test: "Test",
  dashboard: "Dashboard",
};

function formatLabel(segment: string) {
  return (
    segmentLabelMap[segment] ??
    segment.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function BreadcrumbResponsive() {
  const pathname = usePathname();
  const { promptId, versionId } = useParams();
  const { data: prompt } = useGetPromptMeta(promptId as string);
  const { data: version } = useGetVersion(versionId as string);

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    let label = formatLabel(segment);

    if (segment === promptId) {
      label = prompt?.title ?? "...";
    }

    if (segment === versionId) {
      label = version?.version ?? "...";
    }

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
