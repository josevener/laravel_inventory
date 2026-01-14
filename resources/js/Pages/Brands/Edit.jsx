import { useForm } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import BrandForm from "./BrandForm"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function Edit({ brand }) {
  const safeRoute = useSafeRoute()

  const { data, setData, put, processing, errors } = useForm({
    code: brand.code ?? "",
    name: brand.name ?? "",
    description: brand.description ?? "",
  })

  const submit = (e) => {
    e.preventDefault()
    put(safeRoute("brands.update", { brand: brand.id }))
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("brands.index")}
      breadCrumbLinkText="Brands"
      breadCrumbPage="Edit Brand"
    >
      <div className="w-full mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Edit Brand</h1>

        <BrandForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={submit}
          submitLabel="Update Brand"
          cancelRoute="brands.index"
        />
      </div>
    </AuthenticatedLayout>
  )
}
