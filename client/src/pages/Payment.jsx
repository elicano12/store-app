/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { clearCart } from "../redux/slices/cartSlice";
import PaymentForm from "../components/PaymentForm";
import wompiInstance from "../api/wompiApi";

const Payment = ({ onProceed }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const fetchTokenizedCard = async (data) => {
    setIsLoading(true);
    const dataBody = {
      number: data.cardNumber,
      cvc: data.cvv,
      exp_month: data.expirationDate.split("/")[0],
      exp_year: data.expirationDate.split("/")[1],
      card_holder: data.cardHolder,
    };
    try {
      const response = await wompiInstance.post("/tokens/cards", dataBody);
      if (response.data && response.data.data) {
        localStorage.setItem("wompiTokenCard", response.data.data.id);
      }
      onProceed(data);
    } catch (error) {
      console.error("API Error:", error.response || error.message);
      localStorage.setItem(
        "wompiTokenCardError",
        error.response || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (formData) => {
    fetchTokenizedCard(formData);
    dispatch(clearCart());
  };

  return (
    <div className="container mx-auto p-6">
      <PaymentForm onPayment={handlePayment} isLoading={isLoading} />
    </div>
  );
};

Payment.propTypes = {
  onProceed: PropTypes.func.isRequired,
};

export default Payment;
