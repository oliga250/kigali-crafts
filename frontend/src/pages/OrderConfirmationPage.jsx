import { Link, useParams, useLocation } from 'react-router-dom';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();
  const paymentMethod = location.state?.paymentMethod || 'MTN_MOMO';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">Thank You for Your Order!</h1>
        <p className="text-lg text-gray-700 mb-2">Your Order ID: <strong>{id}</strong></p>
        <p className="text-gray-700 mb-2">Payment Method: <strong>{paymentMethod.replace('_', ' ')}</strong></p>
        <p className="text-gray-700 mb-4">Payment Status: <strong className="text-green-700">Paid ✅</strong></p>
        <p className="text-gray-700 mb-6">Estimated delivery: 2-3 business days</p>
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