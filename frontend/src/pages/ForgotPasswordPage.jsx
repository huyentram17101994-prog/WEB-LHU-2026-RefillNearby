import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoClose } from "react-icons/io5";

function ForgotPasswordPage() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] =
        useState('');

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post(
                '/auth/forgot-password',
                {
                    email,
                    newPassword
                }
            );

            alert(
                'Đổi mật khẩu thành công'
            );

            navigate('/login');

        } catch (error) {

            alert(
                error.response?.data?.message
                ||
                'Có lỗi xảy ra'
            );

        }

    };

    return (

        <div className="
            max-full mx-auto flex items-center justify-center bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8
        ">

            <form
                onSubmit={handleSubmit}
                className="
                    relative
                    bg-white
                    p-8
                    rounded-3xl
                    shadow-lg
                    w-[400px]
                "
            >
<button
    type="button"
    onClick={() => navigate("/login")}
    className="
        absolute
        top-4
        right-4
        w-9
        h-9
        rounded-full
        hover:bg-gray-100
        text-gray-500
        hover:text-red-500
        transition
        flex
        items-center
        justify-center
    "
>
    <IoClose size={24} />
</button>
                <h1 className="
                    text-3xl
                    font-bold
                    text-center
                    text-green-600
                    mb-6
                ">

                    🔑 Quên mật khẩu

                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    className="
    w-full
    border
    border-gray-300
    rounded-xl
    p-3
    mb-4
    focus:outline-none
    focus:ring-2
    focus:ring-green-400
"
                />

                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(e.target.value)
                    }
                    className="
                        w-full
    border
    border-gray-300
    rounded-xl
    p-3
    mb-4
    focus:outline-none
    focus:ring-2
    focus:ring-green-400
                    "
                />

                <button
                    className="
    w-full
    bg-green-500
    hover:bg-green-600
    transition
    text-white
    py-3
    rounded-xl
    font-semibold
"
                >

                    Đổi mật khẩu

                </button>

            </form>

        </div>

    );

}

export default ForgotPasswordPage;