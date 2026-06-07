import { Link } from 'react-router-dom';

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Thank You for Your Order!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your order has been placed successfully. We will contact you soon.
        </p>
        <Link
          to="/products"
          className="inline-block bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}