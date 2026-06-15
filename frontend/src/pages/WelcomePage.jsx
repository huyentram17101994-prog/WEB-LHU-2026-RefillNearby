import { useNavigate } from 'react-router-dom';

function WelcomePage() {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 flex items-center justify-center px-6">

            {/* CARD */}

            <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-[40px] p-12 w-full max-w-md text-center border border-white/50">

                {/* LOGO */}

                <div className="text-8xl mb-6">
                    🌱
                </div>

                {/* TITLE */}

                <h1 className="text-5xl font-extrabold text-green-700 mb-4 tracking-tight">

                    Refill Nearby

                </h1>

                {/* SUBTITLE */}

                <p className="text-gray-600 text-lg leading-relaxed mb-10">

                    Tìm các trạm refill gần bạn
                    và sống xanh mỗi ngày.

                </p>

                {/* BUTTONS */}

                <div className="space-y-5">

                    {/* LOGIN */}

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg hover:scale-105 transition duration-300"
                    >

                        Đăng Nhập

                    </button>

                    {/* REGISTER */}

                    <button
                        onClick={() => navigate('/register')}
                        className="w-full bg-white hover:bg-gray-100 text-green-700 border-2 border-green-600 py-4 rounded-2xl text-lg font-semibold transition duration-300"
                    >

                        Đăng Ký

                    </button>

                </div>

                {/* FOOTER */}

                <p className="text-sm text-gray-500 mt-10">

                    Sống xanh hơn mỗi ngày 🌿

                </p>

            </div>

        </div>

    );

}

export default WelcomePage;