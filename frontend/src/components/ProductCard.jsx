import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity: 1 }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image_url || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 mt-1">{product.category_name}</p>
        <p className="text-green-700 font-semibold mt-2">
          {product.price.toLocaleString()} RWF
        </p>
        <button
          onClick={addToCart}
          className="mt-3 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}