import { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser } from '../api';

function UsersList({ onClose, setAlert, isAdmin = true }) {
    const [users, setUsers] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({});
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (err) {
                alert('Failed to fetch users');
            }
        };
        fetchUsers();
    }, []);

    const handleEdit = (idx) => {
        setEditIndex(idx);
        setEditData({ ...users[idx], password: '' });
        setImageFile(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setEditData((prev) => ({
                ...prev,
                image: URL.createObjectURL(file)
            }));
        }
    };

    const handleSave = async (idx) => {
        try {
            const userId = users[idx]._id || users[idx].id;
            let updated;
            if (imageFile) {
                const formData = new FormData();
                formData.append('email', editData.email);
                formData.append('login', editData.login);
                formData.append('role', editData.role);
                if (editData.password) formData.append('password', editData.password);
                formData.append('image', imageFile);
                updated = await updateUser(userId, formData, true);
            } else {
                const dataToSend = { ...editData };
                if (!editData.password) delete dataToSend.password;
                updated = await updateUser(userId, dataToSend);
            }
            const newUsers = [...users];
            newUsers[idx] = updated;
            setUsers(newUsers);
            setEditIndex(null);
            setImageFile(null);
            setAlert({ type: 'success', message: 'User updated successfully!' });
        } catch (err) {
            setAlert({ type: 'error', message: 'Failed to update user' });
        }
    };

    const handleDelete = async (idx) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const userId = users[idx]._id || users[idx].id;
                await deleteUser(userId);
                const newUsers = users.filter((_, i) => i !== idx);
                setUsers(newUsers);
                setEditIndex(null);
                setAlert({ type: 'success', message: 'User deleted successfully!' });
            } catch (err) {
                setAlert({ type: 'error', message: 'Failed to delete user' });
            }
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1em' }}>Users List</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Login</th>
                        <th>Password</th>
                        <th>Image</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, idx) => (
                        <tr key={u._id || u.id}>
                            <td>
                                {editIndex === idx ? (
                                    <input
                                        name="email"
                                        value={editData.email}
                                        onChange={handleChange}
                                        className="neumorph-input"
                                        style={{
                                            padding: '0.3em 0.7em',
                                            fontSize: '0.95em',
                                            minWidth: 170,
                                            maxWidth: 180
                                        }}
                                    />
                                ) : (
                                    u.email
                                )}
                            </td>
                            <td>
                                {editIndex === idx ? (
                                    <input
                                        name="login"
                                        value={editData.login}
                                        onChange={handleChange}
                                        className="neumorph-input"
                                        style={{
                                            padding: '0.3em 0.7em',
                                            fontSize: '0.95em',
                                            minWidth: 60,
                                            maxWidth: 70
                                        }}
                                    />
                                ) : (
                                    u.login
                                )}
                            </td>

                            <td>
                                {editIndex === idx ? (
                                    isAdmin ? (
                                        <input
                                            name="password"
                                            type="text"
                                            value={editData.password}
                                            onChange={handleChange}
                                            className="neumorph-input"
                                            style={{
                                                padding: '0.3em 0.7em',
                                                fontSize: '0.95em',
                                                minWidth: 80,
                                                maxWidth: 90
                                            }}
                                            placeholder="New password"
                                        />
                                    ) : (
                                        <span>******</span>
                                    )
                                ) : (
                                    isAdmin ? <span>******</span> : <span>******</span>
                                )}
                            </td>

                            <td>
                                {editIndex === idx ? (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="neumorph-input"
                                            style={{
                                                padding: 0,
                                                minWidth: 180,
                                                maxWidth: 200
                                            }}
                                            onChange={handleImageChange}
                                        />
                                        {editData.image && (
                                            <img
                                                src={editData.image.startsWith('blob:') ? editData.image : `http://localhost:5000/${editData.image}`}
                                                alt="Preview"
                                                style={{ marginTop: 10, width: 32, height: 32, borderRadius: '50%' }}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <img src={`http://localhost:5000/${u.image}`} alt="profile" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                )}
                            </td>

                            <td>
                                {editIndex === idx ? (
                                    <select
                                        name="role"
                                        value={editData.role}
                                        onChange={handleChange}
                                        className="neumorph-input"
                                        style={{
                                            padding: '0.3em 0.7em',
                                            fontSize: '0.95em',
                                            minWidth: 90,
                                            maxWidth: 90
                                        }}
                                    >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                ) : (
                                    u.role
                                )}
                            </td>

                            <td style={{ whiteSpace: 'nowrap' }}>
                                {editIndex === idx ? (
                                    <button
                                        className="neumorph-btn"
                                        style={{ padding: '0.5em 0.9em', fontSize: '0.95em', minWidth: 60 }}
                                        onClick={() => handleSave(idx)}
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="neumorph-btn"
                                            style={{
                                                padding: '0.5em 0.9em',
                                                fontSize: '0.95em',
                                                minWidth: 60,
                                                maxWidth: 70
                                            }}
                                            onClick={() => handleEdit(idx)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="neumorph-btn"
                                            style={{
                                                marginLeft: 6,
                                                background: '#e74c3c',
                                                color: '#fff',
                                                padding: '0.3em 0.7em',
                                                fontSize: '0.95em',
                                                minWidth: 60,
                                                maxWidth: 70
                                            }}
                                            onClick={() => handleDelete(idx)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="close-btn" onClick={onClose} style={{ marginTop: '1em' }}>✖</button>
        </div >
    );
}

export default UsersList;