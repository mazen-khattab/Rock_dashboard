import { useState } from 'react';
import { Home, CreditCard as Edit, Trash2, ChevronRight, ChevronsLeft, ChevronLeft, ChevronsRight } from 'lucide-react';
import "./ListProducts.css";
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  sizes: string[];
  status: string;
  image_url?: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Classic White T-Shirt', category: 'Tops', price: 29.99, sizes: ['XS', 'S', 'M', 'L', 'XL'], status: 'Active' },
  { id: '2', name: 'Slim Fit Jeans', category: 'Bottoms', price: 59.99, sizes: ['S', 'M', 'L', 'XL', 'XXL'], status: 'Active' },
  { id: '3', name: 'Summer Floral Dress', category: 'Dresses', price: 79.99, sizes: ['XS', 'S', 'M', 'L'], status: 'Active' },
  { id: '4', name: 'Leather Jacket', category: 'Outerwear', price: 149.99, sizes: ['S', 'M', 'L', 'XL'], status: 'Active' },
  { id: '5', name: 'Gold Chain Necklace', category: 'Accessories', price: 34.99, sizes: ['XS'], status: 'Active' },
  { id: '6', name: 'Striped Long Sleeve Shirt', category: 'Tops', price: 44.99, sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], status: 'Active' },
  { id: '7', name: 'Cargo Pants', category: 'Bottoms', price: 69.99, sizes: ['S', 'M', 'L', 'XL'], status: 'Draft' },
  { id: '8', name: 'Evening Gown', category: 'Dresses', price: 199.99, sizes: ['XS', 'S', 'M', 'L'], status: 'Active' },
  { id: '9', name: 'Winter Wool Coat', category: 'Outerwear', price: 189.99, sizes: ['S', 'M', 'L', 'XL', 'XXL'], status: 'Active' },
  { id: '10', name: 'Silk Scarf', category: 'Accessories', price: 49.99, sizes: ['XS'], status: 'Active' },
  { id: '11', name: 'Casual Polo Shirt', category: 'Tops', price: 39.99, sizes: ['S', 'M', 'L', 'XL'], status: 'Active' },
  { id: '12', name: 'Denim Skirt', category: 'Bottoms', price: 54.99, sizes: ['XS', 'S', 'M', 'L'], status: 'Active' },
  { id: '13', name: 'Cocktail Dress', category: 'Dresses', price: 129.99, sizes: ['XS', 'S', 'M', 'L', 'XL'], status: 'Active' },
  { id: '14', name: 'Bomber Jacket', category: 'Outerwear', price: 119.99, sizes: ['M', 'L', 'XL'], status: 'Draft' },
  { id: '15', name: 'Leather Belt', category: 'Accessories', price: 29.99, sizes: ['S', 'M', 'L'], status: 'Active' },
];

export const ListProducts = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalRows = products.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const from = (currentPage - 1) * rowsPerPage;
  const currentProducts = products.slice(from, from + rowsPerPage);

  const handleDelete = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="min-h-screen rounded-3xl p-6 text-slate-800 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Products</h1>
        <Link to={'create'} className="flex items-center gap-2 rounded-lg bg-(--main-color) px-4 py-2 text-white transition-colors hover:bg-(--hover-color)">
          <span className="text-xl">+</span>
          <span>Create</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Image</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                <div className="flex items-center gap-1">
                  Name
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                <div className="flex items-center gap-1">
                  Category
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                <div className="flex items-center gap-1">
                  Price
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">Sizes</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                <div className="flex items-center gap-1">
                  Status
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full rounded object-cover" />
                    ) : (
                      '48 x 48'
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{product.name}</td>
                <td className="px-4 py-3 text-slate-500">{product.category}</td>
                <td className="px-4 py-3 text-slate-700">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded border px-3 py-1 text-xs ${product.status === 'Active'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 cursor-pointer">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-500">{totalRows} row(s)</div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
