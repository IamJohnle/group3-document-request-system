/*
  Provide fallback type declarations for the auto-generated Wayfinder
  route helpers so that TypeScript won't complain when the files haven't
  been generated yet (or while editing the project outside of the build step).
  The real routes file will be produced at resources/js/routes.ts and may
  include submodules under resources/js/routes/*.ts, but in the meantime
  treat everything under `@/routes` as any.
*/

declare module '@/routes' {
    const routes: any;
    export default routes;
    export const dashboard: any;
    export const login: any;
    export const register: any;
    export const logout: any;
    export const home: any;
    // note: plugin will add more named exports when generated
}

declare module '@/routes/*' {
    const helper: any;
    export default helper;
}
