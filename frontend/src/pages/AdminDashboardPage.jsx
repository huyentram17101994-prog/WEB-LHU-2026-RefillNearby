import { useEffect, useState } from 'react';

import api from '../services/api';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

function AdminDashboardPage() {


    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);

    const fetchDashboard = async () => {

        try {

            const response = await api.get(
                '/admin/dashboard'
            );

            setDashboard(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchDashboard();

    }, []);

    if (!dashboard) {

        return (

            <div className="text-center mt-20 text-3xl">

                Loading...

            </div>

        );

    }
const logout = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('role');

        navigate('/login');

    };
    return (

        <div className="max-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">

             <div className="max-w-7xl mx-auto">
                <div className="flex items justify-between mb-10">
                    <h1 className="text-5xl text-center font-bold text-green-700">
                        📊 Dashboard Admin
                    </h1>
               <button
                        onClick={logout}
                        className="
                        
                          flex items-center gap-2
                            px-4 py-2
                            bg-red-500
                            hover:bg-red-700
                            text-white
                            rounded-lg
                        "
                    >
                        <RiLogoutCircleRLine size={22} />
                        Đăng xuất
                    </button>
                    </div>
              
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div
    onClick={() =>
        navigate('/admin/users')
    }
    className="
        bg-white
        p-8
        rounded-3xl
        shadow
        cursor-pointer
        hover:shadow-xl
        hover:scale-105
        transition
    "
>

    <h2 className="text-xl font-bold">

        👤 Người dùng

    </h2>

    <p className="text-5xl font-bold text-blue-500 mt-4">

        {dashboard.totalUsers}

    </p>

</div>

                 
    
                                           <div
    onClick={() =>
        navigate('/admin/stations')
    }
    className="
        bg-white
        p-8
        rounded-3xl
        shadow
        cursor-pointer
        hover:shadow-xl
        hover:scale-105
        transition
    "
>
                 <h2 className="text-xl font-bold">

                 🏪 Trạm refill

                </h2>

                        <p className="text-5xl font-bold text-green-500 mt-4">

                            {dashboard.totalStations}

                        </p>

                    </div>

                    

                 
                 <div
                    onClick={() =>
                     navigate('/admin/products')
                     }
                     className="
                        bg-white
                        p-8
                        rounded-3xl
                        shadow
                        cursor-pointer
                        hover:shadow-xl
                        hover:scale-105
                        transition
                        "
                >
    <h2 className="text-xl font-bold">

                  📦 Sản Phẩm

                </h2>
                        <p className="text-5xl font-bold text-green-500 mt-4">
                            {dashboard.totalProducts}
                        </p>
                    </div>
               
                <div
                    onClick={() =>
                        navigate('/admin/refills')
                    }
                    className="
                        bg-white
                        p-8
                        rounded-3xl
                        shadow
                        cursor-pointer
                        hover:shadow-xl
                        hover:scale-105
                        transition
                    "
                >
                    <h2 className="text-xl font-bold">

                        ♻️ Lượt refill

                    </h2>

                    <p className="text-5xl font-bold text-emerald-500 mt-4">

                        {dashboard.totalRefills}

                    </p>
                     </div>
                  <div
    onClick={() =>
        navigate('/admin/refills/statistics')
    }
    className="
        bg-white
        p-8
        rounded-3xl
        shadow
        cursor-pointer
        hover:shadow-xl
        hover:scale-105
        transition
    "
>

    <h2 className="text-xl font-bold">
        💧 Tổng lượng refill
    </h2>

    <p className="text-5xl font-bold text-emerald-500 mt-4">
        {dashboard.totalQuantity} L
    </p>

</div>

                
            

                <div
                    onClick={() =>
                        navigate('/admin/favorites')
                    }
                    className="
                        bg-white
                        p-8
                        rounded-3xl
                        shadow
                        cursor-pointer
                        hover:shadow-xl
                        hover:scale-105
                        transition
                    "
                >
                    <h2 className="text-xl font-bold">

                        ❤️ Yêu thích

                    </h2>

                    <p className="text-5xl font-bold text-red-500 mt-4">

                        {dashboard.totalFavorites}

                    </p>
                </div>

                <div
                    onClick={() =>
                        navigate('/admin/reviews')
                    }
                    className="
                        bg-white
                        p-8
                        rounded-3xl
                        shadow
                        cursor-pointer
                        hover:shadow-xl
                        hover:scale-105
                        transition
                    "
                >
                    <h2 className="text-xl font-bold">

                  ⭐ Đánh Giá

                </h2>
                        <p className="text-5xl text-yellow-500 font-bold mt-4">
                            {dashboard.totalReviews}
                        </p>
                    </div>
               
                     </div>
                </div>
            </div>

      

    );

}

export default AdminDashboardPage;
       