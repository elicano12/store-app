/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Checkout = ({onProceed}) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    address: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onProceed();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={customerInfo.name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={customerInfo.email}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={customerInfo.address}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
      >
        Continue to Payment
      </button>
    </form>
  );
};

Checkout.propTypes = {
  onProceed: PropTypes.func.isRequired,
};

export default Checkout;
