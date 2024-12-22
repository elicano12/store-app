/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from "prop-types";
import CardBrandLogo from './CardBrandLogo';

const PaymentForm = ({ onPayment }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expirationDate: '',
    cvv: '',
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
      !formData.cvv
    ) {
      alert('Please fill in all fields.');
      return;
    }

    onPayment(formData);
  };

  return (
    <form onSubmit={handleSubmit} 
    className="w-full max-w-md mx-auto">
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
          <label className="block text-sm font-semibold mb-1">Expiration Date</label>
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
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 mt-10 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Pay Now
      </button>
    </form>
  );
};

PaymentForm.propTypes = {
  onPayment: PropTypes.func.isRequired,
};

export default PaymentForm;
