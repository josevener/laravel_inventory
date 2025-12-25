import { LoginForm } from '@/Components/login-form';
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
        <div className="relative hidden bg-muted lg:block">
          <img
            src="https://ui.shadcn.com/placeholder.svg" // or your own image
            alt="Login background"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
}