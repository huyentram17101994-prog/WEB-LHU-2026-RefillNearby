import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

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
            min-h-screen
            flex
            items-center
            justify-center
            bg-gray-100
        ">

            <form
                onSubmit={handleSubmit}
                className="
                    bg-white
                    p-8
                    rounded-3xl
                    shadow-lg
                    w-[400px]
                "
            >

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
                        rounded-xl
                        p-3
                        mb-4
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
                        rounded-xl
                        p-3
                        mb-6
                    "
                />

                <button
                    className="
                        w-full
                        bg-green-500
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