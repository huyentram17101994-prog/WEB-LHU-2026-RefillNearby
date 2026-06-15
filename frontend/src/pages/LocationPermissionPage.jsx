import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

function LocationPermissionPage() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleAllowLocation = () => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(

            (position) => {
                console.log(position.coords);
                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;





                // save localStorage

                localStorage.setItem(
                    'latitude',
                    latitude
                );

                localStorage.setItem(
                    'longitude',
                    longitude
                );





                alert('Đã cho phép truy cập vị trí  😄');

                navigate('/home');

            },





            (error) => {
                setLoading(false);
                console.log(error);

                alert(
                    'Quyền truy cập vị trí bị từ chối 😞'
                );

            }

        );

    };





    return (

        <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 flex items-center justify-center px-6">

            {/* CARD */}

            <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[40px] p-10 w-full max-w-md text-center">

                {/* ICON */}

                <div className="text-8xl mb-6">
                    📍
                </div>





                {/* TITLE */}

                <h1 className="text-4xl font-extrabold text-green-700 mb-5">

                    {
                        loading
                            ? 'Đang lấy vị trí...'
                            : 'Cho phép vị trí'
                    }
                </h1>





                {/* DESCRIPTION */}

                <p className="text-gray-600 text-lg leading-relaxed mb-10">

                    Cho phép truy cập vị trí để tìm các trạm refill gần bạn.
                    

                </p>





                {/* BUTTON */}

                <button
                    onClick={handleAllowLocation}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg hover:scale-105 transition duration-300"
                >

                    Cho phép vị trí

                </button>





                {/* SKIP */}

                <button
                    onClick={() => navigate('/home')}
                    className="mt-5 text-gray-500 hover:text-green-700"
                >

                    Bỏ qua

                </button>

            </div>

        </div>

    );

}

export default LocationPermissionPage;