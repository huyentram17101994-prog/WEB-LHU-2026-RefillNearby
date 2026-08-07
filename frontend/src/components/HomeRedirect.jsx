import { Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';

function HomeRedirect() {
    const role = localStorage.getItem('role');

    if (role === 'store_owner') {
        return <Navigate to="/owner" replace />;
    }

    if (role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    return <HomePage />;
}

export default HomeRedirect;