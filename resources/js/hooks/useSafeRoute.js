import { route } from 'ziggy-js'
import { usePage } from "@inertiajs/react"

export function useSafeRoute() {
    const { auth, ziggy } = usePage().props

    return (name, params = {}) => {
        // Only add client if it does not exist
        if (!params.client) {
            params.client = auth.user.client.code
        }

        return route(name, params, false, ziggy)
    };
}
