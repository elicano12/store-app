import React, { useState } from 'react';
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-semibold mb-1">Card Number</label>
        <div className="flex items-center rounded">
          <CardBrandLogo cardNumber={formData.cardNumber} />
          <input
            type="text"
            name="cardNumber"
            maxLength="16"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-1">Card Holder</label>
        <input
          type="text"
          name="cardHolder"
          placeholder="John Doe"
          value={formData.cardHolder}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Expiration Date</label>
          <input
            type="text"
            name="expirationDate"
            maxLength="5"
            placeholder="MM/YY"
            value={formData.expirationDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">CVV</label>
          <input
            type="text"
            name="cvv"
            maxLength="3"
            placeholder="123"
            value={formData.cvv}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Pay Now
      </button>
    </form>
  );
};

export default PaymentForm;
