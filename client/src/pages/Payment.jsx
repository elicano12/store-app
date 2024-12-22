/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import PaymentForm from "../components/PaymentForm";

const Payment = () => {
  const { totalAmount } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePayment = async () => {
    // Aquí integras con la API de Wompi
    // Suponiendo que el pago es exitoso
    dispatch(clearCart());
    navigate("/confirmation");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>
      <p className="mb-4">Total to pay: ${totalAmount.toFixed(2)}</p>
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

export default Payment;
