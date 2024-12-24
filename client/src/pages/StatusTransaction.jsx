/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { clearTransactionState } from "../redux/slices/transactionsSlice.js";

const StatusTransactions = ({ status, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleTransactionState = () => {
    dispatch(clearTransactionState());
    onClose();
    navigate("/");
  };
  return (
    <div className="text-center">
      <h2
        className={`text-2xl font-bold mb-4 ${
          status === "APPROVED" ? "text-green-600" : "text-red-600"
        }`}
      >
        {status === "APPROVED" ? "Payment Successful!" : "Payment Failed"}
      </h2>
      <p className="text-gray-700 mb-6">
        {status === "APPROVED"
          ? "Thank you for your purchase! Your transaction was successful."
          : "Unfortunately, your transaction was declined. Please try again."}
      </p>
      <button
        onClick={handleTransactionState}
        className={`w-full px-4 py-2 rounded ${
          status === "APPROVED"
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        Close
      </button>
    </div>
  );
};

StatusTransactions.defaultProps = {
  status: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StatusTransactions;
