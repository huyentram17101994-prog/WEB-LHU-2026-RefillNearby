import { useEffect, useState } from 'react';
import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
function AdminUsersPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] =useState('');

    useEffect(() => {

        loadUsers();

    }, []);

    const loadUsers = async () => {

        try {

            const res =
                await api.get('/admin/users');
             console.log(res.data);
            setUsers(res.data);

        } catch (error) {

            console.log(error);

        }

    };
const [search, setSearch] = useState('');
const filteredUsers = users.filter(user => {

    const matchSearch =

        user.full_name
            .toLowerCase()
            .includes(search.toLowerCase())

        ||

        user.email
            .toLowerCase()
            .includes(search.toLowerCase());

    const matchRole =

        roleFilter === ''

        ||

        user.role === roleFilter;

    return matchSearch && matchRole;

});
const toggleStatus = async (user) => {

    try {

        await api.put(
            `/admin/users/${user.user_id}/toggle-status`
        );

        loadUsers();

    } catch (error) {

        console.log(error);

        alert("Không thể cập nhật trạng thái.");

    }

};
const deleteUser = async (id) => {

    if (!window.confirm('Xóa người dùng này?')) {

        return;

    }

    try {

        await api.delete(`/admin/users/${id}`);

        loadUsers();

    } catch (error) {

        console.log(error);

    }

};
    return (

        <div className="max-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">
 {/* BACK BUTTON */}
                    <button
            onClick={() => navigate(-1)}
            className="
                flex items-center gap-2
                mb-8
                ml-2
                px-5 py-3
                bg-white
                rounded-full
                shadow-md
                hover:shadow-lg
                hover:bg-gray-50
                transition-all
                duration-200
                text-base
                font-semibold
                text-gray-700
            "
        >
            <IoChevronBack size={22} />
            Quay lại
        </button>
            <div className="max-w-7xl mx-auto">
           
                <h1 className="text-4xl text-center text-green-500 font-bold mb-8">

                    👤 Quản lý người dùng

                </h1>
                <div className="flex gap-4 mb-6">

    <input
        type="text"
        placeholder="🔍 Tìm tên hoặc email..."
        value={search}
        onChange={(e) =>
            setSearch(e.target.value)
        }
        className="
            flex-1
            bg-white
            border
            border-gray-200
            rounded-2xl
            px-4
            py-3
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-green-400

        "
    />

    <select
        value={roleFilter}
        onChange={(e) =>
            setRoleFilter(e.target.value)
        }
        className="
        text-center
        bg-white
        border
        border-gray-200
        rounded-2xl
        px-4
        py-3
        shadow-sm
        text-gray-700
        appearance-none
        focus:outline-none
        focus:ring-2
        focus:ring-green-400
        focus:border-green-400
        min-w-[160px]
        "
    >
        <option value="">
            Tất cả vai trò
        </option>

        <option value="admin">
            Admin
        </option>

        <option value="store_owner">
            Chủ trạm
        </option>

        <option value="user">
            Người dùng
        </option>

    </select>

</div>
                <div className="bg-white rounded-xl shadow p-6">

                    <div className="bg-white rounded-3xl shadow-lg p-6">

<table className="w-full overflow-hidden">
    <thead>

        <tr className="bg-green-50 text-green-700">

            <th className="p-4 text-left">ID</th>
<th className="p-4 text-left">Họ tên</th>
<th className="p-4 text-left">Email</th>
<th className="p-4 text-left">Vai trò</th>
<th className="p-4 text-left">Trạng thái</th>
<th className="p-4 text-left">Ngày tạo</th>

<th className="p-4 text-ri">Thao tác</th>

        </tr>

    </thead>

    <tbody>

        {filteredUsers.map(user => (

            <tr
    key={user.user_id}
    className="
        border-b
border-gray-200
hover:bg-green-50
        transition
    "
>

                <td className="p-4">{user.user_id}</td>

                <td className="p-4">{user.full_name}</td>

                <td className="p-4">{user.email}</td>

                <td className="p-4">

    {user.role === 'admin' && (

        <span className="
            px-3 py-1
            rounded-full
            bg-purple-100
            text-purple-700
            font-semibold
            text-sm
        ">
            admin
        </span>

    )}

    {user.role === 'store_owner' && (

        <span className="
            px-3 py-1
            rounded-full
            bg-blue-100
            text-blue-700
            font-semibold
            text-sm
        ">
            store_owner
        </span>

    )}

    {user.role === 'user' && (

        <span className="
            px-3 py-1
            rounded-full
            bg-green-100
            text-green-700
            font-semibold
            text-sm
        ">
            user
        </span>

    )}

</td>
<td className="p-4">

    {user.status === "active" ? (

        <span className="
            bg-green-100
            text-green-700
            px-3
            py-1
            rounded-full
            text-sm
            font-semibold
        ">
            🟢 Hoạt động
        </span>

    ) : (

        <span className="
            bg-red-100
            text-red-700
            px-3
            py-1
            rounded-full
            text-sm
            font-semibold
        ">
            🔴 Đã khóa
        </span>

    )}

</td>
<td className="p-4">
    {
        new Date(user.created_at)
        .toLocaleDateString('vi-VN')
    }
</td>
             <td className="p-4 text-center">

    {user.role === "admin" ? (

        <span className="text-gray-400 italic">

            Không thể thao tác

        </span>

    ) : (

        <div className="flex justify-center items-center gap-2">

            <button

                onClick={() => toggleStatus(user)}

                className={`
                    px-4
                    py-2
                    rounded-xl
                    text-white
                    font-semibold
                    ${
                        user.status === "active"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-500 hover:bg-green-600"
                    }
                `}
            >

                {user.status === "active"

                    ? "Khóa "

                    : "Mở khóa"}

            </button>

            <button

                onClick={() => deleteUser(user.user_id)}

                className="
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    px-4
                    py-2
                    rounded-xl
                    font-semibold
                "

            >

                 Xóa

            </button>

        </div>

    )}

</td>
            </tr>

        ))}

    </tbody>

</table>
</div>

                </div>

            </div>

        </div>

    );

}

export default AdminUsersPage;