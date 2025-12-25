import { useForm, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { UserPlus, Copy, Check } from "lucide-react"
import { Link } from "@inertiajs/react"
import { useSafeRoute } from "@/hooks/useSafeRoute"
import { useState, useEffect } from "react"
import { toast } from "sonner" // Assuming you're using Sonner for toasts

// Simple strong password generator
const generatePassword = () => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  const length = 12

  // Ensure at least one of each type
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]
  password += "0123456789"[Math.floor(Math.random() * 10)]
  password += "!@#$%^&*"[Math.floor(Math.random() * 8)]

  // Fill the rest
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }

  // Shuffle
  return password.split("").sort(() => Math.random() - 0.5).join("")
}

export default function UserForm({ user = null, clients, roles }) {
  const isEdit = !!user
  const safeRoute = useSafeRoute()
  const { auth } = usePage().props
  const isSuperAdmin = auth?.user?.client?.is_superadmin || false

  const [generatedPassword, setGeneratedPassword] = useState("")
  const [copied, setCopied] = useState(false)

  const { data, setData, post, put, processing, errors, reset } = useForm({
    first_name: user?.first_name || "",
    middle_name: user?.middle_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    password: "", // Will be auto-filled on create
    client_id: user?.client_id || auth?.user?.client_id,
    roles: user?.roles?.map(r => r.id) || [],
  })

  // Generate password only on create (not edit)
  useEffect(() => {
    if (!isEdit && !generatedPassword) {
      const pass = generatePassword()
      setGeneratedPassword(pass)
      setData("password", pass)
    }
  }, [isEdit, generatedPassword, setData])

  const fullName = `${data.first_name} ${data.middle_name ? data.middle_name + " " : ""}${data.last_name}`.trim()

  const handleCopyCredentials = () => {
    const text = `Full Name: ${fullName}\nEmail: ${data.email}\nPassword: ${generatedPassword}`
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      toast.success("Credentials copied to clipboard!")
      setTimeout(() => setCopied(false), 3000)
    })
  }

  const submit = (e) => {
    e.preventDefault()

    const url = isEdit
      ? safeRoute("users.update", { user: user.id })
      : safeRoute("users.store")

    const method = isEdit ? put : post

    method(url, {
      onSuccess: () => {
        if (!isEdit) {
          // Only show copy button + toast after successful creation
          toast.success("User created successfully!", {
            description: "Credentials have been copied to your clipboard.",
            duration: 6000,
          })
          handleCopyCredentials() // Auto-copy on success
        } else {
          toast.success("User updated successfully!")
        }
      },
      onError: () => {
        toast.error("Failed to save user. Please check the form.")
      }
    })
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("users.index")}
      breadCrumbLinkText="Users"
      breadCrumbPage={`${isEdit ? "Edit User" : "Create User"}`}
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UserPlus className="h-8 w-8" />
            {isEdit ? "Edit User" : "Create User"}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>First Name *</Label>
                  <Input
                    value={data.first_name}
                    onChange={(e) => setData("first_name", e.target.value)}
                    placeholder="John"
                    required={!isEdit}
                  />
                  {errors.first_name && <p className="text-sm text-destructive mt-1">{errors.first_name}</p>}
                </div>

                <div>
                  <Label>Middle Name</Label>
                  <Input
                    value={data.middle_name}
                    onChange={(e) => setData("middle_name", e.target.value)}
                    placeholder="Middle (optional)"
                  />
                  {errors.middle_name && <p className="text-sm text-destructive mt-1">{errors.middle_name}</p>}
                </div>

                <div>
                  <Label>Last Name *</Label>
                  <Input
                    value={data.last_name}
                    onChange={(e) => setData("last_name", e.target.value)}
                    placeholder="Doe"
                    required={!isEdit}
                  />
                  {errors.last_name && <p className="text-sm text-destructive mt-1">{errors.last_name}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>

              {/* Password - Create Mode */}
              {!isEdit && (
                <div>
                  <Label>Generated Password</Label>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      value={generatedPassword}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newPass = generatePassword()
                        setGeneratedPassword(newPass)
                        setData("password", newPass)
                        toast.success("New password generated!")
                      }}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCopyCredentials}
                      disabled={copied}
                    >
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copied ? "Copied!" : "Copy Credentials"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    A strong password has been auto-generated. You can regenerate or copy it.
                  </p>
                </div>
              )}

              {/* Password - Edit Mode */}
              {isEdit && (
                <div>
                  <Label>New Password (leave blank to keep current)</Label>
                  <Input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                </div>
              )}

              {/* Client Select - Super Admin Only */}
              {isSuperAdmin && (
                <div>
                  <Label>Client *</Label>
                  <Select value={data.client_id?.toString()} onValueChange={(v) => setData("client_id", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name} ({client.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.client_id && <p className="text-sm text-destructive mt-1">{errors.client_id}</p>}
                </div>
              )}

              {/* Roles */}
              <div>
                <Label>Roles *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                  {roles.map((role) => (
                    <label key={role.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.roles.includes(role.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setData("roles", [...data.roles, role.id])
                          } else {
                            setData("roles", data.roles.filter((id) => id !== role.id))
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-medium">{role.name}</span>
                    </label>
                  ))}
                </div>
                {errors.roles && <p className="text-sm text-destructive mt-2">{errors.roles}</p>}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6">
                <Button type="submit" size="lg" disabled={processing}>
                  {processing ? "Saving..." : (isEdit ? "Update User" : "Create User")}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={safeRoute("users.index")}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}