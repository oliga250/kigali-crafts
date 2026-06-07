import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate('/products')}
          className="mb-6 text-green-700 hover:underline"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden md:flex">
          <img
            src={product.image_url || '/placeholder.jpg'}
            alt={product.name}
            className="w-full md:w-1/2 h-96 object-cover"
          />

          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-sm text-gray-600 mt-2">{product.category_name}</p>
            <p className="text-2xl text-green-700 font-bold mt-4">
              {product.price.toLocaleString()} RWF
            </p>
            <p className="text-gray-700 mt-4">{product.description}</p>

            <div className="flex items-center mt-6">
              <span className="mr-4">Quantity:</span>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
              >
                -
              </button>
              <span className="px-4 py-1 bg-white border">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-6 w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}