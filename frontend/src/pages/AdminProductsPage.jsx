import { useEffect, useState } from 'react';
import FloatingPrintButton from '../components/FloatingPrintButton';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
import { 
    FaBox, 
    FaSearch, 
    FaStore, 
    FaUser, 
    FaTag, 
    FaTrash, 
    FaImage,
    FaChevronLeft,
    FaChevronRight,
    FaExclamationTriangle
} from 'react-icons/fa';

const PRODUCTS_PER_PAGE = 10;

function AdminProductsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/products');
            setProducts(res.data || []);
        } catch (error) {
            console.error("Lỗi lấy danh sách sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const keyword = search.toLowerCase();
        const matchSearch =
            product.product_name?.toLowerCase().includes(keyword) ||
            product.brand?.toLowerCase().includes(keyword) ||
            product.station_name?.toLowerCase().includes(keyword) ||
            product.owner_name?.toLowerCase().includes(keyword);

        const matchStatus =
            statusFilter === '' || String(product.stock_status) === statusFilter;

        return matchSearch && matchStatus;
    });

    // Phân trang
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    const handleSearchChange = (val) => {
        setSearch(val);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (val) => {
        setStatusFilter(val);
        setCurrentPage(1);
    };

    const confirmDeleteProduct = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/admin/products/${productToDelete.product_id}`);
            setProductToDelete(null);
            loadProducts();
        } catch (error) {
            console.error(error);
            alert("Không thể xóa sản phẩm.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Component Thanh Phân Trang
    const PaginationBar = () => {
        if (totalPages <= 1) return null;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);

        return (
            <div className="flex items-center justify-center gap-2 mt-6">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-green-50 hover:border-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <FaChevronLeft size={13} className="text-gray-600" />
                </button>

                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-9 h-9 rounded-xl font-bold text-sm transition shadow-sm ${
                            currentPage === p
                                ? 'bg-green-600 text-white shadow-green-200 shadow-md'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-400'
                        }`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-green-50 hover:border-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <FaChevronRight size={13} className="text-gray-600" />
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-300 p-4 md:p-8 relative">
            <FloatingPrintButton title="In hoặc Xuất PDF danh sách sản phẩm" />

            {/* BUTTON QUAY LẠI */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 text-base font-semibold text-gray-700"
            >
                <IoChevronBack size={22} />
                Quay lại
            </button>

            <div className="max-w-7xl mx-auto space-y-6 mt-4">

                {/* PAGE TITLE BANNER */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 border border-green-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-green-800 flex items-center gap-3">
                            <span className="p-3 bg-purple-100 text-purple-700 rounded-2xl text-2xl">📦</span>
                            Quản Lý Sản Phẩm Hệ Thống
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Xem tất cả sản phẩm đăng bán tại các trạm Refill, kiểm tra tồn kho và quản lý xóa sản phẩm
                        </p>
                    </div>

                    <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-2xl font-bold text-sm border border-purple-200 flex items-center gap-2">
                        <FaBox /> Tổng số: {products.length} sản phẩm
                    </div>
                </div>

                {/* MAIN CONTENT CARD */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 space-y-6">

                    {/* BỘ LỌC TÌM KIẾM VÀ TRẠNG THÁI */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
                            <div className="relative w-full sm:w-80">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="🔍 Tìm theo tên sản phẩm, thương hiệu, trạm, chủ sở hữu..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition font-medium min-w-[160px] cursor-pointer"
                            >
                                <option value="">📦 Tất cả trạng thái</option>
                                <option value="true">🟢 Còn hàng</option>
                                <option value="false">🔴 Hết hàng</option>
                            </select>
                        </div>

                        <span className="text-sm font-semibold text-gray-500 shrink-0">
                            Hiển thị: <b className="text-green-700">{filteredProducts.length}</b> / {products.length} sản phẩm
                        </span>
                    </div>

                    {/* BẢNG SẢN PHẨM */}
                    {loading ? (
                        <div className="text-center py-16 text-gray-500">
                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            Đang tải danh sách sản phẩm...
                        </div>
                    ) : paginatedProducts.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <span className="text-5xl block mb-3">📦</span>
                            <p className="text-gray-700 font-bold text-lg">Chưa tìm thấy sản phẩm nào</p>
                            <p className="text-gray-500 text-xs mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bỏ lọc trạng thái</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-green-50 text-green-800 font-bold text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4">ID</th>
                                            <th className="p-4">Hình ảnh</th>
                                            <th className="p-4">Sản phẩm</th>
                                            <th className="p-4">Thương hiệu</th>
                                            <th className="p-4">Giá (100ml)</th>
                                            <th className="p-4">Chủ sở hữu</th>
                                            <th className="p-4">Trạm Refill</th>
                                            <th className="p-4">Trạng thái</th>
                                            <th className="p-4 text-center">Thao tác</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedProducts.map((product) => {
                                            const imgSrc = product.image_url
                                                ? product.image_url.startsWith('http')
                                                    ? product.image_url
                                                    : `http://localhost:5000${product.image_url}`
                                                : null;

                                            return (
                                                <tr key={product.product_id} className="hover:bg-green-50/50 transition">
                                                    <td className="p-4 font-mono font-bold text-gray-500">#{product.product_id}</td>
                                                    
                                                    {/* HÌNH ẢNH */}
                                                    <td className="p-4">
                                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                                                            {imgSrc ? (
                                                                <img src={imgSrc} alt={product.product_name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <FaImage className="text-gray-400" />
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="p-4 font-bold text-gray-800">{product.product_name}</td>
                                                    
                                                    <td className="p-4">
                                                        {product.brand ? (
                                                            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                                                                {product.brand}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">Khác</span>
                                                        )}
                                                    </td>

                                                    <td className="p-4 font-bold text-green-700">
                                                        {Number(product.price).toLocaleString('vi-VN')} VNĐ
                                                    </td>

                                                    <td className="p-4 text-gray-700 flex items-center gap-1.5 mt-4">
                                                        <FaUser className="text-blue-500 shrink-0 text-xs" />
                                                        <span>{product.owner_name || 'N/A'}</span>
                                                    </td>

                                                    <td className="p-4 text-gray-700">
                                                        <span className="flex items-center gap-1.5  font-medium">
                                                            <FaStore className="text-green-600 shrink-0" />
                                                            {product.station_name || 'Chưa chọn'}
                                                        </span>
                                                    </td>

                                                    {/* TRẠNG THÁI */}
                                                    <td className="p-4">
                                                        {product.stock_status ? (
                                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-extrabold text-xs border border-green-200 inline-block">
                                                                🟢 Còn hàng
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-extrabold text-xs border border-red-200 inline-block">
                                                                🔴 Hết hàng
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* THAO TÁC */}
                                                    <td className="p-4 text-center">
                                                        <button
                                                            onClick={() => setProductToDelete(product)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow transition flex items-center gap-1 mx-auto"
                                                        >
                                                            <FaTrash size={11} /> Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* PHÂN TRANG */}
                            <PaginationBar />

                            {totalPages > 1 && (
                                <p className="text-center text-xs text-gray-400 mt-2">
                                    Hiển thị {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–{Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} / {filteredProducts.length} sản phẩm
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* MODAL XÁC NHẬN XÓA SẢN PHẨM */}
            {productToDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 text-center space-y-5 border border-red-100">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                            <FaExclamationTriangle />
                        </div>

                        <div>
                            <h3 className="text-xl font-extrabold text-gray-800">Xác Nhận Xóa Sản Phẩm</h3>
                            <p className="text-gray-600 text-sm mt-2">
                                Bạn có chắc chắn muốn xóa sản phẩm <b className="text-gray-900 font-extrabold">"{productToDelete.product_name}"</b>?
                            </p>
                            <p className="text-red-500 text-xs font-semibold mt-1">
                                ⚠️ Hành động này sẽ xóa sản phẩm khỏi hệ thống và không thể hoàn tác!
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                onClick={() => setProductToDelete(null)}
                                disabled={isDeleting}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm transition flex-1 disabled:opacity-50"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={confirmDeleteProduct}
                                disabled={isDeleting}
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 transition flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang xóa...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash /> Xác nhận xóa
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProductsPage;