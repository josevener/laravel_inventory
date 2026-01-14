import { useForm } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import BrandForm from "./BrandForm"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function Create() {
  const safeRoute = useSafeRoute()

  const { data, setData, post, processing, errors } = useForm({
    code: "",
    name: "",
    description: "",
  })

  const submit = (e) => {
    e.preventDefault()
    post(safeRoute("brands.store"))
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("brands.index")}
      breadCrumbLinkText="Brands"
      breadCrumbPage="Create Brand"
    >
      <div className="w-full mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Create Brand</h1>

        <BrandForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={submit}
          submitLabel="Create Brand"
          cancelRoute="brands.index"
        />
      </div>
    </AuthenticatedLayout>
  )
}
