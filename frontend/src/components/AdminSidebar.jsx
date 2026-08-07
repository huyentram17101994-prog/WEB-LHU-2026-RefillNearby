import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    FaUsers, 
    FaStore, 
    FaBoxes, 
    FaRecycle, 
    FaStar, 
    FaHeart, 
    FaTint, 
    FaChartBar, 
    FaUserCircle, 
    FaPrint, 
    FaSignOutAlt, 
    FaTimes, 
    FaLeaf, 
    FaShieldAlt,
    FaMoon,
    FaSun,
    FaAngleLeft,
    FaAngleRight
} from 'react-icons/fa';

function AdminSidebar({ isOpen, onClose, pendingResetCount = 0, currentUser }) {
    const navigate = useNavigate();
    const location = useLocation();

    // CHẾ ĐỘ SÁNG / TỐI (LIGHT / DARK MODE)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('admin_theme') === 'dark';
    });

    // CHẾ ĐỘ CO KÉO THU GIÃN MENU (COLLAPSE / EXPAND)
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem('admin_sidebar_collapsed') === 'true';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('admin_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('admin_theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (isCollapsed) {
            document.documentElement.classList.add('sidebar-collapsed');
            localStorage.setItem('admin_sidebar_collapsed', 'true');
        } else {
            document.documentElement.classList.remove('sidebar-collapsed');
            localStorage.setItem('admin_sidebar_collapsed', 'false');
        }
    }, [isCollapsed]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const toggleCollapse = () => {
        setIsCollapsed(prev => !prev);
    };

    const storedUser = currentUser || (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    })();

    const avatarUrl = storedUser?.avatar
        ? storedUser.avatar.startsWith('/uploads')
            ? `http://localhost:5000${storedUser.avatar}`
            : storedUser.avatar
        : null;

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handlePrint = () => {
        window.print();
    };

    const isOwnerRole = storedUser?.role === 'store_owner' || location.pathname.startsWith('/owner');

    // Danh sách chức năng menu cho Admin
    const adminMenuItems = [
        {
            label: "Tổng quan hệ thống & Biểu đồ",
            shortLabel: "Tổng quan",
            path: "/admin",
            icon: FaChartBar,
            badge: null,
            color: isDarkMode ? "text-emerald-400" : "text-emerald-600"
        },
        {
            label: "Quản lý người dùng",
            shortLabel: "Người dùng",
            path: "/admin/users",
            icon: FaUsers,
            badge: pendingResetCount > 0 ? `${pendingResetCount}` : null,
            badgeColor: "bg-amber-500 text-white animate-pulse",
            color: isDarkMode ? "text-blue-400" : "text-blue-600"
        },
        {
            label: "Quản lý trạm refill",
            shortLabel: "Trạm Refill",
            path: "/admin/stations",
            icon: FaStore,
            badge: null,
            color: isDarkMode ? "text-green-400" : "text-green-600"
        },
        {
            label: "Quản lý sản phẩm",
            shortLabel: "Sản phẩm",
            path: "/admin/products",
            icon: FaBoxes,
            badge: null,
            color: isDarkMode ? "text-purple-400" : "text-purple-600"
        },
        {
            label: "Quản lý lịch sử refill",
            shortLabel: "Lịch sử Refill",
            path: "/admin/refills",
            icon: FaRecycle,
            badge: null,
            color: isDarkMode ? "text-teal-400" : "text-teal-600"
        },
        {
            label: "Quản lý đánh giá",
            shortLabel: "Đánh giá",
            path: "/admin/reviews",
            icon: FaStar,
            badge: null,
            color: isDarkMode ? "text-amber-400" : "text-amber-600"
        },
        {
            label: "Quản lý yêu thích",
            shortLabel: "Yêu thích",
            path: "/admin/favorites",
            icon: FaHeart,
            badge: null,
            color: isDarkMode ? "text-pink-400" : "text-pink-600"
        },
        {
            label: "Thống kê lượng refill",
            shortLabel: "Thống kê",
            path: "/admin/refills/statistics",
            icon: FaTint,
            badge: null,
            color: isDarkMode ? "text-cyan-400" : "text-cyan-600"
        }
    ];

    // Danh sách chức năng menu cho Chủ Trạm theo yêu cầu
    const ownerMenuItems = [
        {
            label: "Tổng quan & Biểu đồ thống kê",
            shortLabel: "Tổng quan",
            path: "/owner",
            icon: FaChartBar,
            badge: null,
            color: isDarkMode ? "text-emerald-400" : "text-emerald-600"
        },
        {
            label: "Quản lý trạm sở hữu",
            shortLabel: "Trạm sở hữu",
            path: "/owner/stations",
            icon: FaStore,
            badge: null,
            color: isDarkMode ? "text-green-400" : "text-green-600"
        },
        {
            label: "Quản lý sản phẩm",
            shortLabel: "Sản phẩm",
            path: "/owner/products",
            icon: FaBoxes,
            badge: null,
            color: isDarkMode ? "text-purple-400" : "text-purple-600"
        },
        {
            label: "Quản lý đánh giá",
            shortLabel: "Đánh giá",
            path: "/owner/reviews",
            icon: FaStar,
            badge: null,
            color: isDarkMode ? "text-amber-400" : "text-amber-600"
        }
    ];

    const menuItems = isOwnerRole ? ownerMenuItems : adminMenuItems;

    return (
        <>
            {/* Overlay cho mobile */}
            {isOpen && (
                <div 
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                />
            )}

            {/* Sidebar Container bên trái */}
            <aside className={`
                fixed top-0 bottom-0 left-0 z-50 flex flex-col
                border-r transition-all duration-300 ease-in-out print:hidden
                ${isCollapsed ? 'lg:w-20' : 'lg:w-72'} w-72
                ${isDarkMode 
                    ? 'bg-slate-900 text-slate-200 border-slate-800 shadow-2xl' 
                    : 'bg-white text-slate-800 border-slate-200 shadow-xl'
                }
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                
                {/* LOGO & BRAND HEADER */}
                <div className={`p-4 border-b flex items-center justify-between transition-colors ${
                    isDarkMode ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-slate-50'
                }`}>
                    <div 
                        className="flex items-center gap-3 cursor-pointer overflow-hidden min-w-0" 
                        onClick={() => navigate('/admin')}
                        title="Về tổng quan hệ thống"
                    >
                        <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
                            <span className="text-2xl select-none">🌱</span>
                        </div>
                        {!isCollapsed && (
                            <div className="hidden lg:block truncate">
                                <h2 className={`font-extrabold text-lg tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    RefillNearby
                                </h2>
                                <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md border flex items-center gap-1 w-max ${
                                    isDarkMode 
                                        ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800/50' 
                                        : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                }`}>
                                    {isOwnerRole ? (
                                        <><FaStore className="text-[10px]" /> Bảng Điều Khiển Chủ Trạm</>
                                    ) : (
                                        <><FaShieldAlt className="text-[10px]" /> Quản Trị Hệ Thống</>
                                    )}
                                </span>
                            </div>
                        )}
                        <div className="lg:hidden">
                            <h2 className={`font-extrabold text-lg tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                RefillNearby
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Nút thu gọn / mở rộng Sidebar trên Desktop */}
                        <button
                            onClick={toggleCollapse}
                            className={`hidden lg:flex items-center justify-center p-2 rounded-xl transition ${
                                isDarkMode 
                                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white' 
                                    : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                            }`}
                            title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
                        >
                            {isCollapsed ? <FaAngleRight size={18} /> : <FaAngleLeft size={18} />}
                        </button>

                        <button 
                            onClick={onClose}
                            className={`lg:hidden p-2 rounded-xl transition ${
                                isDarkMode 
                                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white' 
                                    : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                            }`}
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>
                </div>

                {/* USER BADGE */}
                <div className={`p-3.5 mx-3 mt-4 border rounded-2xl flex items-center gap-3 transition-colors ${
                    isDarkMode 
                        ? 'bg-slate-800/60 border-slate-700/50' 
                        : 'bg-slate-100 border-slate-200/80'
                }`}>
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0 bg-slate-300 flex items-center justify-center">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <FaUserCircle className="w-full h-full text-slate-500 p-0.5" />
                        )}
                    </div>
                    
                    {!isCollapsed && (
                        <div className="overflow-hidden min-w-0 flex-1 hidden lg:block">
                            <p className={`font-bold text-xs truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {storedUser?.full_name || "Quản Trị Viên"}
                            </p>
                            <p className={`text-[11px] truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {storedUser?.email || "admin@refillnearby.vn"}
                            </p>
                        </div>
                    )}
                    <div className="overflow-hidden min-w-0 flex-1 lg:hidden">
                        <p className={`font-bold text-xs truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {storedUser?.full_name || "Quản Trị Viên"}
                        </p>
                    </div>
                </div>

                {/* DANH SÁCH 8 MENU CHỨC NĂNG */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
                    {!isCollapsed && (
                        <p className={`px-3 text-[11px] font-extrabold tracking-wider uppercase mb-2 hidden lg:block ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                            DANH MỤC QUẢN LÝ
                        </p>
                    )}

                    {menuItems.map((item, idx) => {
                        const isActive = location.pathname === item.path || (item.path === '/owner' && location.pathname === '/home') || (item.path === '/admin' && location.pathname === '/home');
                        const IconComponent = item.icon;

                        return (
                            <button
                                key={idx}
                                onClick={() => {
                                    navigate(item.path);
                                    if (onClose) onClose();
                                }}
                                title={item.label}
                                className={`
                                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                                    font-semibold text-xs md:text-[13px] leading-tight transition-all duration-200 group relative
                                    ${isActive 
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-extrabold' 
                                        : isDarkMode
                                            ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-2.5 min-w-0 mx-auto lg:mx-0">
                                    <IconComponent className={`text-base shrink-0 transition-transform group-hover:scale-110 ${
                                        isActive ? 'text-white' : item.color
                                    }`} />
                                    
                                    {!isCollapsed && (
                                        <span className="truncate hidden lg:inline">{item.label}</span>
                                    )}
                                    <span className="truncate lg:hidden">{item.label}</span>
                                </div>

                                {item.badge && !isCollapsed && (
                                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 hidden lg:inline-block ${
                                        item.badgeColor || (isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-800')
                                    }`}>
                                        {item.badge}
                                    </span>
                                )}

                                {isActive && (
                                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-300 rounded-r-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* PHÍA DƯỚI CÙNG MENU: ĐỔI GIAO DIỆN SÁNG/TỐI, HỒ SƠ, IN/XUẤT PDF, ĐĂNG XUẤT */}
                <div className={`p-3 border-t space-y-1.5 transition-colors ${
                    isDarkMode ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-slate-50'
                }`}>
                    {/* NÚT CHUYỂN CHẾ ĐỘ SÁNG / TỐI (DARK / MOON MODE) */}
                    <button
                        onClick={toggleTheme}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition font-medium text-xs border cursor-pointer ${
                            isDarkMode 
                                ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800' 
                                : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-slate-200 shadow-sm'
                        }`}
                        title={isDarkMode ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối (Moon Mode)"}
                    >
                        <div className="flex items-center gap-3 mx-auto lg:mx-0">
                            {isDarkMode ? (
                                <FaMoon className="text-base text-indigo-400 shrink-0" />
                            ) : (
                                <FaSun className="text-base text-amber-500 shrink-0" />
                            )}
                            {!isCollapsed && (
                                <span className="hidden lg:inline">{isDarkMode ? 'Giao diện Tối' : 'Giao diện Sáng'}</span>
                            )}
                            <span className="lg:hidden">{isDarkMode ? 'Giao diện Tối' : 'Giao diện Sáng'}</span>
                        </div>
                        
                        {!isCollapsed && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full hidden lg:inline-block ${
                                isDarkMode ? 'bg-indigo-900/80 text-indigo-200 border border-indigo-700/50' : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                                {isDarkMode ? '🌙 Dark' : '☀️ Light'}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => {
                            navigate('/profile');
                            if (onClose) onClose();
                        }}
                        title="Hồ sơ cá nhân"
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition font-medium text-xs ${
                            isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                        <FaUserCircle className="text-base text-emerald-500 shrink-0 mx-auto lg:mx-0" />
                        {!isCollapsed && <span className="hidden lg:inline">Hồ sơ cá nhân</span>}
                        <span className="lg:hidden">Hồ sơ cá nhân</span>
                    </button>

                    <button
                        onClick={handlePrint}
                        title="In hoặc Xuất PDF"
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition font-medium text-xs ${
                            isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                        <FaPrint className="text-base text-amber-500 shrink-0 mx-auto lg:mx-0" />
                        {!isCollapsed && <span className="hidden lg:inline">In / Xuất PDF</span>}
                        <span className="lg:hidden">In / Xuất PDF</span>
                    </button>

                    <button
                        onClick={logout}
                        title="Đăng xuất khỏi hệ thống"
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-500 transition font-medium text-xs border ${
                            isDarkMode ? 'hover:bg-rose-950/50 hover:text-rose-300 border-rose-900/30' : 'hover:bg-rose-50 hover:text-rose-600 border-rose-200'
                        }`}
                    >
                        <FaSignOutAlt className="text-base shrink-0 mx-auto lg:mx-0" />
                        {!isCollapsed && <span className="hidden lg:inline">Đăng xuất</span>}
                        <span className="lg:hidden">Đăng xuất</span>
                    </button>
                </div>

            </aside>
        </>
    );
}

export default AdminSidebar;
