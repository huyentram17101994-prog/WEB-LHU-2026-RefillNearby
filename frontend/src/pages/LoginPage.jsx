import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

function LoginPage() {
    const navigate = useNavigate();

    const [account, setAccount] = useState(''); // Hỗ trợ Email hoặc Số điện thoại
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!account.trim()) {
            alert('⚠️ Vui lòng nhập Email hoặc Số điện thoại!');
            return;
        }

        try {
            setLoading(true);

            const response = await api.post('/auth/login', {
                email: account.trim(), // Trình điều khiển backend hỗ trợ kiểm tra email hoặc SĐT
                password
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.user.role);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Nếu tài khoản sử dụng Mật khẩu tạm từ Admin -> Bắt buộc tới trang đổi mật khẩu mới
            if (response.data.must_change_password) {
                alert('⚠️ Bạn đang sử dụng Mật khẩu tạm thời. Vui lòng khởi tạo Mật khẩu mới để bảo vệ tài khoản!');
                navigate('/change-password-required');
                return;
            }

            const role = response.data.user.role;
            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'store_owner') {
                navigate('/owner');
            } else {
                navigate('/location-permission');
            }
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message || '❌ Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-green-300 flex items-center justify-center p-4 md:p-6 relative">
            
           

            {/* CARD FORM ĐĂNG NHẬP NHỎ GỌN NỔI BẬT */}
            <div className="bg-white/85 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 md:p-10 w-full max-w-sm space-y-7">
                
                {/* HEADER */}
                <div className="text-center space-y-2 py-1">
                    <div className="w-16 h-16 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner">
                        🌱
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-green-800 pt-1">
                        Refill Nearby
                    </h1>
                    <p className="text-gray-600 text-xs">
                        Đăng nhập để tiếp tục hành trình sống xanh
                    </p>
                </div>

                {/* FORM ĐĂNG NHẬP */}
                <form onSubmit={handleLogin} className="space-y-5">
                    
                    {/* EMAIL HOẶC SỐ ĐIỆN THOẠI */}
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

                    {/* MẬT KHẨU */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white text-sm transition"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                            </button>
                        </div>
                    </div>

                    {/* GHI NHỚ & QUÊN MẬT KHẨU */}
                    <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 text-green-600 rounded focus:ring-green-400 cursor-pointer"
                            />
                            Ghi nhớ đăng nhập
                        </label>

                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="text-green-700 font-semibold hover:underline"
                        >
                            Quên mật khẩu?
                        </button>
                    </div>

                    {/* NÚT ĐĂNG NHẬP */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-green-200 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-3"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang đăng nhập...
                            </>
                        ) : (
                            'Đăng Nhập'
                        )}
                    </button>
                </form>

                {/* REGISTER CHUYỂN TRANG */}
                <p className="text-center text-xs text-gray-600 pt-3 border-t border-gray-100">
                    Chưa có tài khoản?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-green-700 font-bold hover:underline"
                    >
                        Đăng ký ngay
                    </button>
                </p>

            </div>
        </div>
    );
}

export default LoginPage;