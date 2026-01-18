import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Trash2, ArrowLeft, Plus } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ConfirmDialog from "@/Components/custom/ConfirmDialog";
import { useSafeRoute } from "@/hooks/useSafeRoute";

export default function ProductShow({ product }) {
  const [serialInput, setSerialInput] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const safeRoute = useSafeRoute();

  const serialLimitReached =
    product.serials.length >= product.current_stock;
  
  const addSerial = () => {
    setIsLoading(true);

    router.post(
      safeRoute("product-serials.store"),
      {
        product_id: product.id,
        serial_no: serialInput,
      },
      {
        preserveScroll: true,

        onSuccess: () => {
          setSerialInput("");
          setConfirmOpen(false);
        },
        
        onError: () => {
          // do nothing
        },

        onFinish: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const deleteSerial = (id) => {
    router.delete(safeRoute("product-serials.destroy", { product: id }));
  };

  const openAddModal = () => {
    if (!serialInput.trim()) return;
    if (serialLimitReached) return;

    setConfirmOpen(true);
  };

  return (
    <AuthenticatedLayout>
      <Head title={product.name} />

      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href={safeRoute("products.index")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Link>
        </Button>

        {/* Product Info */}
        <Card>
          <CardHeader>
            <span className="flex flex-row items-center gap-2">
              <p className="text-muted-foreground">Product Name: </p>
              <CardTitle>{product.name}</CardTitle>
            </span>
            <p className="text-muted-foreground">SKU: {product.sku}</p>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p>{product.category?.name ?? "Others"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Unit</p>
              <p>{product.unit?.short_name ?? "Others"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Current Stock</p>
              <p className="text-lg font-semibold">{product.current_stock}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Reorder Level</p>
              <p>{product.reorder_level}</p>
            </div>
          </CardContent>
        </Card>

        {/* Serial Numbers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Serial Numbers
              <span className="text-sm text-muted-foreground">
                {product.serials.length} total
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Add Serial */}
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Enter serial number"
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
                disabled={serialLimitReached}
              />
              <Button
                onClick={openAddModal}
                disabled={serialLimitReached}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {serialLimitReached && (
              <p className="text-xs text-red-600 mb-4">
                Serial limit reached. You cannot add more serials than the current stock.
              </p>
            )}

            {/* Grid Header */}
            <div className="grid grid-cols-4 gap-2 border-b p-4 text-sm font-semibold bg-gray-200 text-muted-foreground">
              <div>#</div>
              <div>Serial No.</div>
              <div>Available</div>
              <div className="text-right">Action</div>
            </div>

            {/* Scrollable Grid Body */}
            <div className="max-h-64 overflow-y-auto mt-2 space-y-1">
              {product.serials.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">
                  No serial numbers yet.
                </p>
              ) : (
                product.serials.map((s, idx) => (
                  <div
                    key={s.id}
                    className="grid grid-cols-4 gap-2 items-center border rounded px-2 py-2 text-sm"
                  >
                    <div>{++idx}</div>
                    <div className="font-mono">{s.serial_no}</div>

                    <div>
                      <span className="text-green-600 font-medium text-center">
                        Yes
                      </span>
                    </div>

                    <div className="text-right">
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => deleteSerial(s.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirm Add Serial */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={addSerial}
        title="Add Serial Number"
        description={`Are you sure you want to add serial number "${serialInput}"?`}
        confirmText="Add Serial"
        isLoading={isLoading}
      />
    </AuthenticatedLayout>
  );
}
