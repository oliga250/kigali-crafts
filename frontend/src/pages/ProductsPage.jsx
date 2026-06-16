import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Baskets', 'Jewelry', 'Wooden Crafts'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const url = selectedCategory === 'All'
        ? '/products'
        : `/products?category=${selectedCategory}`;
      const res = await api.get(url);
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Our Products</h1>
        <p className="text-gray-600 mb-4">Total: {products.length} products</p>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}