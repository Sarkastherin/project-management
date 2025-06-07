import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  layout("layouts/main.tsx", [
    index("routes/home.tsx"),
    route("opportunities", "routes/opportunities.tsx"),
    route("materials", "routes/materials.tsx"),
    route("settings", "routes/settings.tsx"),
    route("new-opportunity","routes/newOpportunity.tsx")
  ]),
] satisfies RouteConfig;
