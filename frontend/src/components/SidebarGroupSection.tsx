"use client";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Atom,
  FlaskRoundIcon as Flask,
  Wrench,
  Plus,
  Settings,
  ChevronDown,
  BookOpen,
} from "lucide-react";

const iconMap = {
  atom: <Atom className="mr-1 h-4 w-4" />,
  flask: <Flask className="mr-1 h-4 w-4" />,
  wrench: <Wrench className="mr-1 h-4 w-4" />,
  plus: <Plus className="mr-1 h-4 w-4" />,
  settings: <Settings className="mr-1 h-4 w-4" />,
  book: <BookOpen className="mr-1 h-4 w-4" />,
};

interface SidebarGroupSectionProps {
  group: {
    title: string;
    items: {
      name: string;
      href: string;
      icon: keyof typeof iconMap;
    }[];
  };
  pathname: string;
  expanded?: boolean;
  toggleGroup: (title: string) => void;
}

export function SidebarGroupSection({
  group,
  pathname,
  expanded = false,
  toggleGroup,
}: SidebarGroupSectionProps) {
  return (
    <SidebarGroup className="px-3 py-1">
      <button
        onClick={() => toggleGroup(group.title)}
        className="flex w-full items-center justify-between py-1 pr-2"
      >
        <SidebarGroupLabel className="text-sm font-medium opacity-70">
          {group.title}
        </SidebarGroupLabel>
        <ChevronDown
          className={`h-4 w-4 opacity-50 transition-transform duration-200 ${
            expanded ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>

      {expanded && (
        <SidebarGroupContent>
          <SidebarMenu className="gap-0.5">
            {group.items.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className="opacity-70 hover:opacity-100 data-[active=true]:bg-primary-light data-[active=true]:font-medium data-[active=true]:text-primary data-[active=true]:opacity-100"
                >
                  <Link href={item.href}>
                    {iconMap[item.icon]}
                    {item.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  );
}
