import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getImageUrl } from "../services/api";
import { IoChevronBack } from "react-icons/io5";
import useFavorite from "../hooks/useFavorite";
import { FaFilter, FaChevronDown } from "react-icons/fa";

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(false);

    const PRODUCTS_PER_PAGE = 15;
    const navigate = useNavigate();
    const { toggleFavorite, isFavorite } = useFavorite("products");

    const fetchCategories = async () => {
        try {
            const response = await api.get("/products/categories");
            if (Array.isArray(response.data) && response.data.length > 0) {
                setCategories(response.data);
            } else {
                const fallback = await api.get("/owner/categories").catch(() => null);
                if (fallback && Array.isArray(fallback.data) && fallback.data.length > 0) {
                    setCategories(fallback.data);
                } else {
                    setDefaultCategories();
                }
            }
        } catch (error) {
            console.error("Lỗi lấy danh mục sản phẩm:", error);
            setDefaultCategories();
        }
    };

    const setDefaultCategories = () => {
        setCategories([
            { category_id: 1, category_name: "Nước giặt" },
            { category_id: 2, category_name: "Nước rửa chén" },
            { category_id: 3, category_name: "Dầu gội" },
            { category_id: 4, category_name: "Sữa tắm" },
            { category_id: 5, category_name: "Nước lau nhà" },
            { category_id: 6, category_name: "Nước xả vải" },
        ]);
    };

    const fetchProducts = async (page = 1, keyword = "", categoryId = "all") => {
        setLoading(true);
        try {
            let url = `/products?page=${page}&limit=${PRODUCTS_PER_PAGE}&search=${encodeURIComponent(keyword)}`;
            if (categoryId && categoryId !== "all") {
                url += `&categoryId=${categoryId}`;
            }
            const response = await api.get(url);
            setProducts(response.data.data || []);
            setCurrentPage(response.data.page || 1);
            setTotalPages(response.data.totalPages || 1);
            setTotalProducts(response.data.total || 0);
        } catch (error) {
            console.error("Lỗi lấy sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts(currentPage, search, selectedCategory);
    }, [currentPage, selectedCategory]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        setCurrentPage(1);
        fetchProducts(1, value, selectedCategory);
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
        fetchProducts(1, search, categoryId);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);
        if (currentPage <= 4) {
            pages.push(2, 3, 4, 5, "...", totalPages);
            return pages;
        }

        if (currentPage >= totalPages - 3) {
            pages.push("...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            return pages;
        }

        pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
        return pages;
    };

    const activeCategoryObj = categories.find(c => String(c.category_id) === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-200 p-4 md:p-8 relative">
            {/* NÚT QUAY LẠI CHUẨN */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 text-base font-semibold text-gray-700 print:hidden cursor-pointer"
            >
                <IoChevronBack size={22} />
                Quay lại
            </button>

            {/* TOÀN BỘ TRANG SẢN PHẨM KHUNG CỐ ĐỊNH MAX-W-7XL */}
            <div className="max-w-7xl mx-auto space-y-6">

                {/* TIÊU ĐỀ CĂN GIỮA KHÔNG BỌC CARD */}
                <div className="flex items-center justify-center gap-3 my-6">
                    <span className="text-4xl md:text-5xl">📦</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-green-600">
                        Sản phẩm Refill
                    </h1>
                </div>

                {/* HÀNG Ô TÌM KIẾM CÙNG NÚT SỔ XUỐNG LỌC DANH MỤC */}
                <div className="relative w-full max-w-4xl mx-auto mb-8">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Ô TÌM KIẾM */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="🔍 Tìm tên sản phẩm refill..."
                                value={search}
                                onChange={handleSearch}
                                className="w-full p-2.5 pr-12 rounded-3xl bg-white/90 border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-base md:text-lg pl-6 font-medium text-gray-800"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setCurrentPage(1);
                                        fetchProducts(1, "", selectedCategory);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold flex items-center justify-center transition cursor-pointer"
                                    title="Xóa tìm kiếm"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* NÚT LỌC SỔ XUỐNG CÙNG HÀNG */}
                        <div className="relative shrink-0">
                            <div className={`flex items-center gap-2.5 px-4 py-3.5 rounded-3xl font-bold text-sm shadow-lg transition border cursor-pointer ${
                                selectedCategory !== 'all'
                                    ? 'bg-green-600 text-white border-green-600'
                                    : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-300'
                            }`}>
                                
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className={`bg-transparent outline-none font-extrabold text-sm cursor-pointer pr-1 appearance-none ${
                                        selectedCategory !== 'all' ? 'text-white' : 'text-green-700'
                                    }`}
                                >
                                    <option value="all" className="text-gray-800 font-bold bg-white">
                                        📦 Tất cả danh mục
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat.category_id} value={String(cat.category_id)} className="text-gray-800 font-bold bg-white">
                                            🌿 {cat.category_name}
                                        </option>
                                    ))}
                                </select>
                                <FaChevronDown size={12} className={selectedCategory !== 'all' ? 'text-white' : 'text-gray-500'} />
                            </div>
                        </div>
                    </div>

                    {/* HIỂN THỊ TAG DANH MỤC ĐANG LỌC (NẾU CÓ) */}
                    {selectedCategory !== 'all' && (
                        <div className="flex items-center gap-2 mt-3 pl-2">
                            <span className="text-xs font-semibold text-gray-500">Đang lọc theo:</span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 font-bold text-xs border border-green-200">
                                🌿 {activeCategoryObj?.category_name || 'Danh mục'}
                                <button
                                    onClick={() => handleCategoryChange('all')}
                                    className="hover:text-red-600 font-bold ml-1 cursor-pointer"
                                    title="Bỏ lọc danh mục"
                                >
                                    ✕
                                </button>
                            </span>
                        </div>
                    )}
                </div>

                {/* DANH SÁCH LƯỚI SẢN PHẨM KHUNG MAX-W-7XL */}
                {loading ? (
                    <div className="bg-white/90 rounded-3xl shadow-lg p-12 text-center max-w-7xl mx-auto border border-green-100">
                        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-600 font-bold text-base">Đang tải sản phẩm...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white/90 rounded-3xl shadow-lg p-12 text-center max-w-7xl mx-auto border border-green-100">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold text-gray-700">Không tìm thấy sản phẩm phù hợp</h2>
                        <p className="text-gray-500 mt-2">Hãy thử thay đổi danh mục hoặc từ khóa tìm kiếm.</p>
                        <button
                            onClick={() => {
                                setSearch("");
                                handleCategoryChange("all");
                            }}
                            className="mt-4 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs shadow transition cursor-pointer"
                        >
                            Xem tất cả sản phẩm
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
                        {products.map((product) => (
                            <div
                                key={product.product_id}
                                className="bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition duration-300 w-full max-w-[280px] mx-auto flex flex-col border border-green-100 group"
                            >
                                {/* IMAGE */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={getImageUrl(product.image_url)}
                                        alt={product.product_name}
                                        className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
                                    />

                                    {/* FAVORITE */}
                                    <button
                                        onClick={() => toggleFavorite(product.product_id)}
                                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-md rounded-full w-10 h-10 text-lg shadow-md hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer"
                                    >
                                        {isFavorite(product.product_id) ? "❤️" : "🤍"}
                                    </button>
                                </div>

                                {/* CONTENT */}
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[48px] group-hover:text-green-700 transition" title={product.product_name}>
                                        {product.product_name}
                                    </h3>

                                    <p className="text-gray-700 text-base mb-1.5 font-medium">
                                        💰 Giá từ: <b className="text-green-600 font-extrabold">{Number(product.min_price).toLocaleString()} đ</b>
                                    </p>

                                    <p className="text-gray-600 text-base mb-4">
                                        📍 Có tại: <b className="text-green-600 font-bold">{product.total_stations}</b> trạm refill
                                    </p>

                                    <button
                                        onClick={() => navigate(`/products/${encodeURIComponent(product.product_name)}`)}
                                        className="w-full bg-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition mt-auto cursor-pointer"
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex flex-wrap justify-center items-center gap-2 mt-10 mb-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-xl bg-white shadow-md font-bold text-xs text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 transition cursor-pointer"
                        >
                            ← Trước
                        </button>

                        {getPageNumbers().map((page, index) =>
                            page === "..." ? (
                                <span key={`dots-${index}`} className="px-2 py-2 text-gray-500 text-xs font-bold">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`min-w-[40px] px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                                        currentPage === page
                                            ? "bg-green-600 text-white shadow-md shadow-green-200"
                                            : "bg-white text-gray-700 hover:bg-green-50 shadow-sm"
                                    }`}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-xl bg-white shadow-md font-bold text-xs text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 transition cursor-pointer"
                        >
                            Sau →
                        </button>
                    </div>
                )}

                {totalPages > 1 && (
                    <p className="text-center text-xs text-gray-500 pb-4 font-semibold">
                        Trang <b className="text-green-700 font-extrabold">{currentPage}</b> / {totalPages}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ProductsPage;