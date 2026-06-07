import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="bg-green-700 text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Kigali Crafts
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-green-200 transition">
            Home
          </Link>
          <Link to="/products" className="hover:text-green-200 transition">
            Products
          </Link>

          <Link to="/cart" className="relative hover:text-green-200 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4.47-7.245a1 1 0 00-.97-.755H5.58a1 1 0 00-.97 1.245L6 13M7 13l-1.35 2.7a1 1 0 00.2 1.1h11.35a1 1 0 00.2-1.1L17 13M7 13h10M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-green-700 rounded-full text-xs font-bold h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}