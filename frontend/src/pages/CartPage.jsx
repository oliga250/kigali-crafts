import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, dispatch, cartTotal, cartCount } = useCart();

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <Link to="/products" className="text-green-700 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {cart.items.map(item => (
            <div key={item.id} className="flex items-center border-b py-4 last:border-b-0">
              <img
                src={item.image_url || '/placeholder.jpg'}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />

              <div className="flex-1 ml-4">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category_name}</p>
                <p className="text-green-700 font-semibold">
                  {item.price.toLocaleString()} RWF
                </p>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                >
                  -
                </button>
                <span className="px-4 py-1 bg-white border">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right mt-6 pt-4 border-t">
            <p className="text-xl font-bold text-gray-800">
              Total: {cartTotal.toLocaleString()} RWF
            </p>
          </div>
        </div>

        <div className="text-right">
          <Link
            to="/checkout"
            className="inline-block bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}