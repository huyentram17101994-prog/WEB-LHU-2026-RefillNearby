function ProtectedOwnerRoute({ children }) {

    const role = localStorage.getItem('role');

    if (
        role !== 'store_owner' &&
        role !== 'admin'
    ) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                <div className="bg-white p-10 rounded-3xl shadow-xl text-center">

                    <h1 className="text-4xl font-bold text-red-600 mb-4">
                        🚫 Không có quyền truy cập
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Chỉ chủ trạm hoặc quản trị viên mới được truy cập trang này.
                    </p>

                    <button
                        onClick={() => window.location.href = '/home'}
                        className="bg-green-500 text-white px-6 py-3 rounded-xl"
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