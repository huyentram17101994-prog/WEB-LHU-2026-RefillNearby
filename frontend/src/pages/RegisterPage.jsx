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
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [registeredOwnerData, setRegisteredOwnerData] = useState(null);

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
            const res = await api.post('/auth/register', {
                full_name: fullName,
                email,
                password,
                phone,
                role: isOwner ? 'store_owner' : 'user'
            });

            if (isOwner || res.data?.pendingApproval) {
                setRegisteredOwnerData({
                    fullName,
                    email
                });
                setShowPendingModal(true);
            } else {
                alert('🎉 Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.');
                navigate('/login');
            }
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
                    <div className="space-y-2">
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

                        {isOwner && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                                <p className="font-bold flex items-center gap-1 text-amber-900">
                                    <FaExclamationCircle className="text-amber-600 shrink-0" /> Yêu cầu xét duyệt từ Admin:
                                </p>
                                <p className="text-[11px] leading-relaxed text-amber-800">
                                    Tài khoản Chủ trạm sau khi đăng ký sẽ cần Quản trị viên (Admin) kiểm tra và xét duyệt trước khi bạn có thể đăng nhập để đăng trạm và sản phẩm.
                                </p>
                            </div>
                        )}
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

            {/* POPUP THÔNG BÁO TÀI KHOẢN CHỦ TRẠM CHỜ ADMIN DUYỆT */}
            {showPendingModal && registeredOwnerData && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 text-center space-y-5 border border-emerald-100">
                        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner ring-8 ring-amber-50">
                            <FaStore />
                        </div>

                        <div>
                            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs inline-block mb-2 border border-amber-200">
                                ⏳ Đang Chờ Admin Phê Duyệt
                            </span>
                            <h3 className="text-2xl font-black text-gray-800">
                                Đăng Ký Chủ Trạm Thành Công!
                            </h3>
                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                Cảm ơn bạn <b className="text-gray-900 font-extrabold">"{registeredOwnerData.fullName}"</b> đã đăng ký làm Chủ trạm Refill!
                            </p>
                            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left text-xs text-emerald-900 space-y-2">
                                <p className="font-semibold flex items-start gap-1.5">
                                    <span>📩</span>
                                    <span>Hệ thống sẽ gửi <b>Email thông báo kích hoạt</b> tới hòm thư <b className="text-emerald-800 underline">{registeredOwnerData.email}</b> ngay khi Quản trị viên (Admin) phê duyệt.</span>
                                </p>
                                <p className="font-semibold flex items-start gap-1.5">
                                    <span>🔑</span>
                                    <span>Sau khi được duyệt, bạn có thể đăng nhập để bắt đầu tạo và quản lý các trạm Refill của mình.</span>
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => {
                                    setShowPendingModal(false);
                                    navigate('/login');
                                }}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-emerald-200 transition cursor-pointer"
                            >
                                Đã hiểu, chuyển đến Đăng nhập
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RegisterPage;