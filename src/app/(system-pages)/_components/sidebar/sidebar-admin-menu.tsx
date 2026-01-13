"use client";

import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentProps, useMemo } from "react";

import { useMainNavLinks } from "@/app/(system-pages)/_components/sidebar/sidebar-admin-data";
import { hasPermission } from "@/auth/core";
import { useAuth } from "@/auth/nextjs/components/auth-provider";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import WrapWithTooltip from "@/components/wrap-with-tooltip";
import { cn } from "@/lib/utils";

export default function SidebarAdminMenu({
    className,
    ...props
}: ComponentProps<"div">) {
    const pathname = usePathname();
    const { session } = useAuth();
    const mainNavLinks = useMainNavLinks();

    const allowedNavLinks = useMemo(
        () =>
            session?.user.role
                ? mainNavLinks
                    .filter((link) =>
                        hasPermission(session.user, "screens", "view", link),
                    )
                    .map((link) => ({
                        ...link,
                        children: link.children?.filter((ch) =>
                            hasPermission(session.user, "screens", "view", ch),
                        ),
                    }))
                : [],
        [session, mainNavLinks],
    );

    function renderSidebarItems(items: typeof allowedNavLinks, pathname: string) {
        return items
            .filter((l) => {
                if (!session?.user) return false;
                try {
                    return hasPermission(session.user, "screens", "view", l);
                } catch (_) {
                    return false;
                }
            })
            .map((navLink) =>
                navLink.children?.length ? (
                    <Collapsible
                        defaultOpen={navLink.children.some(
                            (child) => child.url && pathname.includes(child.url),
                        )}
                        key={`${navLink.label}Collapsible`}
                    >
                        <SidebarMenuItem>
                            {/* Modified structure: Split the button into two distinct areas */}
                            <div className="flex w-full items-center">
                                {/* Navigation Link Area - Takes most of the space */}
                                <div className="min-w-0 flex-1">
                                    {navLink.url ? (
                                        <Link
                                            className={cn(
                                                "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors ltr:rounded-r-none rtl:rounded-l-none",
                                                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                                                "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2",
                                            )}
                                            href={navLink.url}
                                        >
                                            {navLink.icon ? (
                                                <navLink.icon className="shrink-0" size={16} />
                                            ) : null}
                                            <WrapWithTooltip delay={2000} text={navLink.label}>
                                                <span className="truncate group-data-[collapsible=icon]:sr-only">
                                                    {navLink.label}
                                                </span>
                                            </WrapWithTooltip>
                                        </Link>
                                    ) : (
                                        <div
                                            className={cn(
                                                "flex items-center gap-2 rounded-md px-2 py-1.5 ltr:rounded-r-none rtl:rounded-l-none",
                                                "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2",
                                            )}
                                        >
                                            {navLink.icon ? (
                                                <navLink.icon className="shrink-0" size={16} />
                                            ) : null}
                                            <WrapWithTooltip delay={2000} text={navLink.label}>
                                                <span className="truncate group-data-[collapsible=icon]:sr-only">
                                                    {navLink.label}
                                                </span>
                                            </WrapWithTooltip>
                                        </div>
                                    )}
                                </div>

                                {/* Collapsible Trigger Area - Fixed width, separate hover state */}
                                <div className="shrink-0">
                                    <CollapsibleTrigger
                                        aria-activedescendant={
                                            navLink.children.some(
                                                (child) => child.url && pathname.includes(child.url),
                                            )
                                                ? "true"
                                                : "false"
                                        }
                                        className={cn(
                                            "flex h-8 w-8 items-center justify-center rounded-md transition-colors ltr:rounded-l-none rtl:rounded-r-none",
                                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                                            "group group-data-[collapsible=icon]:hidden",
                                            "data-[state=open]:bg-sidebar-accent/30",
                                        )}
                                    >
                                        <ChevronDownIcon
                                            className="transition-transform duration-200 group-data-[state=open]:ltr:rotate-180 group-data-[state=open]:rtl:-rotate-90"
                                            size={16}
                                        />
                                    </CollapsibleTrigger>
                                </div>
                            </div>
                        </SidebarMenuItem>
                        <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                            <SidebarMenuSub>
                                {navLink.children.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.url || subItem.label}>
                                        <SidebarMenuSubButton
                                            aria-activedescendant={
                                                subItem.url && pathname.includes(subItem.url)
                                                    ? "true"
                                                    : "false"
                                            }
                                            asChild
                                            className="aria-activedescendant:bg-accent/60"
                                        >
                                            {subItem.url ? (
                                                <Link href={subItem.url}>
                                                    {subItem.icon ? <subItem.icon /> : null}
                                                    <WrapWithTooltip delay={2000} text={subItem.label}>
                                                        <span className="truncate text-xs">
                                                            {subItem.label}
                                                        </span>
                                                    </WrapWithTooltip>
                                                </Link>
                                            ) : (
                                                <span>
                                                    {subItem.icon ? <subItem.icon /> : null}
                                                    <WrapWithTooltip delay={2000} text={subItem.label}>
                                                        <span className="truncate text-xs">
                                                            {subItem.label}
                                                        </span>
                                                    </WrapWithTooltip>
                                                </span>
                                            )}
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </Collapsible>
                ) : (
                    <SidebarMenuItem key={navLink.url || navLink.label}>
                        <SidebarMenuButton
                            aria-activedescendant={
                                navLink.url && pathname.includes(navLink.url) ? "true" : "false"
                            }
                            asChild
                            className="aria-activedescendant:bg-accent/60"
                            size="sm"
                            tooltip={navLink.label}
                        >
                            {navLink.url ? (
                                <Link href={navLink.url}>
                                    {navLink.icon ? <navLink.icon /> : null}
                                    <WrapWithTooltip delay={2000} text={navLink.label}>
                                        <span className="truncate">{navLink.label}</span>
                                    </WrapWithTooltip>
                                </Link>
                            ) : (
                                <span className="flex items-center">
                                    {navLink.icon ? <navLink.icon /> : null}
                                    <WrapWithTooltip delay={2000} text={navLink.label}>
                                        <span className="truncate">{navLink.label}</span>
                                    </WrapWithTooltip>
                                </span>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ),
            );
    }

    function renderDropdownMenuForItem(
        navLink: (typeof allowedNavLinks)[number],
        pathname: string,
    ) {
        if (navLink.children?.length) {
            return (
                <DropdownMenu key={`${navLink.label}DropdownMenu`}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="sm" tooltip={navLink.label}>
                                {navLink.icon ? <navLink.icon size={20} /> : null}
                                <WrapWithTooltip delay={2000} text={navLink.label}>
                                    <span>{navLink.label}</span>
                                </WrapWithTooltip>
                                <SidebarMenuAction
                                    asChild
                                    className="ml-auto transition-transform duration-200"
                                >
                                    <ChevronDownIcon
                                        className="transition-transform duration-200 group-data-[state=open]:ltr:rotate-90 group-data-[state=open]:rtl:-rotate-90"
                                        size={16}
                                    />
                                </SidebarMenuAction>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                        <DropdownMenuGroup>
                            {navLink.url && (
                                <DropdownMenuItem asChild>
                                    <Link className="font-medium" href={navLink.url}>
                                        {navLink.icon ? <navLink.icon size={20} /> : null}
                                        <WrapWithTooltip delay={2000} text={navLink.label}>
                                            <span>{navLink.label}</span>
                                        </WrapWithTooltip>
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {navLink.children.map((subItem) => (
                                <DropdownMenuItem
                                    aria-activedescendant={
                                        subItem.url && pathname.includes(subItem.url)
                                            ? "true"
                                            : "false"
                                    }
                                    asChild
                                    className="aria-activedescendant:bg-accent/60"
                                    key={subItem.url || subItem.label}
                                >
                                    {subItem.url ? (
                                        <Link href={subItem.url}>
                                            {subItem.icon ? <subItem.icon size={20} /> : null}
                                            <WrapWithTooltip delay={2000} text={subItem.label}>
                                                <span>{subItem.label}</span>
                                            </WrapWithTooltip>
                                        </Link>
                                    ) : (
                                        <span>
                                            <WrapWithTooltip delay={2000} text={subItem.label}>
                                                <span>{subItem.label}</span>
                                            </WrapWithTooltip>
                                        </span>
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        } else {
            return (
                <SidebarMenuItem key={navLink.url || navLink.label}>
                    <SidebarMenuButton
                        aria-activedescendant={
                            navLink.url && pathname.includes(navLink.url) ? "true" : "false"
                        }
                        asChild
                        className="aria-activedescendant:bg-accent/60"
                        size="sm"
                        tooltip={navLink.label}
                    >
                        {navLink.url ? (
                            <Link href={navLink.url}>
                                {navLink.icon ? <navLink.icon size={20} /> : null}
                                <WrapWithTooltip delay={2000} text={navLink.label}>
                                    <span>{navLink.label}</span>
                                </WrapWithTooltip>
                            </Link>
                        ) : (
                            <span className="flex items-center">
                                {navLink.icon ? <navLink.icon size={20} /> : null}
                                <WrapWithTooltip delay={2000} text={navLink.label}>
                                    <span>{navLink.label}</span>
                                </WrapWithTooltip>
                            </span>
                        )}
                    </SidebarMenuButton>
                </SidebarMenuItem>
            );
        }
    }

    return (
        <div className={className} {...props}>
            <SidebarMenu>
                {/* Sidebar (Collapsible) */}
                {!session?.user &&
                    Array.from({ length: mainNavLinks.length }).map((_, index) => (
                        <SidebarMenuSkeleton key={index} />
                    ))}
                <div className="space-y-1 group-data-[collapsible=icon]:hidden">
                    {renderSidebarItems(allowedNavLinks, pathname)}
                </div>
                {/* Dropdown (Collapsed/rail) */}
                <div className="hidden group-data-[collapsible=icon]:block">
                    {allowedNavLinks
                        .map((item) => renderDropdownMenuForItem(item, pathname))}
                </div>
            </SidebarMenu>
        </div>
    );
}
