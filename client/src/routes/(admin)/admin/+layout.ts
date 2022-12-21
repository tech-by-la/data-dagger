import type {LayoutLoad} from "./$types";

export const load: LayoutLoad = () => {
    return {
        menuItems: [
            {
                name: "Users",
                target: "/admin/dashboard/users"
            },
            {
                name: "Organizations",
                target: "/admin/dashboard/organizations"
            },
            {
                name: "Projects",
                target: "/admin/dashboard/projects"
            },
            // {
            //     name: "Translations",
            //     target: "/admin/dashboard/translations"
            // }
        ]
    }
}
