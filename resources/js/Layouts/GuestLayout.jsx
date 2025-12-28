import { Toaster } from "@/Components/ui/toaster";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-col">
            <main className="flex-1 w-full">
                <div className="w-full mx-auto p-4">
                    <Toaster />
                    {children}
                </div>
            </main>
        </div>
    );
}
