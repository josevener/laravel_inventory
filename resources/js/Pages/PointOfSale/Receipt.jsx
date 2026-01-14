export default function Receipt({ cart, total }) {
  return (
    <div className="text-sm font-mono">
      <h2 className="text-center font-bold mb-2">RECEIPT</h2>

      {cart.map((item) => (
        <div key={item.id} className="flex justify-between">
          <span>{item.qty} x {item.name}</span>
          <span>₱{(item.qty * item.price).toFixed(2)}</span>
        </div>
      ))}

      <hr className="my-2" />

      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>₱{total.toFixed(2)}</span>
      </div>
    </div>
  )
}
