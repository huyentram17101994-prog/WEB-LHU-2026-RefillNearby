import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../services/api';

function LoginPage() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);





    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await api.post(
                '/auth/login',
                {
                    email,
                    password
                }
            );
            console.log(response.data);
            localStorage.setItem(
                'token',
                response.data.token
            );
            localStorage.setItem(
    'role',
    response.data.user.role
);
localStorage.setItem(
    'user',
    JSON.stringify(response.data.user)
);
console.log(
    'Role:',
    response.data.user.role
);

            alert('Đăng nhập thành công 😄');

           const role = response.data.user.role;

if (role === 'admin') {
    navigate('/admin');
}
else if (role === 'store_owner') {
    navigate('/owner');
}
else {
    navigate('/location-permission');
}
        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message
                || 'Login failed'
            );

        } finally {

            setLoading(false);

        }

    };





    return (

        <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 flex items-center justify-center px-6">

            {/* CARD */}

            <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[40px] p-10 w-full max-w-md">

                {/* HEADER */}

                <div className="text-center mb-10">

                    <div className="text-7xl mb-4">
                        🌱
                    </div>

                    <h1 className="text-4xl font-extrabold text-green-700">

                        Refill Nearby

                    </h1>

                    <p className="text-gray-600 mt-3">

                        Đăng nhập để tiếp tục hành trình sống xanh
                    </p>

                </div>





                {/* FORM */}

                <form
                    onSubmit={handleLogin}
                    className="space-y-6"
                >

                    {/* EMAIL */}

                    <div>

                        <label className="block mb-2 text-gray-700 font-medium">

                            Email

                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-200 bg-white/80"
                            required
                        />

                    </div>





                    {/* PASSWORD */}

                    <div>

                        <label className="block mb-2 text-gray-700 font-medium">

                            Mật khẩu

                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-200 bg-white/80"
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-4 top-4 text-gray-500"
                            >

                                {
                                    showPassword
                                        ? '🙈'
                                        : '👁️'
                                }

                            </button>

                        </div>

                    </div>





                    {/* REMEMBER */}

                    <div className="flex items-center justify-between text-sm">

                        <label className="flex items-center gap-2 text-gray-600">

                            <input type="checkbox" />

                            Ghi nhớ đăng nhập



                        </label>





                        <p
    onClick={() =>
        navigate('/forgot-password')
    }
    className="
        text-center
        text-green-600
        mt-4
        cursor-pointer
        hover:underline
    "
>

    Quên mật khẩu?

</p>

                       

                    </div>





                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg hover:scale-105 transition duration-300 disabled:opacity-50"
                    >

                        {
                            loading
                                ? 'Loading...'
                                : 'Login'
                        }

                    </button>

                </form>





                {/* REGISTER */}

                <p className="text-center text-gray-600 mt-8">

                    Chưa có tài khoản?

                    <button
                        onClick={() => navigate('/register')}
                        className="text-green-700 font-semibold ml-2 hover:underline"
                    >

                        Đăng ký

                    </button>

                </p>

            </div>

        </div>

    );

}

export default LoginPage;