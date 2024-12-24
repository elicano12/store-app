/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import wompiInstance from "../api/wompiApi";

const wompiApiKey = import.meta.env.VITE_APP_WOMPI_PUBLIC_KEY;

const Checkout = ({ onProceed }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [termsLink, setTermsLink] = useState("");
  const [peronalLink, setPersonalLink] = useState("");
  const [isDataAuthorized, setIsDataAuthorized] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const isFormComplete =
    customerInfo.name.trim() &&
    customerInfo.email.trim() &&
    customerInfo.address.trim() &&
    isDataAuthorized &&
    isTermsAccepted;

  const fetchWompiAcceptance = async () => {
    try {
      const response = await wompiInstance.get(`/merchants/${
          wompiApiKey
        }`)
      
      if (response.data && response.data.data) {
        setTermsLink(
          response.data.data.presigned_acceptance.permalink
        );
        setPersonalLink(
          response.data.data.presigned_personal_data_auth.permalink
        );
        localStorage.setItem('wompiTokenValidation', JSON.stringify(response.data.data.presigned_acceptance.acceptance_token));
      }
    } catch (error) {
      console.error("API Error:", error.response || error.message);
    }
  };

  useEffect(() => {
    fetchWompiAcceptance();
  }, [onProceed]);

  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isDataAuthorized || !isTermsAccepted) {
      alert('Please confirm that you authorize data handling and accept the terms.');
      return;
    }
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
      <div className="mb-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            checked={isDataAuthorized}
            onChange={(e) => setIsDataAuthorized(e.target.checked)}
          />
          <span className="text-gray-700">
            I authorize the handling of my personal data. Read our{' '}
            <a
              href={peronalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Privacy Policy
            </a>
            .
          </span>
        </label>
      </div>

      {/* Checkbox 2 */}
      <div className="mb-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            checked={isTermsAccepted}
            onChange={(e) => setIsTermsAccepted(e.target.checked)}
          />
          <span className="text-gray-700">
            I accept the{' '}
            <a
              href={termsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Terms and Conditions
            </a>
            .
          </span>
        </label>
      </div>
      <button
         type="submit"
         disabled={!isFormComplete}
         className={`px-6 py-2 rounded ${
           isFormComplete
             ? 'bg-green-500 text-white hover:bg-green-600'
             : 'bg-gray-400 text-gray-700 cursor-not-allowed'
         }`}
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
