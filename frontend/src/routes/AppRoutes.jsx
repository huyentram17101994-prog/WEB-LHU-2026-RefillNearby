import {
    BrowserRouter,
    Routes,
    Route
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
function AppRoutes() {

    return (

        <BrowserRouter>

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

                </Routes>
                

        </BrowserRouter>

    );

}

export default AppRoutes;