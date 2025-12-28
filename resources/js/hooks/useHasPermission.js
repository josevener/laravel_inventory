import { usePage } from "@inertiajs/react"

export default function useHasPermission() {
  const { auth } = usePage().props
  const userPermissions = auth?.user?.permissions || []

  const hasPermission = (perm) => {
    if (!perm) return true
    if (Array.isArray(perm)) {
      return perm.some(p => userPermissions.includes(p))
    }
    return userPermissions.includes(perm)
  }

  return hasPermission
}
