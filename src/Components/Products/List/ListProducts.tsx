import { useEffect, useState } from 'react';
import { Edit, Trash2, ChevronRight, ChevronsLeft, ChevronLeft, ChevronsRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProduct } from "../../../Context/ProductContext";
import type { Product } from '../../../Types/Product';
import { DeleteModal } from '../../Global/Components/DeleteModal';


export const ListProducts = () => {
  const { products, loading, error, totalProductCount, getAllProducts, deleteProdeuct } = useProduct();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    /**
     * Fetch products on component mount.
     * We use 'void' to explicitly signal that we're not awaiting this promise here.
     * The '.catch()' is added to prevent 'Uncaught in Promise' warnings in the console,
     * as the actual error state is managed globally within the ProductContext.
     */
    void getAllProducts(
      currentPage,
      rowsPerPage,
    ).catch(() => {
      console.error("Error fetching products. Check ProductContext for details.");
    });
  }, [getAllProducts, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(totalProductCount / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]); 

  const totalRows = totalProductCount;
  const currentProducts = products;

  const handleProductRowClick = (productId: number) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const canselDeleteProduct = () => {
    setProductToDelete(null);
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteProdeuct(productToDelete.id);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product. Check ProductContext for details.", error);
    } finally {
      setIsDeleting(false);
    }
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
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 text-[12px] sm:text-[14px] lg:text-[16px]">
            <tr>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Image
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Name
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Category
                </div>
              </th>
              {/* <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Slug
                </div>
              </th> */}
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Quantity
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Reserved
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Available
                </div>
              </th>
              {/* <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Stock Level
                </div>
              </th> */}
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Price
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Sizes
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Status
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Actions
                </div>
              </th>
            </tr>
          </thead>

          <tbody className='text-[12px] sm:text-[14px] lg:text-[16px]'>
            {loading && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                  Loading products...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-rose-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && currentProducts.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                  No products found.
                </td>
              </tr>
            )}

            {currentProducts.map((product) => {
              // const availableToSell = Math.max(0, product.variants.reduce((sum, variant) => sum + variant.quantity, 0) - product.variants.reduce((sum, variant) => sum + variant.reserved, 0));
              // const stockLevel = getStockLevel(product.currentPhysicalQuantity);
              const availableToSell = product.available;

              return (
                <tr
                  key={product.id}
                  onClick={() => handleProductRowClick(product.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleProductRowClick(product.id);
                    }
                  }}
                  tabIndex={0}
                  role="link"
                  className="cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                >
                  <td className="px-4 py-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full rounded object-cover" />
                      ) : (
                        '48 x 48'
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{product.name}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{product.category}</td>
                  {/* <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{product.sku}</td> */}
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{product.quantity}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{product.reserved}</td>
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
                      className={`rounded border px-3 py-1 text-xs ${product.isActive
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                        }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2" onClick={(event) => event.stopPropagation()}>
                      <Link
                        to={`edit/${product.id}`}
                        state={{ product }}
                        className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 cursor-pointer"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        type="button"
                        className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
                        onClick={() => setProductToDelete(product)}
                        title="Delete product"
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
        <div className="text-slate-500 text-[12px] sm:text-[14px] lg:text-[16px]">{rowsPerPage > totalRows ? totalRows : rowsPerPage} row(s)</div>

        <div className="flex items-center gap-6 text-[12px] sm:text-[14px] lg:text-[16px]">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 hidden sm:block">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border border-slate-200 bg-white px-3 py-1 text-slate-700"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 hidden sm:block">
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
                disabled={currentPage >= totalPages || totalRows === 0}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages || totalRows === 0}
                className="rounded border border-slate-200 bg-white p-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {productToDelete && (
        <DeleteModal
          type="product"
          name={productToDelete.name}
          canselFunction={canselDeleteProduct}
          handleDeleteProduct={handleDeleteProduct}
          isDeleting={isDeleting}
        />
      )}

    </div>
  );
};
