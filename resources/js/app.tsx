import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { route as ziggyRoute } from 'ziggy-js';
import { initializeTheme } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        // wire up global `route` helper so it always reads the current
        // Inertia props. We fall back to the static Ziggy object (from
        // `@routes`) if props aren't available yet.
        window.route = ((
            name?: string,
            params: Record<string, any> | undefined = {},
            absolute?: boolean,
            config?: any,
        ) => {
            // `config` corresponds to Ziggy's runtime configuration object.
            // It can be used to override the default `url`, `port`,
            // or routes when generating a URL, which is handy for
            // testing, or when you need to generate a link to a
            // different application/host.
            const ziggy =
                config ??
                (props as any).ziggy as Record<string, any> | undefined ??
                (window as any).Ziggy;
            return ziggyRoute(name as any, params, absolute, ziggy);
        }) as typeof ziggyRoute;

        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
