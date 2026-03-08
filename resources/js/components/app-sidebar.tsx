import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    FileText,
    Users,
    FileStack,
    BarChart3,
    LogOut
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

export function AppSidebar() {
    const { url } = usePage();

    // Define Admin Navigation
    const adminNavItems = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard', // Adjust based on your actual routes
            icon: LayoutGrid,
            isActive: url.startsWith('/admin/dashboard'),
        },
        {
            title: 'Document Requests',
            href: '/admin/requests',
            icon: FileText,
            isActive: url.startsWith('/admin/requests'),
        },
        {
            title: 'Students',
            href: '/admin/students',
            icon: Users,
            isActive: url.startsWith('/admin/students'),
        },
        {
            title: 'Document Types',
            href: '/admin/document-types',
            icon: FileStack,
            isActive: url.startsWith('/admin/document-types'),
        },
        {
            title: 'Reports',
            href: '/admin/reports',
            icon: BarChart3,
            isActive: url.startsWith('/admin/reports'),
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={adminNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* Logout Button directly in the sidebar for easy access */}
                        <SidebarMenuButton asChild>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </Link>
                        </SidebarMenuButton>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
