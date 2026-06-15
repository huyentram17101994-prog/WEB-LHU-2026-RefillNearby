import HomePage from '../pages/HomePage';
import OwnerDashboardPage from '../pages/OwnerDashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
function HomeRedirect() {

    const role =
        localStorage.getItem('role');

    if (role === 'store_owner') {

        return <OwnerDashboardPage />;

    }

    if (role === 'admin') {

        return <AdminDashboardPage />;
    }


    return <HomePage />;

}
export default HomeRedirect;