const Ziggy = {
    url: "http://localhost",
    port: null,
    defaults: {},
    routes: {
        "sanctum.csrf-cookie": {
            uri: "sanctum/csrf-cookie",
            methods: ["GET", "HEAD"],
        },
        dashboard: {
            uri: "{client}/dashboard",
            methods: ["GET", "HEAD"],
            parameters: ["client"],
        },
        "profile.edit": {
            uri: "{client}/profile",
            methods: ["GET", "HEAD"],
            parameters: ["client"],
        },
        "profile.update": {
            uri: "{client}/profile",
            methods: ["PATCH"],
            parameters: ["client"],
        },
        "profile.destroy": {
            uri: "{client}/profile",
            methods: ["DELETE"],
            parameters: ["client"],
        },
        "products.index": {
            uri: "{client}/products",
            methods: ["GET", "HEAD"],
            parameters: ["client"],
        },
        "products.create": {
            uri: "{client}/products/create",
            methods: ["GET", "HEAD"],
            parameters: ["client"],
        },
        "products.store": {
            uri: "{client}/products",
            methods: ["POST"],
            parameters: ["client"],
        },
        "products.show": {
            uri: "{client}/products/{product}/show",
            methods: ["GET", "HEAD"],
            parameters: ["client", "product"],
            bindings: { product: "id" },
        },
        "products.edit": {
            uri: "{client}/products/{product}/edit",
            methods: ["GET", "HEAD"],
            parameters: ["client", "product"],
            bindings: { product: "id" },
        },
        "products.update": {
            uri: "{client}/products/{product}",
            methods: ["PUT"],
            parameters: ["client", "product"],
            bindings: { product: "id" },
        },
        "products.destroy": {
            uri: "{client}/products/{id}",
            methods: ["DELETE"],
            parameters: ["client", "id"],
        },
        "gatepass.inward.index": {
            uri: "{client}/gatepass/inward",
            methods: ["GET", "HEAD"],
            parameters: ["client"],
        },
        "gatepass.inward.create": {
            uri: "{client}/gatepass/inward/create",
            methods: ["GET", "HEAD"],
            parameters: ["client"],
        },
        "gatepass.inward.store": {
            uri: "{client}/gatepass/inward",
            methods: ["POST"],
            parameters: ["client"],
        },
        "categories.index": {
            uri: "{client}/categories",
            methods: ["GET", "HEAD"],
            parameters: ["client"],
        },
        "categories.create": {
            uri: "{client}/categories/create",
            methods: ["GET", "HEAD"],
            parameters: ["client"],
        },
        "categories.store": {
            uri: "{client}/categories",
            methods: ["POST"],
            parameters: ["client"],
        },
        "categories.show": {
            uri: "{client}/categories/{category}",
            methods: ["GET", "HEAD"],
            parameters: ["client", "category"],
        },
        "categories.edit": {
            uri: "{client}/categories/{category}/edit",
            methods: ["GET", "HEAD"],
            parameters: ["client", "category"],
            bindings: { category: "id" },
        },
        "categories.update": {
            uri: "{client}/categories/{category}",
            methods: ["PUT", "PATCH"],
            parameters: ["client", "category"],
            bindings: { category: "id" },
        },
        "categories.destroy": {
            uri: "{client}/categories/{category}",
            methods: ["DELETE"],
            parameters: ["client", "category"],
            bindings: { category: "id" },
        },
        "projects.index": {
            uri: "{client}/projects",
            methods: ["GET", "HEAD"],
            parameters: ["client"],
        },
        "projects.create": {
            uri: "{client}/projects/create",
            methods: ["GET", "HEAD"],
            parameters: ["client"],
        },
        "projects.store": {
            uri: "{client}/projects",
            methods: ["POST"],
            parameters: ["client"],
        },
        "projects.show": {
            uri: "{client}/projects/{project}",
            methods: ["GET", "HEAD"],
            parameters: ["client", "project"],
        },
        "projects.edit": {
            uri: "{client}/projects/{project}/edit",
            methods: ["GET", "HEAD"],
            parameters: ["client", "project"],
            bindings: { project: "id" },
        },
        "projects.update": {
            uri: "{client}/projects/{project}",
            methods: ["PUT", "PATCH"],
            parameters: ["client", "project"],
            bindings: { project: "id" },
        },
        "projects.destroy": {
            uri: "{client}/projects/{project}",
            methods: ["DELETE"],
            parameters: ["client", "project"],
            bindings: { project: "id" },
        },
        "units.index": {
            uri: "{client}/units",
            methods: ["GET", "HEAD"],
            parameters: ["client"],
        },
        "units.create": {
            uri: "{client}/units/create",
            methods: ["GET", "HEAD"],
            parameters: ["client"],
        },
        "units.store": {
            uri: "{client}/units",
            methods: ["POST"],
            parameters: ["client"],
        },
        "units.show": {
            uri: "{client}/units/{unit}",
            methods: ["GET", "HEAD"],
            parameters: ["client", "unit"],
        },
        "units.edit": {
            uri: "{client}/units/{unit}/edit",
            methods: ["GET", "HEAD"],
            parameters: ["client", "unit"],
            bindings: { unit: "id" },
        },
        "units.update": {
            uri: "{client}/units/{unit}",
            methods: ["PUT", "PATCH"],
            parameters: ["client", "unit"],
            bindings: { unit: "id" },
        },
        "units.destroy": {
            uri: "{client}/units/{unit}",
            methods: ["DELETE"],
            parameters: ["client", "unit"],
            bindings: { unit: "id" },
        },
        "product-serials.store": {
            uri: "{client}/product-serials",
            methods: ["POST"],
            parameters: ["client"],
        },
        "product-serials.destroy": {
            uri: "{client}/product-serials/{serial}",
            methods: ["DELETE"],
            parameters: ["client", "serial"],
            bindings: { serial: "id" },
        },
        "gatepass.inward.print_gatepass": {
            uri: "{client}/gatepass/inward/{gatepass}/print_gatepass",
            methods: ["GET", "HEAD"],
            parameters: ["client", "gatepass"],
            bindings: { gatepass: "id" },
        },
        "gatepass.inward.printPayslipMonthly": {
            uri: "{client}/gatepass/inward/print-payslip",
            methods: ["GET", "HEAD"],
            parameters: ["client"],
        },
        "roles.index": { uri: "roles", methods: ["GET", "HEAD"] },
        "permissions.index": { uri: "permissions", methods: ["GET", "HEAD"] },
        register: { uri: "register", methods: ["GET", "HEAD"] },
        login: { uri: "login", methods: ["GET", "HEAD"] },
        "password.request": {
            uri: "forgot-password",
            methods: ["GET", "HEAD"],
        },
        "password.email": { uri: "forgot-password", methods: ["POST"] },
        "password.reset": {
            uri: "reset-password/{token}",
            methods: ["GET", "HEAD"],
            parameters: ["token"],
        },
        "password.store": { uri: "reset-password", methods: ["POST"] },
        "verification.notice": {
            uri: "verify-email",
            methods: ["GET", "HEAD"],
        },
        "verification.verify": {
            uri: "verify-email/{id}/{hash}",
            methods: ["GET", "HEAD"],
            parameters: ["id", "hash"],
        },
        "verification.send": {
            uri: "email/verification-notification",
            methods: ["POST"],
        },
        "password.confirm": {
            uri: "confirm-password",
            methods: ["GET", "HEAD"],
        },
        "password.update": { uri: "password", methods: ["PUT"] },
        logout: { uri: "logout", methods: ["POST"] },
        "storage.local": {
            uri: "storage/{path}",
            methods: ["GET", "HEAD"],
            wheres: { path: ".*" },
            parameters: ["path"],
        },
    },
};
if (typeof window !== "undefined" && typeof window.Ziggy !== "undefined") {
    Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
