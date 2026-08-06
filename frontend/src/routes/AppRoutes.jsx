import { useEffect } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
    useNavigate
} from 'react-router-dom';
import WelcomePage from '../pages/WelcomePage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import StationDetailPage from '../pages/StationDetailPage';
import FavoritesPage from '../pages/FavoritesPage';
import RegisterPage from '../pages/RegisterPage';
import LocationPermissionPage from '../pages/LocationPermissionPage';
import SearchPage from '../pages/SearchPage';
import ProductsPage from "../pages/ProductsPage";
import RefillHistoryPage from '../pages/RefillHistoryPage';
import StatisticsPage from '../pages/StatisticsPage';
import OCRPage from '../pages/OCRPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import OwnerDashboardPage from '../pages/OwnerDashboardPage';
import ProtectedOwnerRoute from './ProtectedOwnerRoute';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import OwnerStationsPage from '../pages/OwnerStationsPage';
import OwnerProductsPage from '../pages/OwnerProductsPage';
import OwnerReviewsPage from '../pages/OwnerReviewsPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import HomeRedirect from '../components/HomeRedirect';
import AdminStationsPage from '../pages/AdminStationsPage';
import AdminProductsPage from '../pages/AdminProductsPage';
import AdminReviewsPage from '../pages/AdminReviewsPage';
import AdminRefillHistoryPage from '../pages/AdminRefillHistoryPage';
import AdminRefillStatisticsPage from '../pages/AdminRefillStatisticsPage';
import AdminFavoritesPage from '../pages/AdminFavoritesPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ProductStationsPage from '../pages/ProductStationsPage';
import NotificationPage from "../pages/NotificationPage";
import ProfilePage from '../pages/ProfilePage';
import ForceChangePasswordPage from '../pages/ForceChangePasswordPage';

/**
 * Route Guard kiểm tra nếu User cần đổi mật khẩu bắt buộc -> Tự động chuyển hướng về /change-password-required
 */
function MustChangePasswordGuard() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.must_change_password && location.pathname !== '/change-password-required') {
                    navigate('/change-password-required', { replace: true });
                }
            } catch (err) {
                console.error(err);
            }
        }
    }, [location.pathname, navigate]);

    return null;
}

function AppRoutes() {

    return (

        <BrowserRouter>
            <MustChangePasswordGuard />

            <Routes>

                <Route
                    path="/"
                    element={<WelcomePage />}
                />
                <Route
                    path="/home"
                    element={<HomeRedirect />}
                />
            
                <Route
                    path="/login"
                    element={<LoginPage />}
                />
                <Route
                    path="/change-password-required"
                    element={<ForceChangePasswordPage />}
                />
                <Route
                    path="/register"
                    element={<RegisterPage />}
                />
                <Route
                    path="/location-permission"
                    element={<LocationPermissionPage />}
                />
                <Route
                    path="/stations/:id"
                    element={<StationDetailPage />}
                />
                <Route
                    path="/favorites"
                    element={<FavoritesPage />}
                />
                <Route
                    path="/search"
                    element={<SearchPage />}
                />
                <Route 
                    path="/products" 
                    element={<ProductsPage />} 
                />
                <Route
                    path="/refill-history"
                    element={<RefillHistoryPage />}
                />
                <Route
                    path="/statistics"
                    element={<StatisticsPage />}
                />
                <Route
                    path="/ocr"
                    element={<OCRPage />}
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedAdminRoute>
                            <AdminDashboardPage />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/owner"
                    element={
                        <ProtectedOwnerRoute>
                            <OwnerDashboardPage />
                        </ProtectedOwnerRoute>
                    }
                />
                <Route
                    path="/owner/stations"
                    element={
                        <ProtectedOwnerRoute>
                            <OwnerStationsPage />
                        </ProtectedOwnerRoute>
                    }
                />
                <Route
                    path="/owner/products"
                    element={
                        <ProtectedOwnerRoute>
                            <OwnerProductsPage />
                        </ProtectedOwnerRoute>
                    }
                />
                <Route
                    path="/owner/reviews"
                    element={
                        <ProtectedOwnerRoute>
                            <OwnerReviewsPage />
                        </ProtectedOwnerRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedAdminRoute>
                            <AdminUsersPage />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/stations"
                    element={
                        <ProtectedAdminRoute>
                            <AdminStationsPage />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/products"
                    element={
                        <ProtectedAdminRoute>
                            <AdminProductsPage />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/reviews"
                    element={
                        <ProtectedAdminRoute>
                            <AdminReviewsPage />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/refills"
                    element={
                        <ProtectedAdminRoute>
                            <AdminRefillHistoryPage />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/refills/statistics"
                    element={
                        <ProtectedAdminRoute>
                            <AdminRefillStatisticsPage />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/favorites"
                    element={
                        <ProtectedAdminRoute>
                            <AdminFavoritesPage />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                />
                <Route
                    path="/products/:productName"
                    element={<ProductStationsPage />}
                    />
                <Route
                    path="/notifications"
                element={<NotificationPage />}
                />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                    path="/admin/profile"
                    element={
                        <ProtectedAdminRoute>
                            <ProfilePage />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/owner/profile"
                    element={
                        <ProtectedOwnerRoute>
                            <ProfilePage />
                        </ProtectedOwnerRoute>
                    }
                />

                </Routes>
                

        </BrowserRouter>

    );

}

export default AppRoutes;