/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PropTypes from "prop-types";
import CardBrandLogo from "./CardBrandLogo";

const PaymentForm = ({ onPayment, isLoading }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expirationDate: "",
    cvv: "",
    installments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.cardNumber ||
      !formData.cardHolder ||
      !formData.expirationDate ||
      !formData.cvv ||
      !formData.installments
    ) {
      alert("Please fill in all fields.");
      return;
    }
    onPayment(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div>
        <label className="block text-sm font-semibold mb-1">Card Number</label>
        <div className="flex items-center gap-4 p-2">
          <CardBrandLogo cardNumber={formData.cardNumber} />
          <input
            type="text"
            name="cardNumber"
            maxLength="16"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={handleChange}
            className="w-full border rounded-lg pl-2 focus:outline-none text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Card Holder</label>
        <input
          type="text"
          name="cardHolder"
          placeholder="John Doe"
          value={formData.cardHolder}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-1">
            Expiration Date
          </label>
          <input
            type="text"
            name="expirationDate"
            maxLength="5"
            placeholder="MM/YY"
            value={formData.expirationDate}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-1">CVV</label>
          <input
            type="text"
            name="cvv"
            maxLength="3"
            placeholder="123"
            value={formData.cvv}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-semibold mb-1">
          Number of Installments
        </label>
        <select
          name="installments"
          value={formData.installments}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Installments</option>
          <option value="1"> 1 </option>
          <option value="3"> 3 </option>
          <option value="6"> 6 </option>
          <option value="12"> 12 </option>
        </select>
      </div>
      <button
        type="submit"
        className={`w-full py-3 mt-6 rounded-lg ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        } text-white focus:outline-none focus:ring-2 focus:ring-green-300`}
        disabled={isLoading}
      >
        Pay Now
      </button>
    </form>
  );
};

PaymentForm.propTypes = {
  onPayment: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default PaymentForm;
