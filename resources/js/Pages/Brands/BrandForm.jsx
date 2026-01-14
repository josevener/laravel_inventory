import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { Card, CardContent } from "@/Components/ui/card"
import { Link } from "@inertiajs/react"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function BrandForm({
  data,
  setData,
  errors,
  processing,
  onSubmit,
  submitLabel = "Save Brand",
  cancelRoute,
}) {
  const safeRoute = useSafeRoute()

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={data.code}
              onChange={(e) => setData("code", e.target.value)}
              placeholder="BR-001"
            />
            {errors.code && (
              <p className="text-sm text-destructive mt-1">{errors.code}</p>
            )}
          </div>

          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Samsung"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              rows={4}
              placeholder="Consumer electronics brand..."
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={processing}>
              {processing ? "Saving..." : submitLabel}
            </Button>
            <Button variant="outline" asChild>
              <Link href={safeRoute(cancelRoute)}>Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
