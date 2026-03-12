import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    FilePlus,    // Icon for "New Request"
    History,     // Icon for "History"
    Users,
    FileStack,
    BarChart3,
    FileText,
    LogOut,
    Settings,
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

    // Determine if we are in the admin section
    const isAdmin = url.startsWith('/admin');

    // 1. Admin Navigation (Matched to your route:list)
    const adminNavItems = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
            isActive: url === '/admin/dashboard',
        },
        {
            title: 'Requests',
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
        // Note: I added Reports as a placeholder if you decide to add it back
        {
            title: 'Reports',
            href: '/admin/reports',
            icon: BarChart3,
            isActive: url.startsWith('/admin/reports'),
        },
    ];

    // 2. Student Navigation (Matched to your route:list)
    const studentNavItems = [
        {
            title: 'Dashboard',
            href: '/dashboard', // From your route:list (GET dashboard)
            icon: LayoutGrid,
            isActive: url === '/dashboard',
        },
        {
            title: 'Request Document',
            href: '/requests/create', // From your route:list (GET requests/create)
            icon: FilePlus,
            isActive: url === '/requests/create',
        },
        {
            title: 'My History',
            href: '/history', // From your route:list (GET history)
            icon: History,
            isActive: url === '/history',
        },
    ];

    // Select items based on the current URL
    const navItems = isAdmin ? adminNavItems : studentNavItems;
    const homeLink = isAdmin ? '/admin/dashboard' : '/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeLink}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter className="space-y-1 border-t p-2">
                <SidebarMenu>
                    {/* Settings - Using your GET settings/profile route */}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={url.startsWith('/settings')}
                        >
                            <Link
                                href="/settings/profile"
                                className="w-full justify-start"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Logout Button */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
