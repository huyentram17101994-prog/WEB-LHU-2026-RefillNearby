import { useEffect, useState } from 'react';
import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import FloatingPrintButton from '../components/FloatingPrintButton';
import AdminSidebar from '../components/AdminSidebar';
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
    FaChevronRight,
    FaKey,
    FaExclamationTriangle,
    FaCheckCircle,
    FaPrint,
    FaBars,
    FaEdit
} from 'react-icons/fa';

const USERS_PER_PAGE = 10;

function AdminUsersPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [userToResetPassword, setUserToResetPassword] = useState(null);
    const [isResetting, setIsResetting] = useState(false);
    const [resetSuccessData, setResetSuccessData] = useState(null);

    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [approveSuccessUser, setApproveSuccessUser] = useState(null);
    const [isApproving, setIsApproving] = useState(false);

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

    const confirmResetPassword = async () => {
        if (!userToResetPassword) return;
        setIsResetting(true);
        try {
            const res = await api.post(`/admin/users/${userToResetPassword.user_id}/reset-password`);
            setResetSuccessData({
                user: userToResetPassword,
                tempPassword: res.data?.tempPassword,
                message: res.data?.message || `Reset mật khẩu thành công. Mật khẩu tạm đã được phát hành.`
            });
            setUserToResetPassword(null);
            loadUsers();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Không thể reset mật khẩu người dùng.");
        } finally {
            setIsResetting(false);
        }
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/admin/users/${userToDelete.user_id}`);
            setUserToDelete(null);
            loadUsers();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Không thể xóa người dùng.");
        } finally {
            setIsDeleting(false);
        }
    };

    const pendingResetCount = users.filter(u => Boolean(u.reset_requested)).length;
    const pendingApprovalCount = users.filter(u => u.status === 'pending').length;

    const filteredUsers = users.filter(user => {
        const matchSearch =
            user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase());

        let matchRole = true;
        if (roleFilter === 'reset_requested') {
            matchRole = Boolean(user.reset_requested);
        } else if (roleFilter === 'pending') {
            matchRole = user.status === 'pending';
        } else if (roleFilter !== '') {
            matchRole = user.role === roleFilter;
        }

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

    const handleApproveUser = async (user) => {
        setIsApproving(true);
        try {
            const res = await api.put(`/admin/users/${user.user_id}/approve`);
            setApproveSuccessUser(user);
            loadUsers();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Không thể duyệt tài khoản người dùng.");
        } finally {
            setIsApproving(false);
        }
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
            <div className="flex items-center justify-center gap-2 mt-6 print:hidden">
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 flex">
            <AdminSidebar 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                pendingResetCount={pendingResetCount}
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
                                <span className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl text-xl">👤</span>
                                Quản Lý Người Dùng
                            </h1>
                            <p className="text-slate-500 text-xs md:text-sm mt-1">
                                Xem danh sách tài khoản, duyệt yêu cầu reset mật khẩu và quản lý quyền truy cập
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl font-bold text-sm border border-blue-200 flex items-center gap-2">
                            <FaUsers /> Tổng số: {users.length} tài khoản
                        </div>
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
                            className="px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition font-medium min-w-[200px]"
                        >
                            <option value="">👤 Tất cả vai trò</option>
                            {pendingApprovalCount > 0 && (
                                <option value="pending">⏳ Chờ duyệt ({pendingApprovalCount})</option>
                            )}
                            {pendingResetCount > 0 && (
                                <option value="reset_requested">🔔 Yêu cầu Reset MK ({pendingResetCount})</option>
                            )}
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
                                            <th className="p-4">Vai trò & Trạng thái</th>
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

                                                {/* VAI TRÒ & TRẠNG THÁI ON SAME LINE */}
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
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

                                                        {user.status === "active" ? (
                                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-extrabold border border-green-200 inline-flex items-center gap-1">
                                                                🟢 Hoạt động
                                                            </span>
                                                        ) : user.status === "pending" ? (
                                                            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-extrabold border border-amber-300 inline-flex items-center gap-1 animate-pulse">
                                                                🟡 Chờ xét duyệt
                                                            </span>
                                                        ) : (
                                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-extrabold border border-red-200 inline-flex items-center gap-1">
                                                                🔴 Đã bị khóa
                                                            </span>
                                                        )}
                                                    </div>
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
                                                        <div className="flex justify-center items-center gap-1.5 whitespace-nowrap">
                                                            {user.status === "pending" && (
                                                                <button
                                                                    onClick={() => handleApproveUser(user)}
                                                                    className="px-3 py-1.5 rounded-xl text-white font-extrabold text-xs shadow transition flex items-center gap-1 bg-green-600 hover:bg-green-700 animate-pulse ring-2 ring-green-300 cursor-pointer"
                                                                    title="Bấm để kích hoạt tài khoản Chủ trạm này"
                                                                >
                                                                    <FaCheckCircle size={11} /> Duyệt tài khoản
                                                                </button>
                                                            )}

                                                            {Boolean(user.reset_requested) && (
                                                                <button
                                                                    onClick={() => setUserToResetPassword(user)}
                                                                    className="px-3 py-1.5 rounded-xl text-white font-extrabold text-xs shadow transition flex items-center gap-1 bg-amber-500 hover:bg-amber-600 animate-pulse ring-2 ring-amber-300 cursor-pointer"
                                                                    title="Người dùng này đang gửi yêu cầu Reset MK!"
                                                                >
                                                                    <FaKey size={11} /> 🔔 Duyệt Reset MK
                                                                </button>
                                                            )}

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
                                                                onClick={() => setUserToDelete(user)}
                                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow transition flex items-center gap-1 cursor-pointer"
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

            {/* MODAL XÁC NHẬN RESET MẬT KHẨU */}
            {userToResetPassword && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 text-center space-y-5 border border-blue-100">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                            <FaKey />
                        </div>

                        <div>
                            <h3 className="text-xl font-extrabold text-gray-800">Xác Nhận Reset Mật Khẩu</h3>
                            <p className="text-gray-600 text-sm mt-2">
                                Bạn có chắc chắn muốn đặt lại mật khẩu cho người dùng <b className="text-gray-900 font-extrabold">"{userToResetPassword.full_name}"</b> (<span className="text-blue-600 font-semibold">{userToResetPassword.email}</span>)?
                            </p>
                            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-2xl p-3 text-left text-xs text-blue-800 space-y-1">
                                <p>🔒 <b>Mật khẩu tạm tự động</b> (Độ phức tạp cao) sẽ được hệ thống tạo ngẫu nhiên.</p>
                                <p>✉️ Mật khẩu tạm được tự động gửi tới Email của người dùng.</p>
                                <p>⏳ Mật khẩu tạm thời có hiệu lực trong <b>30 phút</b> và bắt buộc đổi ngay khi đăng nhập.</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                onClick={() => setUserToResetPassword(null)}
                                disabled={isResetting}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm transition flex-1 disabled:opacity-50"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={confirmResetPassword}
                                disabled={isResetting}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 transition flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isResetting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang tạo MK...
                                    </>
                                ) : (
                                    <>
                                        <FaKey /> Xác nhận Reset
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL THÔNG BÁO RESET THÀNH CÔNG */}
            {resetSuccessData && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 text-center space-y-5 border border-green-100">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                            <FaCheckCircle />
                        </div>

                        <div>
                            <h3 className="text-xl font-extrabold text-green-800">Reset Mật Khẩu Thành Công 🎉</h3>
                            <p className="text-gray-600 text-xs mt-1.5">
                                {resetSuccessData.message}
                            </p>

                            {/* HIỂN THỊ MẬT KHẨU TẠM THỜI TRỰC TIẾP TRÊN MÀN HÌNH ADMIN */}
                            {resetSuccessData.tempPassword && (
                                <div className="mt-4 bg-amber-50 border border-amber-300 rounded-2xl p-4 text-center space-y-2 shadow-inner">
                                    <p className="text-xs text-amber-900 font-extrabold">🔑 MẬT KHẨU TẠM THỜI (Vừa tạo):</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <code className="text-lg font-mono font-extrabold text-amber-950 bg-amber-100/90 px-3.5 py-1.5 rounded-xl border border-amber-300 select-all tracking-wider">
                                            {resetSuccessData.tempPassword}
                                        </code>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(resetSuccessData.tempPassword);
                                                alert("📋 Đã sao chép Mật khẩu tạm vào bộ nhớ tạm!");
                                            }}
                                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-md active:scale-95"
                                        >
                                            Sao chép
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-amber-700 font-medium">
                                        ⏳ Mật khẩu có hiệu lực trong <b>30 phút</b> và sẽ bắt buộc đổi ngay sau khi đăng nhập.
                                    </p>
                                </div>
                            )}

                            <p className="text-xs text-gray-500 mt-3">
                                Bạn có thể sao chép mật khẩu trên hoặc hướng dẫn người dùng kiểm tra Email để đăng nhập.
                            </p>
                        </div>

                        <button
                            onClick={() => setResetSuccessData(null)}
                            className="w-full px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-200 transition"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL XÁC NHẬN XÓA NGƯỜI DÙNG (POPUP ĐỒNG BỘ) */}
            {userToDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 text-center space-y-5 border border-red-100">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                            <FaTrash />
                        </div>

                        <div>
                            <h3 className="text-xl font-extrabold text-gray-800">Xác Nhận Xóa Tài Khoản</h3>
                            <p className="text-gray-600 text-sm mt-2">
                                Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản <b className="text-gray-900 font-extrabold">"{userToDelete.full_name}"</b> (<span className="text-blue-600 font-semibold">{userToDelete.email}</span>)?
                            </p>
                            <p className="text-xs text-red-500 font-medium mt-2.5 bg-red-50 p-2.5 rounded-xl border border-red-200">
                                ⚠️ <b>Cảnh báo:</b> Thao tác này không thể hoàn tác và sẽ xóa toàn bộ thông tin người dùng khỏi hệ thống.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                onClick={() => setUserToDelete(null)}
                                disabled={isDeleting}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm transition flex-1 disabled:opacity-50"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={confirmDeleteUser}
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
                                        <FaTrash /> Xác nhận Xóa
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* MODAL THÔNG BÁO DUYỆT TÀI KHOẢN CHỦ TRẠM THÀNH CÔNG */}
            {approveSuccessUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 text-center space-y-5 border border-emerald-100">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner ring-8 ring-emerald-50">
                            <FaCheckCircle />
                        </div>

                        <div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs inline-block mb-2">
                                🎉 Duyệt Tài Khoản Thành Công
                            </span>
                            <h3 className="text-2xl font-black text-gray-800">
                                Đã Duyệt Chủ Trạm!
                            </h3>
                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                Tài khoản chủ trạm <b className="text-gray-900 font-extrabold">"{approveSuccessUser.full_name}"</b> (<span className="text-emerald-700 font-semibold">{approveSuccessUser.email}</span>) đã được kích hoạt thành công.
                            </p>
                            <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-left text-xs text-emerald-900 space-y-1">
                                <p>✅ Chủ trạm hiện có thể đăng nhập vào hệ thống.</p>
                                <p>🏪 Chủ trạm đã có đầy đủ quyền quản lý các trạm Refill của mình.</p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => setApproveSuccessUser(null)}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-emerald-200 transition cursor-pointer"
                            >
                                Đóng
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

export default AdminUsersPage;