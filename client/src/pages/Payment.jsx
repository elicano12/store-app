/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { clearCart } from "../redux/slices/cartSlice";
import PaymentForm from "../components/PaymentForm";

const Payment = ({ onProceed }) => {
  const { totalAmount } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePayment = async () => {
    // Aquí integras con la API de Wompi
    // Suponiendo que el pago es exitoso
    dispatch(clearCart());
    onProceed();
    // navigate("/confirmation");
  };

  return (
    <div className="container mx-auto p-6">
      {/* <button
        onClick={handlePayment}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Pay Now
      </button> */}
      <PaymentForm onPayment={handlePayment} />
    </div>
  );
};

Payment.propTypes = {
  onProceed: PropTypes.func.isRequired,
};

export default Payment;
