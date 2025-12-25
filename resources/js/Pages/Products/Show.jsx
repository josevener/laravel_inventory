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
  const safeRoute = useSafeRoute()
  
  const addSerial = () => {
    router.post(
      safeRoute("product-serials.store"),
      {
        product_id: product.id,
        serial_no: serialInput,
      },
      {
        onSuccess: () => {
          setSerialInput("");
          setConfirmOpen(false);
        },
      }
    );
  };

  const deleteSerial = (id) => {
    router.delete(safeRoute("product-serials.destroy", { product: id }));
  };

  const openAddModal = () => {
    if (!serialInput.trim()) return;

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
            <CardTitle>{product.name}</CardTitle>
            <p className="text-muted-foreground">SKU: {product.sku}</p>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p>{product.category.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Unit</p>
              <p>{product.unit.short_name}</p>
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
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Enter serial number"
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
              />
              <Button onClick={openAddModal}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {product.serials.length === 0 ? (
              <p className="text-muted-foreground text-sm">No serial numbers yet.</p>
            ) : (
              <ul className="space-y-2">
                {product.serials.map((s) => (
                  <li
                    key={s.id}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <span>{s.serial_no}</span>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteSerial(s.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirm Add Serial */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={addSerial}
        title="Add Serial Number"
        description={`Are you sure you want to add serial number "${serialInput}"?`}
        confirmText="Add Serial"
      />
    </AuthenticatedLayout>
  );
}
