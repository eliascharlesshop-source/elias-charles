"use client"

export function CreditCardForm({ formData, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...formData, [name]: value })
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
        <div className="sm:col-span-2">
          <label htmlFor="cardNumber" className="block text-sm font-medium text-primary">
            Card number
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              value={formData.cardNumber || ""}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="cardName" className="block text-sm font-medium text-primary">
            Name on card
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="cardName"
              name="cardName"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              value={formData.cardName || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="cardExpiry" className="block text-sm font-medium text-primary">
            Expiration date (MM/YY)
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="cardExpiry"
              name="cardExpiry"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              value={formData.cardExpiry || ""}
              onChange={handleChange}
              placeholder="MM/YY"
            />
          </div>
        </div>

        <div>
          <label htmlFor="cardCvc" className="block text-sm font-medium text-primary">
            CVC
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="cardCvc"
              name="cardCvc"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              value={formData.cardCvc || ""}
              onChange={handleChange}
              placeholder="123"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
