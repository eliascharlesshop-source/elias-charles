"use client"

export function AddressForm({ formData, onChange, type = "shipping" }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...formData, [name]: value })
  }

  const prefix = type === "billing" ? "billing" : ""
  const addressField = `${prefix}${prefix ? "A" : "a"}ddress`
  const apartmentField = `${prefix}${prefix ? "A" : "a"}partment`
  const cityField = `${prefix}${prefix ? "C" : "c"}ity`
  const countryField = `${prefix}${prefix ? "C" : "c"}ountry`
  const stateField = `${prefix}${prefix ? "S" : "s"}tate`
  const postalCodeField = `${prefix}${prefix ? "P" : "p"}ostalCode`

  return (
    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
      {type === "shipping" && (
        <>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-primary">
              First name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                value={formData.firstName || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-primary">
              Last name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                value={formData.lastName || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </>
      )}

      <div className="sm:col-span-2">
        <label htmlFor={addressField} className="block text-sm font-medium text-primary">
          Address
        </label>
        <div className="mt-1">
          <input
            type="text"
            id={addressField}
            name={addressField}
            autoComplete={type === "shipping" ? "street-address" : "billing street-address"}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            value={formData[addressField] || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={apartmentField} className="block text-sm font-medium text-primary">
          Apartment, suite, etc.
        </label>
        <div className="mt-1">
          <input
            type="text"
            id={apartmentField}
            name={apartmentField}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            value={formData[apartmentField] || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor={cityField} className="block text-sm font-medium text-primary">
          City
        </label>
        <div className="mt-1">
          <input
            type="text"
            id={cityField}
            name={cityField}
            autoComplete={type === "shipping" ? "address-level2" : "billing address-level2"}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            value={formData[cityField] || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor={countryField} className="block text-sm font-medium text-primary">
          Country
        </label>
        <div className="mt-1">
          <select
            id={countryField}
            name={countryField}
            autoComplete={type === "shipping" ? "country-name" : "billing country-name"}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            value={formData[countryField] || "United States"}
            onChange={handleChange}
          >
            <option>United States</option>
            <option>Canada</option>
            <option>Mexico</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={stateField} className="block text-sm font-medium text-primary">
          State / Province
        </label>
        <div className="mt-1">
          <input
            type="text"
            id={stateField}
            name={stateField}
            autoComplete={type === "shipping" ? "address-level1" : "billing address-level1"}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            value={formData[stateField] || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor={postalCodeField} className="block text-sm font-medium text-primary">
          Postal code
        </label>
        <div className="mt-1">
          <input
            type="text"
            id={postalCodeField}
            name={postalCodeField}
            autoComplete={type === "shipping" ? "postal-code" : "billing postal-code"}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
            value={formData[postalCodeField] || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {type === "shipping" && (
        <div className="sm:col-span-2">
          <label htmlFor="phone" className="block text-sm font-medium text-primary">
            Phone
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="phone"
              name="phone"
              autoComplete="tel"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              value={formData.phone || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </div>
  )
}
