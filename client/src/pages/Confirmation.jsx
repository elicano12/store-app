/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  createTransaction,
  fetchTransactionStatus,
} from "../redux/slices/transactionsSlice.js";

const Confirmation = ({
  paymentSummary,
  productId,
  onConfirm,
  installments,
}) => {
  const dispatch = useDispatch();
  const { status, transaction, loading, error } = useSelector(
    (state) => state.transaction
  );
  const [polling, setPolling] = useState(true);
  const [errorConfirmation, setErrorConfirmation] = useState(null);
  const totalAmount =
    paymentSummary.productAmount +
    paymentSummary.baseFee +
    paymentSummary.deliveryFee;

  useEffect(() => {
    if (polling && status === "PENDING") {
      const interval = setInterval(() => {
        dispatch(fetchTransactionStatus(transaction?.id));
      }, 5000);

      return () => clearInterval(interval);
    }
    if (status && status !== "PENDING") {
      onConfirm(status);
      setPolling(false);
    }
  }, [polling, status, dispatch, transaction?.id, onConfirm]);

  useEffect(() => {
    const errorWompiConfirmation = localStorage.getItem("wompiTokenCardError");
    setErrorConfirmation(errorWompiConfirmation);
  }, []);

  const handleConfirmPayment = async () => {
    dispatch(
      createTransaction({
        totalAmount: totalAmount,
        customerId: 1,
        productId: productId,
        installments: parseInt(installments),
        paymentMethod: "CARD",
        cardToken: localStorage.getItem("wompiTokenCard"),
        tokenValidation: localStorage.getItem("wompiTokenValidation"),
      })
    );
  };

  if (errorConfirmation) return <div>Error: {errorConfirmation}</div>;

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
          status === "PENDING"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        } text-white focus:outline-none focus:ring-2 focus:ring-green-300`}
        disabled={status}
      >
        Confirm Payment
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
  installments: PropTypes.number.isRequired,
};

export default Confirmation;
