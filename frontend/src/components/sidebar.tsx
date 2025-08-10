"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarInput,
} from "@/components/ui/sidebar";
import { Home, ChevronDown } from "lucide-react";
import Image from "next/image";
import { SidebarGroupSection } from "./SidebarGroupSection";

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      "Chemical Management": true,
    }
  );

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  const navGroups = [
    {
      title: "Chemical Management",
      items: [
        { name: "Chemicals", href: "/chemicals", icon: "atom" as const },
        { name: "Recipes", href: "/recipe", icon: "book" as const },
        {
          name: "Chemical Instances",
          href: "/instances",
          icon: "flask" as const,
        },
      ],
    },
  ];

  const filteredGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <ShadcnSidebar className="h-screen py-0">
      <SidebarHeader className="px-3">
        <div className="ml-[0.3em] flex h-14 items-center pt-[0.1em]">
          <Link href="/" className="flex items-center hover:opacity-80">
            <Image
              src="/logo.png"
              alt="Miru"
              className="mr-2 h-4"
              width={20}
              height={20}
            />
          </Link>
        </div>
        <div className="relative">
          <SidebarInput
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarMenu className="mt-3 px-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/"}
              onClick={() => router.push("/")}
              className="opacity-70 hover:opacity-100 data-[active=true]:bg-primary-light data-[active=true]:font-medium data-[active=true]:text-primary data-[active=true]:opacity-100"
            >
              <Home className="mr-1 h-4 w-4" />
              Home
            </SidebarMenuButton>
          </SidebarMenuItem>
          <div className="mt-2 border-b border-dashed border-gray-300/75" />
        </SidebarMenu>

        {filteredGroups.map((group) => (
          <SidebarGroupSection
            key={group.title}
            group={group}
            pathname={pathname}
            expanded={expandedGroups[group.title]}
            toggleGroup={toggleGroup}
          />
        ))}
      </SidebarContent>

      <SidebarRail />
    </ShadcnSidebar>
  );
}
