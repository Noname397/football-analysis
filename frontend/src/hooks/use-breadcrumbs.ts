"use client";

import { usePathname, useParams } from "next/navigation";

export function useBreadcrumbs() {
  const pathname = usePathname();
  const params = useParams();

  const paths = pathname.split("/").filter(Boolean);

  if (paths.length === 0) {
    return [{ name: "Portal Home", href: "/", isCurrentPage: true }];
  }

  // Special case for work-order/[id]
  if (
    paths[0] === "work-order" &&
    paths.length === 2 &&
    paths[1].startsWith("wo")
  ) {
    return [
      { name: "Portal Home", href: "/", isCurrentPage: false },
      {
        name: "Pending Instances",
        href: "/pending-instances",
        isCurrentPage: false,
      },
      {
        name: `Work Order ${paths[1].toUpperCase()}`,
        href: pathname,
        isCurrentPage: true,
      },
    ];
  }

  // Special case for pending-instances/[id]
  if (paths[0] === "pending-instances" && params.id) {
    const instanceId = params.id as string;

    // Check if we're coming from a work order
    // In a real app, you'd check the referrer or use state management
    // For now, we'll assume a fixed path for demonstration
    if (instanceId === "pi1" || instanceId === "pi2") {
      return [
        { name: "Portal Home", href: "/", isCurrentPage: false },
        {
          name: "Pending Instances",
          href: "/pending-instances",
          isCurrentPage: false,
        },
        {
          name: "Work Order WO-2023-001",
          href: "/work-order/wo1",
          isCurrentPage: false,
        },
        {
          name: "Instance Details",
          href: `/pending-instances/${instanceId}`,
          isCurrentPage: true,
        },
      ];
    }
  }

  return [
    { name: "Portal Home", href: "/", isCurrentPage: false },
    ...paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      const isCurrentPage = index === paths.length - 1;

      // Special case for pending-instances/[id]
      if (path.match(/^pi\d+$/) && paths[index - 1] === "pending-instances") {
        return {
          name: "Instance Details",
          href,
          isCurrentPage,
        };
      }

      // Special case for work-order/[id]
      if (path.match(/^wo\d+$/) && paths[index - 1] === "work-order") {
        return {
          name: `Work Order ${path.toUpperCase()}`,
          href,
          isCurrentPage,
        };
      }

      // Format the path name
      const formattedName = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return { name: formattedName, href, isCurrentPage };
    }),
  ];
}
