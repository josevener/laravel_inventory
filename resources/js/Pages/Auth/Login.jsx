import { LoginForm } from '@/Components/LoginForm';
import { Head, useForm } from '@inertiajs/react';
import { GalleryVerticalEnd } from "lucide-react";

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <>
      <Head title="Log in" />

      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Left side - Form */}
        <div className="flex flex-col gap-4 p-4 md:p-6">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="/" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Zentrix Solutions
            </a>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md">
              <LoginForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                status={status}
                canResetPassword={canResetPassword}
                onSubmit={submit}
              />
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        {/* <div className="relative hidden bg-muted lg:block">
          <img
            src="/storage/background.png"
            alt="Login background"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div> */}

        {/* Right side - Product Info */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#26A69A] to-[#1E8E84] text-primary-foreground p-12">
          <div className="max-w-lg space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Zentrix Inventory & POS Platform
            </h1>

            <p className="text-lg opacity-90">
              A unified inventory, sales, and operations system built for modern
              businesses — from retail stores to restaurants and warehouses.
            </p>

            <ul className="space-y-4 text-base">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                Real-time inventory tracking across all locations
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                POS-ready with barcode scanning and receipt printing
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                Designed for Retail, Restaurants, Warehouses, and more
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                Sales, stock, and reports in one centralized system
              </li>
            </ul>

            <div className="pt-6 text-sm opacity-75">
              Log in to manage products, monitor stock, and run your business with
              confidence.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}