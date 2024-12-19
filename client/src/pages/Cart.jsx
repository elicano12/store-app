import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeItemFromCart,
  updateItemQuantity,
} from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <button
          onClick={() => navigate('/')}
          className="text-blue-500 underline"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p>${item.price}</p>
          </div>
          <div className="flex items-center">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                dispatch(
                  updateItemQuantity({
                    productId: item.id,
                    quantity: Number(e.target.value),
                  })
                )
              }
              className="w-16 border rounded p-1 text-center"
            />
            <button
              onClick={() => dispatch(removeItemFromCart(item.id))}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="text-right">
        <p className="text-xl font-bold">Total: ${totalAmount.toFixed(2)}</p>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => navigate('/checkout')}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
