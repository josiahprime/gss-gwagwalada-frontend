'use client'
import { useState } from "react";
import { CartItem } from "store/cart/cartTypes";
 import { SingleValue, ActionMeta, MultiValue } from "react-select";
import { useOrderStore } from "store/order/useOrderStore";
import toast from "react-hot-toast";
import ClientSelect, { ClientSelectOption } from "./ShippingForm/ClientSelect";
import { statesWithLGAs } from "utils/nigeriaRegions";
import { Truck, MapPin, User, Mail, Phone, Home, Package, Loader } from "lucide-react";

interface ShippingFormProps {
  formData: Record<FormField, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onNext: () => void;
  deliveryType: "home" | "pickup";
  setDeliveryType: React.Dispatch<React.SetStateAction<"home" | "pickup">>;
  cartItems: CartItem[]; // ✅ Add this
  setCalculationDone: React.Dispatch<React.SetStateAction<boolean>>;
  previewOrder: (cartItems: CartItem[], userAddress: { state: string; city: string }, deliveryType: string) => Promise<PreviewOrderResponse>; // ✅ Add this
}

interface PreviewOrderResponse {
  total: number;
  shippingFee: number;
  estimatedDelivery?: string;
  // add other fields your API returns
}


interface SelectOption {
  value: string;
  label: string;
  lgas?: { value: string; label: string }[];
}





export type FormField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "state"
  | "city"
  | "address"
  | "landmark"
  | "postalCode"
  | "extraInstructions"
  | "pickupStation";

const pickupStations = [
  "Behind Forest Hotel Chukuku Village, Along Kuje Road FCT, Abuja, Nigeria",
];



const ShippingForm = ({ formData, handleChange, onNext, deliveryType, setDeliveryType,  cartItems, previewOrder,setCalculationDone}: ShippingFormProps) => {
  const [selectedPickupStation, setSelectedPickupStation] = useState("");
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [selectedLGA, setSelectedLGA] = useState<{ value: string; label: string } | null>(null);
  const loading = useOrderStore((state) => state.loading);

  
 

  const handleStateChange = (
    option: SingleValue<ClientSelectOption> | MultiValue<ClientSelectOption>,
    _: ActionMeta<ClientSelectOption>
  ) => {
    const selected = Array.isArray(option) ? option[0] : option; // handle both cases safely
    setSelectedState(selected || null);
    setSelectedLGA(null);
    handleChange({
      target: {
        name: "state",
        value: selected?.value || "",
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // same pattern for LGA
  const handleLGAChange = (
    option: SingleValue<ClientSelectOption> | MultiValue<ClientSelectOption>,
    _: ActionMeta<ClientSelectOption>
  ) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setSelectedLGA(selected || null);
    handleChange({
      target: {
        name: "city",
        value: selected?.value || "",
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      firstName, lastName, email, phone,
      address, state, city, pickupStation
    } = formData;

    if (deliveryType === "home") {
      if (!firstName || !lastName || !email || !phone || !address || !state || !city) {
        toast.error("Please fill in all required home delivery fields");
        return;
      }

      try {
        await previewOrder(cartItems, { state, city }, deliveryType);
        toast.success("Order calculated successfully");
        setCalculationDone(true); // ✅ unlock payment step
        onNext(); // proceed to payment step
      } catch (error) {
        console.error(error)
        toast.error("Failed to calculate order. Please try again.");
      }
    } else if (deliveryType === "pickup") {
      if (!pickupStation || !phone) {
        toast.error("Please select a pickup station and enter your phone number");
        return;
      }

      try {
        await previewOrder(cartItems, { state, city }, deliveryType);
        setCalculationDone(true); // ✅ unlock payment step
        onNext();
      } catch (error) {
        console.error(error)
        toast.error("Failed to calculate order. Please try again.");
      }
    }
  };


  console.log(formData)

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl border border-white/20">
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-3 rounded-2xl">
          <Truck className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
          <p className="text-gray-600">Please provide your delivery details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* NAME FIELDS */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: "firstName", label: "First Name", icon: User },
            { name: "lastName", label: "Last Name", icon: User }
          ].map((field) => (
            <div key={field.name} className="group">
              <label className="block text-sm font-semibold text-green-600 mb-2">{field.label}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <field.icon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name as FormField]}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 border border-green-300 rounded-xl bg-green-100 focus:outline-none focus:ring-2 focus:border-green-600 focus:ring-green-100"
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* CONTACT FIELDS */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: "email", label: "Email Address", type: "email", icon: Mail },
            { name: "phone", label: "Phone Number", type: "tel", icon: Phone }
          ].map((field) => (
            <div key={field.name} className="group">
              <label className="block text-sm font-semibold text-green-600 mb-2">{field.label}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <field.icon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as FormField]}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 border border-green-300 rounded-xl bg-green-100 focus:outline-none focus:ring-2 focus:border-green-600 focus:ring-green-100"
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
              </div>
            </div>
          ))}
        </div>

        
        {/* DELIVERY METHOD */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Delivery Method</label>

          {/* HOME OPTION */}
          <label className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
            deliveryType === "home" ? "border-green-600 bg-green-100" : "border-gray-200 hover:border-gray-300"
          }`}>
            <input
              type="radio"
              name="deliveryType"
              value="home"
              checked={deliveryType === "home"}
              onChange={() => setDeliveryType("home")}
              className="form-radio text-green-600 focus:ring-green-500 w-5 h-5"
            />
            <div className="flex items-center space-x-3">
              <Home className="w-5 h-5 text-green-600" />
              <div>
                <span className="font-medium text-gray-900">Home Delivery</span>
                <p className="text-sm text-gray-600">Deliver to your address</p>
              </div>
            </div>
          </label>

          {/* STATE & CITY */}
          {/* State Select */}
          {deliveryType === "home" && (
          <div>
            <div>
              <label className="block text-sm font-semibold text-green-600 mb-2">
                State
              </label>
              <ClientSelect
                isSearchable={false}
                options={statesWithLGAs}
                value={selectedState}
                onChange={handleStateChange}
                placeholder="Select State"
                className="text-left"
                classNames={{
                  control: () => "rounded-xl border-green-300 bg-green-100 py-2 px-2"
                }}
              />
            </div>

            {/* LGA Select */}
            <div>
              <label className="block text-sm font-semibold text-green-600 mb-2">
                City / LGA
              </label>
              <ClientSelect
                isSearchable={false}
                options={selectedState?.lgas || []}
                value={selectedLGA}
                onChange={handleLGAChange}
                placeholder={
                  selectedState ? "Select City / LGA" : "Select a state first"
                }
                isDisabled={!selectedState}
                className="text-left"
                classNames={{
                  control: () => "rounded-xl border-green-300 bg-green-100 py-2 px-2"
                }}
              />
            </div>


            {/* ADDRESS DETAILS */}
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div className="group">
                <label className="block text-sm font-semibold text-green-600 mb-2">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full py-4 px-4 border border-green-300 rounded-xl bg-green-100 focus:outline-none focus:ring-2 focus:border-green-600 focus:ring-green-100"
                  placeholder="e.g. No 10, Alaba Street"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-green-600 mb-2">Landmark (optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full py-4 px-4 border border-green-300 rounded-xl bg-green-100 focus:outline-none focus:ring-2 focus:border-green-600 focus:ring-green-100"
                  placeholder="e.g. Opposite GTBank, near market"
                />
              </div>
            </div>

            {/* POSTAL & INSTRUCTIONS */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code (optional)"
                className="w-full py-4 px-4 border border-green-300 rounded-xl bg-green-100 focus:outline-none focus:ring-2 focus:border-green-600 focus:ring-green-100"
              />
              <textarea
                name="extraInstructions"
                value={formData.extraInstructions}
                onChange={handleChange}
                rows={2}
                placeholder="Any extra instructions? (e.g., call before delivery)"
                className="w-full py-4 px-4 border border-green-300 rounded-xl bg-green-100 focus:outline-none focus:ring-2 focus:border-green-600 focus:ring-green-100"
              />
            </div>
          </div>)}


          {/* PICKUP OPTION */}
          <label className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
            deliveryType === "pickup" ? "border-green-600 bg-green-100" : "border-gray-200 hover:border-gray-300"
          }`}>
            <input
              type="radio"
              name="deliveryType"
              value="pickup"
              checked={deliveryType === "pickup"}
              onChange={() => setDeliveryType("pickup")}
              className="form-radio text-green-600 focus:ring-green-500 w-5 h-5"
            />
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-green-600" />
              <div>
                <span className="font-medium text-gray-900">Pickup Station</span>
                <p className="text-sm text-gray-600">Collect from a local hub</p>
              </div>
            </div>
          </label>
        </div>

        {/* PICKUP STATION LIST */}
        {deliveryType === "pickup" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Pickup Station</label>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {pickupStations.map((station) => (
                <div
                  key={station}
                  onClick={() => {
                    setSelectedPickupStation(station);
                    handleChange({ target: { name: "pickupStation", value: station } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPickupStation === station
                      ? "border-green-600 bg-green-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedPickupStation === station
                        ? "border-green-600 bg-green-100"
                        : "border-gray-300"
                    }`}>
                      {selectedPickupStation === station && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                    </div>
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{station}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMIT */}
        <div className="pt-6">
          <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold 
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-[1.02]'}
            transition-all duration-200 flex items-center justify-center space-x-2`}
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Calculating...</span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;
