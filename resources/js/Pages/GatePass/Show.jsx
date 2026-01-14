import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useSafeRoute } from "@/hooks/useSafeRoute";

export default function GatePassShow({ gatePass }) {
  const safeRoute = useSafeRoute();

  const handlePrint = () => {
    window.print();
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Gate Pass ${gatePass.gate_pass_no}`} />

      <div className="max-w-4xl mx-auto bg-white text-black p-8 space-y-6 print:p-0 print:max-w-full">

        {/* ACTION BAR (HIDDEN ON PRINT) */}
        <div className="flex justify-between items-center print:hidden">
          <Button variant="ghost" asChild>
            <Link href={safeRoute("gate-passes.index")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>

          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>

        {/* DOCUMENT HEADER */}
        <div className="text-center border-b pb-4">
          <h1 className="text-2xl font-bold tracking-wide">
            GATE PASS
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Gate Pass No: <span className="font-semibold">{gatePass.gate_pass_no}</span>
          </p>
        </div>

        {/* META INFO */}
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div>
            <span className="font-semibold">Client:</span>{" "}
            {gatePass.client?.name ?? "-"}
          </div>

          <div>
            <span className="font-semibold">Type:</span>{" "}
            {gatePass.type?.toUpperCase()}
          </div>

          <div>
            <span className="font-semibold">Project:</span>{" "}
            {gatePass.project?.name ?? "-"}
          </div>

          <div>
            <span className="font-semibold">Status:</span>{" "}
            {gatePass.status?.toUpperCase()}
          </div>

          <div>
            <span className="font-semibold">Authorized Bearer:</span>{" "}
            {gatePass.authorized_bearer}
          </div>

          <div>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(gatePass.created_at).toLocaleString()}
          </div>

          {gatePass.remarks && (
            <div className="col-span-2">
              <span className="font-semibold">Remarks:</span>{" "}
              {gatePass.remarks}
            </div>
          )}
        </div>

        {/* ITEMS TABLE */}
        <table className="w-full border-collapse text-sm mt-6">
          <thead>
            <tr className="border-b">
              <th className="border px-2 py-2 text-left w-10">#</th>
              <th className="border px-2 py-2 text-left">Item</th>
              <th className="border px-2 py-2 text-center w-24">Qty</th>
            </tr>
          </thead>
          <tbody>
            {gatePass.items.length === 0 ? (
              <tr>
                <td colSpan="3" className="border px-2 py-4 text-center">
                  No items
                </td>
              </tr>
            ) : (
              gatePass.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="border px-2 py-2 text-center">
                    {idx + 1}
                  </td>
                  <td className="border px-2 py-2">
                    <div className="font-medium">
                      {item.product?.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      SKU: {item.product?.sku}
                    </div>
                  </td>
                  <td className="border px-2 py-2 text-center">
                    {item.quantity}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* SIGNATURES */}
        <div className="grid grid-cols-3 gap-6 mt-12 text-center text-sm">
          <div>
            <div className="border-t pt-2">
              Prepared By
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {gatePass.created_by?.name ?? "-"}
            </div>
          </div>

          <div>
            <div className="border-t pt-2">
              Received By
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {gatePass.received_by?.name ?? "-"}
            </div>
          </div>

          <div>
            <div className="border-t pt-2">
              Authorized Signature
            </div>
          </div>
        </div>

      </div>
    </AuthenticatedLayout>
  );
}
