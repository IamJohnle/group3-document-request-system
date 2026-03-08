import type { route as ziggyRoute } from 'ziggy-js';
import type { Auth } from '@/types/auth';

declare global {
    var route: typeof ziggyRoute;
}
declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
