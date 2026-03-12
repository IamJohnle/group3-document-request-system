import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        // When the project has many routes, the artisan command can produce
        // a large amount of output which may exceed Node's default stdout
        // buffer and crash the dev/build process.  We only need form variants
        // for now so disable route generation entirely.
        wayfinder({
            formVariants: true,
            routes: false,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
