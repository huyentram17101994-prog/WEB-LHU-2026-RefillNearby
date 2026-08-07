import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import FloatingPrintButton from '../components/FloatingPrintButton';
import AdminSidebar from '../components/AdminSidebar';
import {
    FaBox,
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaTimes,
    FaCheck,
    FaImage,
    FaStore,
    FaTag,
    FaChevronLeft,
    FaChevronRight,
    FaExclamationTriangle,
    FaPrint,
    FaBars
} from 'react-icons/fa';

const ITEMS_PER_PAGE = 12;

const emptyForm = {
    station_id: '',
    category_id: '',
    product_name: '',
    brand: '',
    price: '',
    stock_status: '',
    description: '',
    image_url: '',
};

function OwnerProductsPage() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [stations, setStations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [searchProduct, setSearchProduct] = useState('');
    const [stockFilter, setStockFilter] = useState('all');
    const [stationFilter, setStationFilter] = useState('all');

    const [showForm, setShowForm] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [productImageFile, setProductImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [productForm, setProductForm] = useState(emptyForm);

    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeletingProduct, setIsDeletingProduct] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [productRes, stationRes, categoryRes] = await Promise.all([
                api.get('/owner/products'),
                api.get('/owner/my-stations'),
                api.get('/owner/categories'),
            ]);
            setProducts(productRes.data || []);
            setStations(stationRes.data || []);
            setCategories(categoryRes.data || []);
        } catch (error) {
            console.error('Lỗi tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    // ========================
    // LỌC SẢN PHẨM
    // ========================
    const filteredProducts = products.filter((p) => {
        const keyword = searchProduct.toLowerCase();
        const matchSearch =
            p.product_name?.toLowerCase().includes(keyword) ||
            p.station_name?.toLowerCase().includes(keyword) ||
            p.brand?.toLowerCase().includes(keyword);

        const matchStock =
            stockFilter === 'all'
                ? true
                : stockFilter === '1'
                ? p.stock_status === true
                : p.stock_status === false;

        const matchStation =
            stationFilter === 'all'
                ? true
                : String(p.station_id) === stationFilter;

        return matchSearch && matchStock && matchStation;
    });

    // Reset trang khi filter thay đổi
    const handleSearchChange = (val) => {
        setSearchProduct(val);
        setCurrentPage(1);
    };
    const handleStockFilterChange = (val) => {
        setStockFilter(val);
        setCurrentPage(1);
    };
    const handleStationFilterChange = (val) => {
        setStationFilter(val);
        setCurrentPage(1);
    };

    // ========================
    // PHÂN TRANG
    // ========================
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // ========================
    // FORM HELPERS
    // ========================
    const resetForm = () => {
        setEditingProductId(null);
        setProductImageFile(null);
        setPreviewImage('');
        setProductForm(emptyForm);
    };

    const openAddForm = () => {
        resetForm();
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Chỉ được chọn tệp hình ảnh');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Hình ảnh không được vượt quá 5MB');
            return;
        }
        setProductImageFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    // ========================
    // CRUD
    // ========================
    const createProduct = async (e) => {
        e.preventDefault();
        if (!productForm.product_name.trim()) {
            alert('Vui lòng nhập tên sản phẩm');
            return;
        }
        setSubmitting(true);
        try {
            let imageUrl = '';
            if (productImageFile) {
                const formData = new FormData();
                formData.append('image', productImageFile);
                const uploadRes = await api.post('/owner/upload-product-image', formData);
                imageUrl = uploadRes.data.image_url;
            }
            await api.post('/owner/products', { ...productForm, image_url: imageUrl });
            alert('✨ Thêm sản phẩm thành công!');
            resetForm();
            setShowForm(false);
            loadData();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Không thể thêm sản phẩm');
        } finally {
            setSubmitting(false);
        }
    };

    const editProduct = (product) => {
        setProductImageFile(null);
        setPreviewImage(
            product.image_url
                ? product.image_url.startsWith('http')
                    ? product.image_url
                    : `http://localhost:5000${product.image_url}`
                : ''
        );
        setProductForm({
            station_id: product.station_id || '',
            category_id: product.category_id || '',
            product_name: product.product_name || '',
            brand: product.brand || '',
            price: product.price || '',
            stock_status: product.stock_status ? '1' : '0',
            description: product.description || '',
            image_url: product.image_url || '',
        });
        setEditingProductId(product.product_id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const updateProduct = async (e) => {
        e.preventDefault();
        if (!productForm.product_name.trim()) {
            alert('Vui lòng nhập tên sản phẩm');
            return;
        }
        setSubmitting(true);
        try {
            let imageUrl = productForm.image_url;
            if (productImageFile) {
                const formData = new FormData();
                formData.append('image', productImageFile);
                const uploadRes = await api.post('/owner/upload-product-image', formData);
                imageUrl = uploadRes.data.image_url;
            }
            await api.put(`/owner/products/${editingProductId}`, {
                ...productForm,
                image_url: imageUrl,
            });
            alert('✅ Cập nhật sản phẩm thành công!');
            resetForm();
            setShowForm(false);
            loadData();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Không thể cập nhật sản phẩm');
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDeleteProduct = async () => {
        if (!productToDelete) return;
        setIsDeletingProduct(true);
        try {
            await api.delete(`/owner/products/${productToDelete.product_id}`);
            setProductToDelete(null);
            loadData();
        } catch (error) {
            console.error(error);
            alert('Không thể xóa sản phẩm');
        } finally {
            setIsDeletingProduct(false);
        }
    };

    const toggleProductStatus = async (productId) => {
        try {
            await api.put(`/owner/products/${productId}/toggle-status`);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    // ========================
    // PAGINATION COMPONENT
    // ========================
    const PaginationBar = () => {
        if (totalPages <= 1) return null;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return (
            <div className="flex items-center justify-center gap-2 mt-8 print:hidden">
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

    const handlePrint = () => {
        window.print();
    };

    // ========================
    // RENDER
    // ========================
    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 flex">
            <AdminSidebar 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 lg:ml-72 min-w-0 flex flex-col min-h-screen">
                <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">

                {/* PAGE TITLE BANNER */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition shrink-0"
                            title="Mở menu quản trị"
                        >
                            <FaBars size={18} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                                <span className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl text-xl">📦</span>
                                Quản Lý Sản Phẩm
                            </h1>
                            <p className="text-slate-500 text-xs md:text-sm mt-1">
                                Thêm mới, chỉnh sửa thông tin, giá cả và hình ảnh sản phẩm tại các trạm Refill
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl font-bold text-sm border border-emerald-200">
                            Tổng số: {products.length} sản phẩm
                        </div>
                    </div>
                </div>

                {/* FORM THÊM / SỬA SẢN PHẨM */}
                {showForm && (
                    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-green-200 animate-fadeIn">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                {editingProductId ? (
                                    <><FaEdit className="text-amber-500" /> Cập Nhật Sản Phẩm</>
                                ) : (
                                    <><FaPlus className="text-green-600" /> Thêm Sản Phẩm Mới</>
                                )}
                            </h2>
                            <button
                                type="button"
                                onClick={() => { resetForm(); setShowForm(false); }}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        <form onSubmit={editingProductId ? updateProduct : createProduct} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* CHỌN TRẠM */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2 text-sm flex items-center gap-1.5">
                                        <FaStore className="text-blue-500" /> Trạm Refill <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        value={productForm.station_id}
                                        onChange={(e) => setProductForm({ ...productForm, station_id: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition bg-white"
                                    >
                                        <option value="">Chọn trạm</option>
                                        {stations.map((s) => (
                                            <option key={s.station_id} value={s.station_id}>{s.station_name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* DANH MỤC */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2 text-sm flex items-center gap-1.5">
                                        <FaTag className="text-purple-500" /> Danh mục <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        value={productForm.category_id}
                                        onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition bg-white"
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((c) => (
                                            <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* TÊN SẢN PHẨM */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                        Tên sản phẩm <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ví dụ: Dầu gội chiết chai 250ml"
                                        value={productForm.product_name}
                                        onChange={(e) => setProductForm({ ...productForm, product_name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
                                    />
                                </div>

                                {/* THƯƠNG HIỆU */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                        Thương hiệu
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Dove, Clear, Sunsilk..."
                                        value={productForm.brand}
                                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
                                    />
                                </div>

                                {/* GIÁ */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                        Giá (VNĐ/lít) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        placeholder="Ví dụ: 15000"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
                                    />
                                </div>

                                {/* TRẠNG THÁI KHO */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                        Trạng thái kho <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        value={productForm.stock_status}
                                        onChange={(e) => setProductForm({ ...productForm, stock_status: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition bg-white"
                                    >
                                        <option value="">Chọn trạng thái</option>
                                        <option value="1">🟢 Còn hàng</option>
                                        <option value="0">🔴 Hết hàng</option>
                                    </select>
                                </div>

                                {/* MÔ TẢ */}
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                        Mô tả sản phẩm
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Mô tả thành phần, công dụng, hướng dẫn sử dụng..."
                                        value={productForm.description}
                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none transition"
                                    />
                                </div>

                                {/* UPLOAD HÌNH ẢNH */}
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-semibold mb-2 text-sm flex items-center gap-1.5">
                                        <FaImage className="text-green-600" /> Hình ảnh sản phẩm
                                    </label>
                                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center shrink-0 border border-gray-300 shadow-inner">
                                            {previewImage ? (
                                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center text-gray-400 p-2">
                                                    <FaImage size={28} className="mx-auto mb-1 opacity-50" />
                                                    <span className="text-xs">Chưa có ảnh</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer"
                                            />
                                            <p className="text-xs text-gray-400">Định dạng hỗ trợ: JPG, PNG, WEBP. Dung lượng tối đa 5MB.</p>
                                            {productImageFile && (
                                                <p className="text-xs text-green-600 font-semibold">📷 {productImageFile.name}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => { resetForm(); setShowForm(false); }}
                                    disabled={submitting}
                                    className="px-6 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition cursor-pointer"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-8 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>⏳ Đang xử lý...</>
                                    ) : editingProductId ? (
                                        <><FaCheck /> Cập Nhật Sản Phẩm</>
                                    ) : (
                                        <><FaPlus /> Thêm Sản Phẩm</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* DANH SÁCH SẢN PHẨM */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">

                    {/* HEADER: tiêu đề + bộ lọc + nút thêm */}
                    <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <span>📦</span> Danh Sách Sản Phẩm ({filteredProducts.length})
                            </h2>
                            <button
                                onClick={openAddForm}
                                className="px-5 py-2.5 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm bg-green-600 text-white hover:bg-green-700 whitespace-nowrap"
                            >
                                <FaPlus /> Thêm Sản Phẩm Mới
                            </button>
                        </div>

                        {/* BỘ LỌC */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Tìm kiếm */}
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm theo tên sản phẩm, thương hiệu, trạm..."
                                    value={searchProduct}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition"
                                />
                            </div>

                            {/* Lọc trạm */}
                            <select
                                value={stationFilter}
                                onChange={(e) => handleStationFilterChange(e.target.value)}
                                className="px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition min-w-[160px]"
                            >
                                <option value="all">🏪 Tất cả trạm</option>
                                {stations.map((s) => (
                                    <option key={s.station_id} value={String(s.station_id)}>{s.station_name}</option>
                                ))}
                            </select>

                            {/* Lọc tồn kho */}
                            <select
                                value={stockFilter}
                                onChange={(e) => handleStockFilterChange(e.target.value)}
                                className="px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition min-w-[130px]"
                            >
                                <option value="all">📦 Tất cả</option>
                                <option value="1">🟢 Còn hàng</option>
                                <option value="0">🔴 Hết hàng</option>
                            </select>
                        </div>
                    </div>

                    {/* NỘI DUNG */}
                    {loading ? (
                        <div className="text-center py-16 text-gray-500">
                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            Đang tải danh sách sản phẩm...
                        </div>
                    ) : paginatedProducts.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <span className="text-5xl block mb-3">📦</span>
                            <p className="text-gray-700 font-bold text-lg">Chưa tìm thấy sản phẩm nào</p>
                            <p className="text-gray-500 text-sm mt-1 mb-4">
                                {searchProduct || stockFilter !== 'all' || stationFilter !== 'all'
                                    ? 'Không tìm thấy sản phẩm trùng khớp với bộ lọc của bạn'
                                    : 'Hãy bấm nút "Thêm Sản Phẩm Mới" để tạo sản phẩm đầu tiên!'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {paginatedProducts.map((product) => {
                                    const imgSrc = product.image_url
                                        ? product.image_url.startsWith('http')
                                            ? product.image_url
                                            : `http://localhost:5000${product.image_url}`
                                        : null;

                                    return (
                                        <div
                                            key={product.product_id}
                                            className="bg-white rounded-3xl border border-gray-200 hover:border-green-400 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                                        >
                                            {/* ẢNH */}
                                            <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                                                {imgSrc ? (
                                                    <img
                                                        src={imgSrc}
                                                        alt={product.product_name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center bg-green-50 text-green-700">
                                                        <span className="text-5xl mb-1">📦</span>
                                                        <span className="text-xs font-bold uppercase tracking-wider">No Image</span>
                                                    </div>
                                                )}

                                                {/* BADGE TỒN KHO */}
                                                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-md backdrop-blur-md ${product.stock_status ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                                    {product.stock_status ? '🟢 Còn hàng' : '🔴 Hết hàng'}
                                                </span>
                                            </div>

                                            {/* NỘI DUNG */}
                                            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-base font-extrabold text-gray-800 line-clamp-1 group-hover:text-green-700 transition leading-snug" title={product.product_name}>
                                                        {product.product_name}
                                                    </h3>

                                                    <div className="h-5 flex items-center mt-1">
                                                        {product.brand ? (
                                                            <span className="text-[11px] text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-md line-clamp-1">
                                                                {product.brand}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[11px] text-gray-400 italic">Thương hiệu khác</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-1 pt-1">
                                                    <p className="text-green-700 font-bold text-sm">
                                                        💰 {Number(product.price).toLocaleString('vi-VN')} VNĐ
                                                    </p>

                                                    <p className="text-gray-500 text-xs flex items-center gap-1.5">
                                                        <FaStore className="text-blue-400 shrink-0" />
                                                        <span className="line-clamp-1">{product.station_name || 'Chưa có trạm'}</span>
                                                    </p>

                                                    {product.category_name && (
                                                        <p className="text-gray-400 text-xs flex items-center gap-1.5">
                                                            <FaTag className="text-gray-400 shrink-0" />
                                                            <span className="line-clamp-1">{product.category_name}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* THAO TÁC */}
                                            <div className="px-3.5 pb-3.5 pt-1 space-y-1.5">
                                                {/* NÚT TOGGLE TRẠNG THÁI */}
                                                <button
                                                    onClick={() => toggleProductStatus(product.product_id)}
                                                    className={`w-full py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                                        product.stock_status
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                                >
                                                    {product.stock_status ? '🟢 Đổi → Hết hàng' : '🔴 Đổi → Còn hàng'}
                                                </button>

                                                {/* SỬA / XÓA */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => editProduct(product)}
                                                        className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5"
                                                    >
                                                        <FaEdit /> Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => setProductToDelete(product)}
                                                        className="px-3.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5"
                                                    >
                                                        <FaTrash /> Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* PHÂN TRANG */}
                            <PaginationBar />

                            {/* INFO PHÂN TRANG */}
                            {totalPages > 1 && (
                                <p className="text-center text-xs text-gray-400 mt-3">
                                    Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} / {filteredProducts.length} sản phẩm
                                </p>
                            )}
                        </>
                    )}
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
                                disabled={isDeletingProduct}
                                className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-sm transition flex-1 disabled:opacity-50 cursor-pointer"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={confirmDeleteProduct}
                                disabled={isDeletingProduct}
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 transition flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeletingProduct ? (
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
                </main>
            </div>
        </div>
    );
}

export default OwnerProductsPage;