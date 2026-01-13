import SidebarAdminMenu from "@/app/(system-pages)/_components/sidebar/sidebar-admin-menu";
import { SidebarOrganization } from "@/app/(system-pages)/_components/sidebar/sidebar-organization";
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
import { getT } from "@/lib/i18n/actions";

export default async function SystemPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { locale } = await getT();

    return (
        <SidebarProvider>
            <Sidebar
                collapsible="icon"
                side={locale === "ar" ? "right" : "left"}
                variant="inset"
            >
                <SidebarHeader>
                    <SidebarOrganization />
                    <SidebarSeparator className="mx-0" />
                </SidebarHeader>
                <SidebarContent className="px-1" dir={locale === "ar" ? "rtl" : "ltr"}>
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
            <SidebarInset>
                <header className="flex shrink-0 items-center gap-2 p-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger />
                        <Separator
                            orientation="vertical"
                        />
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
