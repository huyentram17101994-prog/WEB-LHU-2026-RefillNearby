import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaUser, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [account, setAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!account.trim()) {
            alert('⚠️ Vui lòng nhập Email hoặc Số điện thoại đăng ký!');
            return;
        }

        try {
            setLoading(true);
            const res = await api.post('/auth/forgot-password-request', {
                account: account.trim()
            });

            setSuccessMessage(
                res.data?.message || '🎉 Yêu cầu của bạn đã được gửi thành công tới Quản trị viên!'
            );
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message || '❌ Không thể gửi yêu cầu. Vui lòng kiểm tra lại thông tin!'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-green-300 flex items-center justify-center p-4 md:p-6 relative select-none">
            
            {/* CARD FORM YÊU CẦU QUÊN MẬT KHẨU NHỎ GỌN */}
            <div className="bg-white/85 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 md:p-8 w-full max-w-sm space-y-6">
                
                {successMessage ? (
                    /* MÀN HÌNH THÔNG BÁO THÀNH CÔNG */
                    <div className="text-center space-y-5 py-2">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner border border-green-200">
                            <FaCheckCircle />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-extrabold text-green-800">Đã Gửi Yêu Cầu!</h2>
                            <p className="text-gray-600 text-xs leading-relaxed">
                                {successMessage}
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 text-left text-xs text-blue-800 space-y-1">
                            <p className="font-bold text-blue-900">📌 Các bước tiếp theo:</p>
                            <p>1. Quản trị viên sẽ duyệt yêu cầu của bạn trên hệ thống.</p>
                            <p>2. Mật khẩu tạm thời sẽ tự động được gửi tới Email của bạn.</p>
                            <p>3. Dùng mật khẩu tạm đó để đăng nhập và tạo Mật khẩu mới.</p>
                        </div>

                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-green-200 transition duration-200"
                        >
                            Quay Về Trang Đăng Nhập
                        </button>
                    </div>
                ) : (
                    /* FORM NHẬP THÔNG TIN GỬI YÊU CẦU */
                    <>
                        {/* HEADER */}
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner">
                                🔑
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-green-800 pt-1">
                                Quên Mật Khẩu
                            </h1>
                            <p className="text-gray-600 text-xs">
                                Nhập Email hoặc Số điện thoại để gửi yêu cầu reset mật khẩu tới Quản trị viên
                            </p>
                        </div>

                        {/* FORM */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Email hoặc Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                    <input
                                        type="text"
                                        placeholder="Nhập email hoặc số điện thoại"
                                        value={account}
                                        onChange={(e) => setAccount(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white text-sm transition"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-green-200 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang gửi yêu cầu...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane size={14} /> Gửi Yêu Cầu Cho Admin
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                            Nhớ lại mật khẩu?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-green-700 font-bold hover:underline"
                            >
                                Đăng nhập ngay
                            </button>
                        </p>
                    </>
                )}

            </div>
        </div>
    );
}

export default ForgotPasswordPage;