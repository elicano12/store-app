/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@headlessui/react";

import Checkout from "../pages/Checkout";
import Payment from "../pages/Payment";
import Confirmation from "../pages/Confirmation";
import StatusTransactions from "../pages/StatusTransaction";
import { fetchProductById } from "../redux/slices/productSlice";
import { addItemToCart } from "../redux/slices/cartSlice";
const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    selectedProduct: product,
    loading,
    error,
  } = useSelector((state) => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [installments, setInstallments] = useState(1);
  const [transactionStatus, setTransactionStatus] = useState(null);

  const baseFee = 5000;
  const deliveryFee = 2000;

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleBuyNow = () => {
    dispatch(addItemToCart(product));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTransactionStatus(null);
    setStep(1);
    localStorage.clear();
  };

  const proceedToConfirmation = () => {
    setStep(2);
  };

  const proceedToPayment = (data) => {
    setInstallments(data.installments);
    setStep(3);
  };
  const handleTransactionFinal = (status) => {
    setTransactionStatus(status);
    setStep(4);
  };

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Imagen del producto */}
        <div className="flex-1">
          <img
            src={product.imageUrl || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full h-auto rounded-lg"
          />
        </div>
        {/* Detalles del producto */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-green-600 mb-6">
            ${product.price}
          </p>
          <p
            className={`text-xl font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            } mb-2`}
          >
            {product.stock > 0
              ? `Stock: ${product.stock} units`
              : "Out of stock"}
          </p>
          <button
            onClick={handleBuyNow}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
          >
            Pay with credit card
          </button>
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black bg-opacity-30" />
          <div className="relative bg-white rounded-lg max-w-md mx-auto p-6 shadow-lg">
            <Dialog.Panel className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
              <Dialog.Title className="text-lg font-bold mb-4">
                {step === 1
                  ? "Checkout"
                  : step === 2
                  ? "Payment"
                  : step === 3
                  ? "Payment Confirmation"
                  : "Transaction Status"}
              </Dialog.Title>
              {step === 1 && <Checkout onProceed={proceedToConfirmation} />}
              {step === 2 && <Payment onProceed={proceedToPayment} />}
              {step === 3 && (
                <Confirmation
                  paymentSummary={{
                    productAmount: product.price,
                    baseFee,
                    deliveryFee,
                  }}
                  productId={product.id}
                  onConfirm={handleTransactionFinal}
                  installments={installments}
                />
              )}
              {step === 4 && (
                <StatusTransactions
                  status={transactionStatus}
                  onClose={closeModal}
                />
              )}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
