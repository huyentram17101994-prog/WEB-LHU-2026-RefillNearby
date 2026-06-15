import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../services/api';

function RegisterPage() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');

    const [email, setEmail] = useState('');

    const [phone, setPhone] = useState('');

    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [isOwner, setIsOwner] = useState(false);





    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await api.post(
                '/auth/register',
                {
                    full_name: fullName,
                    email,
                    password,
                    phone,
                    role: isOwner
                    ? 'store_owner'
                    : 'user'
                }
            );

            alert('Register success 🎉');

            navigate('/login');

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message
                || 'Register failed'
            );

        } finally {

            setLoading(false);

        }

    };





    return (

        <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 flex items-center justify-center px-6 py-10">

            {/* CARD */}

            <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[40px] p-10 w-full max-w-md">

                {/* HEADER */}

                <div className="text-center mb-10">

                    <div className="text-7xl mb-4">
                        🌱
                    </div>

                    <h1 className="text-4xl font-extrabold text-green-700">

                        Tạo tài khoản

                    </h1>

                    <p className="text-gray-600 mt-3">

                        Bắt đầu hành trình sống xanh ngay hôm nay

                    </p>

                </div>





                {/* FORM */}

                <form
                    onSubmit={handleRegister}
                    className="space-y-5"
                >

                    {/* FULL NAME */}

                    <div>

                        <label className="block mb-2 text-gray-700 font-medium">

                            Họ và tên


                        </label>

                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) =>
                                setFullName(e.target.value)
                            }
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-200 bg-white/80"
                            required
                        />

                    </div>





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





                    {/* PHONE */}

                    <div>

                        <label className="block mb-2 text-gray-700 font-medium">

                            Số điện thoại


                        </label>

                        <input
                            type="text"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
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


                            {/* OWNER CHECKBOX */}

<div className="flex items-center gap-3">

    <input
        type="checkbox"
        checked={isOwner}
        onChange={(e) =>
            setIsOwner(e.target.checked)
        }
        className="w-5 h-5"
    />

    <label className="text-gray-700">

        Đăng ký tài khoản chủ trạm

    </label>

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
                                : 'Register'
                        }

                    </button>

                </form>





                {/* LOGIN */}

                <p className="text-center text-gray-600 mt-8">

                    Already have an account?

                    <button
                        onClick={() => navigate('/login')}
                        className="text-green-700 font-semibold ml-2 hover:underline"
                    >

                        Login

                    </button>

                </p>

            </div>

        </div>

    );

}

export default RegisterPage;