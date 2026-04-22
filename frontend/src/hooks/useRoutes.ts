/**
 * useRoutes Hook - Type-safe navigation throughout the app
 * Eliminates hardcoded route strings and provides IDE autocomplete
 * 
 * Usage:
 * const routes = useRoutes();
 * navigate(routes.DASHBOARD.HOME);
 * navigate(routes.SCANS.DETAIL(scanId));
 */

import ROUTES from "@/lib/routes"
import { useCallback } from "react"
import { useNavigate as useReactNavigate } from "react-router-dom"

export const useRoutes = () => {
  return ROUTES;
};

/**
 * useNavigation Hook - Typed navigation with route constants
 * 
 * Usage:
 * const { to } = useNavigation();
 * to.DASHBOARD.HOME();
 * to.SCANS.DETAIL(123);
 */
export const useNavigation = () => {
  const navigate = useReactNavigate();

  const navigateTo = useCallback(
    (path: string | (() => string), options?: { replace?: boolean; state?: any }) => {
      const resolvedPath = typeof path === "function" ? path() : path;
      navigate(resolvedPath, { replace: options?.replace, state: options?.state });
    },
    [navigate]
  );

  return {
    navigate: navigateTo,
    to: ROUTES,
    back: () => navigate(-1),
    forward: () => navigate(1),
  };
};

/**
 * useBreadcrumbs Hook - Generate breadcrumbs from current route
 */
export const useBreadcrumbs = () => {
  const navigate = useReactNavigate();

  return {
    navigate,
    routes: ROUTES,
  };
};

export default useRoutes;
