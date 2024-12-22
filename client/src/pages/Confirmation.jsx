/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Confirmation = ({ paymentSummary, productId, onConfirm }) => {
  const navigate = useNavigate();
  const totalAmount =
    paymentSummary.productAmount +
    paymentSummary.baseFee +
    paymentSummary.deliveryFee;
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null); // Guardar el resultado

  const handleConfirmPayment = async () => {
    setIsProcessing(false);

    try {
      const response = await new Promise((resolve, reject) => {
        // Simulación de pago con Wompi
        // Aquí se debería llamar a la API de Wompi
        // y obtener el resultado de la transacción
        setTimeout(() => resolve({ success: true }), 2000); // Simulando éxito en el pago
      });

      if (response.success) {
        setTransactionStatus("success");
        alert("Payment successful!");
        navigate(`/product/${productId}`, { replace: true });
      } else {
        setTransactionStatus("failed");
        alert("Payment failed. Please try again.");
        setTransactionStatus("error");
      }
    } catch (error) {
      setTransactionStatus("failed");
      alert("An error occurred during the transaction.");
    } finally {
      setIsProcessing(false);
      onConfirm();
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Product Amount:</span>
          <span>${paymentSummary.productAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Base Fee:</span>
          <span>${paymentSummary.baseFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee:</span>
          <span>${paymentSummary.deliveryFee.toFixed(2)}</span>
        </div>
        <hr />
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={handleConfirmPayment}
        className={`w-full py-3 mt-6 rounded-lg ${
          isProcessing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        } text-white focus:outline-none focus:ring-2 focus:ring-green-300`}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Confirm Payment"}
      </button>
    </div>
  );
};

Confirmation.propTypes = {
  paymentSummary: PropTypes.shape({
    productAmount: PropTypes.number.isRequired,
    baseFee: PropTypes.number.isRequired,
    deliveryFee: PropTypes.number.isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  productId: PropTypes.number.isRequired,
};

export default Confirmation;
