"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Optional: map fixed segments to custom names
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

  const segments = pathname.split("/").filter(Boolean); // Filter out empty segments

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    return {
      label: formatLabel(segment),
      href,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Dynamic crumbs */}
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
