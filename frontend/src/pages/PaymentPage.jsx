import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart, dispatch, cartTotal, cartCount } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({ phone: '', email: '', password: '' });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  useEffect(() => {
    const order = localStorage.getItem('pendingOrder');
    if (order) {
      setPendingOrder(JSON.parse(order));
    } else {
      navigate('/checkout');
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    if ((selectedPayment === 'MTN_MOMO' || selectedPayment === 'AIRTEL_MONEY') && !paymentDetails.phone) {
      alert('Please enter your phone number');
      return;
    }

    if (selectedPayment === 'PAYPAL' && (!paymentDetails.email || !paymentDetails.password)) {
      alert('Please enter PayPal email and password');
      return;
    }

    setProcessing(true);

    setTimeout(async () => {
      try {
        const res = await axios.post('https://kigali-crafts-backend.vercel.app/api/orders', {
          ...pendingOrder,
          payment_method: selectedPayment,
          payment_status: 'paid'
        });

        setSuccess(true);

        setTimeout(() => {
          dispatch({ type: 'CLEAR_CART' });
          localStorage.removeItem('pendingOrder');
          navigate(`/order-confirmation/${res.data.orderId}`, { state: { paymentMethod: selectedPayment } });
        }, 2000);
      } catch (error) {
        console.error(error);
        setProcessing(false);
      }
    }, 3000);
  };

  const paymentOptions = [
    {
      id: 'MTN_MOMO',
      title: 'MTN Mobile Money',
      description: 'Pay with your MTN MoMo account',
      bg: 'bg-yellow-400',
      requiresPhone: true
    },
    {
      id: 'AIRTEL_MONEY',
      title: 'Airtel Money',
      description: 'Pay with your Airtel Money account',
      bg: 'bg-red-500',
      requiresPhone: true,
      placeholder: '073XXXXXXX'
    },
    {
      id: 'PAYPAL',
      title: 'PayPal',
      description: 'Pay securely with PayPal',
      bg: 'bg-blue-600',
      requiresEmail: true
    }
  ];

  if (!pendingOrder) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Choose Payment Method</h1>
        <p className="text-center text-gray-600 mb-6">Total: <strong className="text-green-700">{cartTotal.toLocaleString()} RWF</strong></p>

        {processing && !success ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-700 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">Processing payment...</p>
          </div>
        ) : success ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
            <p className="text-gray-700">Your payment of {cartTotal.toLocaleString()} RWF has been received</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentOptions.map(option => (
              <div
                key={option.id}
                onClick={() => setSelectedPayment(option.id)}
                className={`p-6 rounded-lg shadow-md cursor-pointer transition-all relative ${
                  selectedPayment === option.id
                    ? 'ring-2 ring-green-700'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className={`${option.bg} text-white p-4 rounded-t-lg -m-6 mb-4`}>
                  <h3 className="font-bold text-xl">{option.title}</h3>
                  <p className="text-sm opacity-90">{option.description}</p>
                </div>

{selectedPayment === option.id && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700 absolute top-4 right-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}

                {selectedPayment === option.id && (
                  <div className="mt-4">
                    {option.requiresPhone && (
                      <input
                        type="tel"
                        placeholder={option.id === 'AIRTEL_MONEY' ? '073XXXXXXX' : '078XXXXXXX'}
                        value={paymentDetails.phone}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, phone: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
                      />
                    )}
                    {option.requiresEmail && (
                      <div className="space-y-2">
                        <input
                          type="email"
                          placeholder="PayPal email"
                          value={paymentDetails.email}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, email: e.target.value })}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={paymentDetails.password}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, password: e.target.value })}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedPayment}
                className="flex-1 bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
              >
                Pay {cartTotal.toLocaleString()} RWF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}