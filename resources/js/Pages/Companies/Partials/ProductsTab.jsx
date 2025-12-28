import { useState, useMemo } from "react";
import { Package, Plus, Trash2 } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import ConfirmDialog from "@/Components/custom/ConfirmDialog";

export default function ProductsTab({
  products = [],
  newProducts = [],
  setNewProducts,
  isEditing,
}) {
  const [search, setSearch] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null); // track row to delete

  const filteredExisting = useMemo(() => {
    return products?.filter(
      (p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const addNewProduct = () => {
    if (!isEditing) return;
    setNewProducts([
      {
        tempId: Date.now(),
        sku: "",
        name: "",
        current_stock: "",
        selling_price: "",
      },
      ...newProducts,
    ]);
  };

  const updateNewProduct = (index, field, value) => {
    const updated = [...newProducts];
    updated[index] = { ...updated[index], [field]: value };
    setNewProducts(updated);
  };

  const confirmRemove = (index) => {
    setDeleteIndex(index);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex === null) return;
    setNewProducts(newProducts.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Package className="h-5 w-5" />
          Products
        </h2>

        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-72"
          />
          {isEditing && (
            <Button type="button" onClick={addNewProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Selling Price</TableHead>
              {isEditing && <TableHead className="w-10"></TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* New items – at the top */}
            {newProducts.map((np, index) => (
              <TableRow key={np.tempId} className="bg-muted/30">
                <TableCell>
                  <Input
                    value={np.sku || ""}
                    onChange={(e) => updateNewProduct(index, "sku", e.target.value)}
                    placeholder="Enter SKU"
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={np.name || ""}
                    onChange={(e) => updateNewProduct(index, "name", e.target.value)}
                    placeholder="Product name"
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={np.current_stock || ""}
                    onChange={(e) => updateNewProduct(index, "current_stock", e.target.value)}
                    placeholder="0"
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={np.selling_price || ""}
                    onChange={(e) => updateNewProduct(index, "selling_price", e.target.value)}
                    placeholder="0.00"
                    className="h-8"
                  />
                </TableCell>
                {isEditing && (
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmRemove(index)}
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {/* Existing items */}
            {filteredExisting?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono">{p.sku}</TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.current_stock}</TableCell>
                <TableCell>
                  ₱{Number(p.selling_price || 0).toLocaleString()}
                </TableCell>
                {isEditing && <TableCell />}
              </TableRow>
            ))}

            {filteredExisting.length === 0 && newProducts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isEditing ? 5 : 4}
                  className="text-center text-muted-foreground py-6"
                >
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => !open && setDeleteIndex(null)}
        title="Remove this product?"
        description="This will delete the unsaved new product entry. This action cannot be undone."
        confirmText="Remove"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
}