import { useEffect, useState } from 'react';
import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import {
    FaUsers,
    FaSearch,
    FaUserShield,
    FaStore,
    FaUser,
    FaLock,
    FaUnlock,
    FaTrash,
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';

const USERS_PER_PAGE = 10;

function AdminUsersPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data || []);
        } catch (error) {
            console.error("Lỗi lấy danh sách người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchSearch =
            user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase());

        const matchRole = roleFilter === '' || user.role === roleFilter;

        return matchSearch && matchRole;
    });

    // Phân trang
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    const handleSearchChange = (val) => {
        setSearch(val);
        setCurrentPage(1);
    };

    const handleRoleFilterChange = (val) => {
        setRoleFilter(val);
        setCurrentPage(1);
    };

    const toggleStatus = async (user) => {
        try {
            await api.put(`/admin/users/${user.user_id}/toggle-status`);
            loadUsers();
        } catch (error) {
            console.error(error);
            alert("Không thể cập nhật trạng thái người dùng.");
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('⚠️ Bạn có chắc muốn xóa người dùng này?')) {
            return;
        }
        try {
            await api.delete(`/admin/users/${id}`);
            alert("🗑️ Xóa người dùng thành công");
            loadUsers();
        } catch (error) {
            console.error(error);
            alert("Không thể xóa người dùng.");
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
                        className={`w-9 h-9 rounded-xl font-bold text-sm transition shadow-sm ${currentPage === p
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
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-300 p-4 md:p-8">

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
                            <span className="p-3 bg-blue-100 text-blue-700 rounded-2xl text-2xl">👤</span>
                            Quản Lý Người Dùng
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Xem danh sách tài khoản, khóa/mở khóa và quản lý quyền truy cập trong hệ thống
                        </p>
                    </div>

                    <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl font-bold text-sm border border-blue-200 flex items-center gap-2">
                        <FaUsers /> Tổng số: {users.length} tài khoản
                    </div>
                </div>

                {/* MAIN CONTENT CARD */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 space-y-6">

                    {/* BỘ LỌC TÌM KIẾM */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên hoặc email người dùng..."
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition"
                            />
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) => handleRoleFilterChange(e.target.value)}
                            className="px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition font-medium min-w-[170px]"
                        >
                            <option value="">👤 Tất cả vai trò</option>
                            <option value="admin">🛡️ Admin</option>
                            <option value="store_owner">🏪 Chủ trạm</option>
                            <option value="user">👤 Người dùng</option>
                        </select>
                    </div>

                    {/* BẢNG NGƯỜI DÙNG */}
                    {loading ? (
                        <div className="text-center py-16 text-gray-500">
                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            Đang tải danh sách người dùng...
                        </div>
                    ) : paginatedUsers.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <span className="text-5xl block mb-3">👤</span>
                            <p className="text-gray-700 font-bold text-lg">Chưa tìm thấy người dùng nào</p>
                            <p className="text-gray-500 text-xs mt-1">Thử đổi từ khóa hoặc loại bỏ bộ lọc vai trò</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-green-50 text-green-800 font-bold text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4">ID</th>
                                            <th className="p-4">Họ tên</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Vai trò</th>
                                            <th className="p-4">Trạng thái</th>
                                            <th className="p-4">Ngày tạo</th>
                                            <th className="p-4 text-center">Thao tác</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedUsers.map((user) => (
                                            <tr key={user.user_id} className="hover:bg-green-50/50 transition">
                                                <td className="p-4 font-mono font-bold text-gray-500">#{user.user_id}</td>
                                                <td className="p-4 font-bold text-gray-800">{user.full_name}</td>
                                                <td className="p-4 text-gray-600">{user.email}</td>

                                                {/* VAI TRÒ BADGE */}
                                                <td className="p-4">
                                                    {user.role === 'admin' && (
                                                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-xs inline-flex items-center gap-1 border border-purple-200">
                                                            <FaUserShield /> Admin
                                                        </span>
                                                    )}
                                                    {user.role === 'store_owner' && (
                                                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center gap-1 border border-blue-200">
                                                            <FaStore /> Chủ trạm
                                                        </span>
                                                    )}
                                                    {user.role === 'user' && (
                                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-xs inline-flex items-center gap-1 border border-green-200">
                                                            <FaUser /> Người dùng
                                                        </span>
                                                    )}
                                                </td>

                                                {/* TRẠNG THÁI BADGE */}
                                                <td className="p-4">
                                                    {user.status === "active" ? (
                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-extrabold border border-green-200 inline-flex items-center gap-1">
                                                            🟢 Hoạt động
                                                        </span>
                                                    ) : (
                                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-extrabold border border-red-200 inline-flex items-center gap-1">
                                                            🔴 Đã bị khóa
                                                        </span>
                                                    )}
                                                </td>

                                                {/* NGÀY TẠO */}
                                                <td className="p-4 text-gray-700 font-semibold text-xs whitespace-nowrap">
                                                    📅 {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                                </td>

                                                {/* THAO TÁC */}
                                                <td className="p-4 text-center">
                                                    {user.role === "admin" ? (
                                                        <span className="text-gray-400 text-xs italic">Bảo vệ quyền Admin</span>
                                                    ) : (
                                                        <div className="flex justify-center items-center gap-2">
                                                            <button
                                                                onClick={() => toggleStatus(user)}
                                                                className={`px-3 py-1.5 rounded-xl text-white font-bold text-xs shadow transition flex items-center gap-1 ${user.status === "active"
                                                                        ? "bg-amber-500 hover:bg-amber-600"
                                                                        : "bg-green-600 hover:bg-green-700"
                                                                    }`}
                                                            >
                                                                {user.status === "active" ? (
                                                                    <><FaLock size={11} /> Khóa</>
                                                                ) : (
                                                                    <><FaUnlock size={11} /> Mở khóa</>
                                                                )}
                                                            </button>

                                                            <button
                                                                onClick={() => deleteUser(user.user_id)}
                                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow transition flex items-center gap-1"
                                                            >
                                                                <FaTrash size={11} /> Xóa
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* PHÂN TRANG */}
                            <PaginationBar />

                            {totalPages > 1 && (
                                <p className="text-center text-xs text-gray-400 mt-2">
                                    Hiển thị {(currentPage - 1) * USERS_PER_PAGE + 1}–{Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} / {filteredUsers.length} tài khoản
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminUsersPage;