import { AppSidebar } from "@/components/AppSidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useFlashToast } from "@/hooks/useFlashToast";

export default function AuthenticatedLayout({ 
    breadCrumbLink,
    breadCrumbLinkText,
    breadCrumbPage,
    children 
}) {
    // const user = usePage().props.auth.user;

    // const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    
    useFlashToast()

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1 cursor-pointer" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    {breadCrumbLink && (
                                        <BreadcrumbLink href={breadCrumbLink}>
                                            {breadCrumbLinkText}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {breadCrumbPage && (
                                    <>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            {<BreadcrumbPage>{breadCrumbPage}</BreadcrumbPage>}
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Toaster />
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
