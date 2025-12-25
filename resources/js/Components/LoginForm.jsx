import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Link } from "@inertiajs/react";

export function LoginForm({
  className,
  data,
  setData,
  errors,
  processing,
  status,
  canResetPassword,
  onSubmit,
  ...props
}) {
  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      {status && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          {status}
        </div>
      )}

      <div className="grid gap-6">
        {/* Email Field */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            required
            autoFocus
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="grid gap-2">
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            required
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {canResetPassword && (
              <Link
                href={route("password.request")}
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            )}
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={data.remember}
            onCheckedChange={(checked) => setData("remember", checked)}
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={processing}>
          {processing ? "Logging in..." : "Login"}
        </Button>
      </div>

      {/* Optional: Sign up link (uncomment if you have registration) */}
      {/* <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href={route("register")} className="underline underline-offset-4 hover:text-primary">
          Sign up
        </Link>
      </div> */}
    </form>
  );
}