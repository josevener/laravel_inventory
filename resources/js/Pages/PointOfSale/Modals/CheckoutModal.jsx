import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { useState } from "react"

export default function CheckoutModal({ open, onClose, total, onConfirm }) {
  const [method, setMethod] = useState("cash")
  const [cash, setCash] = useState("")

  const change =
    method === "cash" && cash
      ? Math.max(0, parseFloat(cash) - total)
      : 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={method === "cash" ? "default" : "outline"}
              onClick={() => setMethod("cash")}
              className="flex-1"
            >
              Cash
            </Button>
            <Button
              variant={method === "card" ? "default" : "outline"}
              onClick={() => setMethod("card")}
              className="flex-1"
            >
              Card
            </Button>
          </div>

          {method === "cash" && (
            <div>
              <Label>Cash Received</Label>
              <Input
                type="number"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                placeholder="0.00"
              />
              <p className="text-sm mt-2">
                Change: <strong>₱{change.toFixed(2)}</strong>
              </p>
            </div>
          )}

          <Button
            size="lg"
            className="w-full"
            onClick={() => onConfirm({ method, cash })}
            disabled={method === "cash" && cash < total}
          >
            Confirm Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
