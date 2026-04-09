import SidebarAdminMenu from "@/app/(system-pages)/_components/sidebar/sidebar-admin-menu";
import { SidebarBranch } from "@/app/(system-pages)/_components/sidebar/sidebar-branch";
import { SidebarUser } from "@/app/(system-pages)/_components/sidebar/sidebar-user";
import { Separator } from "@/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function SystemPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider className="h-svh overflow-hidden">
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarBranch />
                    <SidebarSeparator className="mx-0" />
                </SidebarHeader>
                <SidebarContent className="px-1">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarAdminMenu />
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarSeparator className="mx-0" />
                    <SidebarUser />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <SidebarInset className="h-svh min-h-0 min-w-0 overflow-hidden">
                <header className="flex shrink-0 items-center gap-2 p-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger />
                        <Separator orientation="vertical" />
                    </div>
                </header>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
