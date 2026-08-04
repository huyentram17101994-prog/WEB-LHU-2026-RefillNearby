import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
    FaUser, 
    FaEnvelope, 
    FaPhone, 
    FaLock, 
    FaEye, 
    FaEyeSlash, 
    FaStore,
    FaCheckCircle,
    FaExclamationCircle 
} from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

function RegisterPage() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Số điện thoại phải có đúng 10 chữ số
        if (phone.length !== 10) {
            alert('⚠️ Số điện thoại phải có đúng 10 chữ số!');
            return;
        }

        // Mật khẩu phải đúng 8 ký tự
        if (password.length !== 8) {
            alert('⚠️ Mật khẩu phải có đúng 8 ký tự!');
            return;
        }

        try {
            setLoading(true);
            await api.post('/auth/register', {
                full_name: fullName,
                email,
                password,
                phone,
                role: isOwner ? 'store_owner' : 'user'
            });

            alert('🎉 Đăng ký tài khoản thành công!');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message || '❌ Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-green-300 flex items-center justify-center p-4 md:p-6 relative">
            
           

            {/* CARD FORM ĐĂNG KÝ NHỎ GỌN */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 md:p-8 w-full max-w-md space-y-5">
                
                {/* HEADER */}
                <div className="text-center space-y-1">
                    <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-inner">
                        🌱
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-green-800 pt-1">
                        Tạo Tài Khoản
                    </h1>
                    <p className="text-gray-600 text-xs">
                        Bắt đầu hành trình sống xanh cùng Refill Nearby
                    </p>
                </div>

                {/* FORM ĐĂNG KÝ */}
                <form onSubmit={handleRegister} className="space-y-3.5">
                    
                    {/* HỌ VÀ TÊN */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Nhập họ và tên của bạn"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white text-sm transition"
                                required
                            />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Địa chỉ Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="email"
                                placeholder="Nhập địa chỉ email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white text-sm transition"
                                required
                            />
                        </div>
                    </div>

                    {/* SỐ ĐIỆN THOẠI */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="tel"
                                placeholder="Nhập số điện thoại"
                                value={phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) setPhone(val);
                                }}
                                maxLength={10}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white text-sm transition"
                                required
                            />
                        </div>

                        {/* THÔNG BÁO SỐ ĐIỆN THOẠI */}
                        {phone.length > 0 && phone.length < 10 && (
                            <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                <FaExclamationCircle size={12} /> Số điện thoại phải có đúng 10 chữ số ({phone.length}/10)
                            </p>
                        )}
                        {phone.length === 10 && (
                            <p className="text-green-600 text-xs mt-1 font-medium flex items-center gap-1">
                                <FaCheckCircle size={12} /> Số điện thoại hợp lệ (10/10)
                            </p>
                        )}
                    </div>

                    {/* MẬT KHẨU */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Mật khẩu (Đúng 8 ký tự) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu (đúng 8 ký tự)"
                                value={password}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 8) setPassword(value);
                                }}
                                maxLength={8}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white text-sm transition"
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

                        {/* THÔNG BÁO MẬT KHẨU */}
                        {password.length > 0 && password.length < 8 && (
                            <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                <FaExclamationCircle size={12} /> Mật khẩu phải có đúng 8 ký tự ({password.length}/8)
                            </p>
                        )}
                        {password.length === 8 && (
                            <p className="text-green-600 text-xs mt-1 font-medium flex items-center gap-1">
                                <FaCheckCircle size={12} /> Mật khẩu hợp lệ (8/8)
                            </p>
                        )}
                    </div>

                    {/* ĐĂNG KÝ LÀM CHỦ TRẠM */}
                    <div className="flex items-center gap-2.5 bg-green-50/70 p-2.5 rounded-xl border border-green-100 cursor-pointer" onClick={() => setIsOwner(!isOwner)}>
                        <input
                            type="checkbox"
                            checked={isOwner}
                            onChange={(e) => setIsOwner(e.target.checked)}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-400 cursor-pointer"
                        />
                        <label className="text-xs font-semibold text-green-900 cursor-pointer select-none flex items-center gap-1.5">
                            <FaStore className="text-green-600 shrink-0" /> Đăng ký tài khoản làm Chủ trạm Refill
                        </label>
                    </div>

                    {/* NÚT ĐĂNG KÝ */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-green-200 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            'Đăng Ký Tài Khoản'
                        )}
                    </button>
                </form>

                {/* LOGIN CHUYỂN TRANG */}
                <p className="text-center text-xs text-gray-600 pt-1">
                    Đã có tài khoản?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-green-700 font-bold hover:underline"
                    >
                        Đăng nhập ngay
                    </button>
                </p>

            </div>
        </div>
    );
}

export default RegisterPage;