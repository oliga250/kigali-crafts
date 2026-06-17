import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Baskets', 'Jewelry', 'Wooden Crafts'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setError(null);
      const url = selectedCategory === 'All'
        ? '/products'
        : `/products?category=${selectedCategory}`;
      const res = await api.get(url);
      setProducts(res.data.slice(0, 6));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError(error.message || 'Failed to load products. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Discover Authentic Rwandan Crafts</h1>
          <p className="text-lg">Handmade with love by local artisans</p>
        </div>
      </div>

      {error ? (
        <div className="container mx-auto py-12 px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold">Unable to load products</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded ${
                  selectedCategory === category
                    ? 'bg-green-700 text-white'
                    : 'bg-white text-gray-700 border hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}