function ProtectedOwnerRoute({ children }) {
    const role = localStorage.getItem('role');
    const userStr = localStorage.getItem('user');
    let user = null;
    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.error(e);
    }

    if (user && user.status === 'pending') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl text-center max-w-md border border-amber-200">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">
                        ⏳
                    </div>
                    <h1 className="text-2xl font-black text-amber-800 mb-2">
                        Tài Khoản Đang Chờ Xét Duyệt
                    </h1>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                        Tài khoản Chủ trạm của bạn đang chờ Quản trị viên (Admin) xét duyệt. Vui lòng quay lại sau hoặc liên hệ Admin để kích hoạt.
                    </p>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/login';
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-green-200"
                    >
                        Quay lại Đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    if (role !== 'store_owner' && role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl text-center max-w-md">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">
                        🚫 Không có quyền truy cập
                    </h1>
                    <p className="text-gray-600 mb-6 text-sm">
                        Chỉ chủ trạm hoặc quản trị viên mới được truy cập trang này.
                    </p>
                    <button
                        onClick={() => window.location.href = '/home'}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition"
                    >
                        Quay về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    return children;
}

export default ProtectedOwnerRoute;