import { useState } from 'react';
import { Edit, Trash2, ChevronRight, ChevronsLeft, ChevronLeft, ChevronsRight } from 'lucide-react';
import "./ListProducts.css";
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS, type Product } from "../../../Types/Product";

// const getStockLevel = (quantity: number): StockLevel => {
//   if (quantity === 0) {
//     return 'Out of Stock';
//   }

//   if (quantity < 5) {
//     return 'Low Stock';
//   }

//   return 'In Stock';
// };

// const stockLevelClassName: Record<StockLevel, string> = {
//   'In Stock': 'border-emerald-200 bg-emerald-50 text-emerald-700',
//   'Low Stock': 'border-amber-200 bg-amber-50 text-amber-700',
//   'Out of Stock': 'border-rose-200 bg-rose-50 text-rose-700',
// };

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
          <span>New Product</span>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-max w-full table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Image
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Name
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Category
                </div>
              </th>
              {/* <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Slug
                </div>
              </th> */}
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Quantity
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Reserved
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Available
                </div>
              </th>
              {/* <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Stock Level
                </div>
              </th> */}
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Price
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Sizes
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Status
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Actions
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {currentProducts.map((product) => {
              const availableToSell = Math.max(0, product.currentPhysicalQuantity - product.reservedQuantity);
              // const stockLevel = getStockLevel(product.currentPhysicalQuantity);

              return (
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
                  <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{product.name}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{product.category}</td>
                  {/* <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{product.sku}</td> */}
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{product.currentPhysicalQuantity}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{product.reservedQuantity}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">{availableToSell}</td>
                  {/* <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`rounded border px-3 py-1 text-xs ${stockLevelClassName[stockLevel]}`}>
                      {stockLevel}
                    </span>
                  </td> */}
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">${product.price.toFixed(2)}</td>
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
                      <Link
                        to={`edit/${product.id}`}
                        state={{ product }}
                        className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 cursor-pointer"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
