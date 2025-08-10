"use client";

import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";

interface HeaderProps {
  isOpen: boolean;
}

export function Header({ isOpen }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const breadcrumbs = useBreadcrumbs();

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky left-0 right-0 top-0 z-40 flex h-14 w-full items-center justify-between bg-transparent px-3 py-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.isCurrentPage ? (
                    <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Link
        target="_blank"
        href="https://docs.google.com/spreadsheets/d/1jCKC62jfjqr2X2qqrwD_XZBl9nI0TRx6UuNuPd5zbP0/edit?gid=0#gid=0"
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-[50em] px-[1em] font-normal"
        >
          <MessageSquare className="h-4 w-4" />
          Feedback
        </Button>
      </Link>
    </header>
  );
}
