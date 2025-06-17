import axios from "axios";


const API = `${import.meta.env.VITE_APP_API}/api`;

const api = axios.create({
    baseURL: API,
    withCredentials: true
});

export const login = async (loginOrEmail, password) => {
    const res = await api.post('/login', { loginOrEmail, password });
    return res.data;
};

export const logout = async () => {
    await api.post('/logout');
}

export const getUser = async () => {
    const res = await api.get('/user');
    return res.data;
}

export const register = async ({ email, login, password, imageFile }) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('login', login);
    formData.append('password', password);
    if (imageFile) formData.append('image', imageFile);
    const res = await api.post('/register', formData);
    return res.data;
};


export const updatePassword = async (email) => {
    const res = await api.post('/updatepassword', { email });
    return res.data;
}

export async function verifyResetCode(email, code) {
    const res = await api.post('/verifycode', { email, code });
    return res.data;

}

export async function resetPassword(email, code, newPassword) {
    const res = await api.post('/resetpassword', { email, code, newPassword });
    return res.data;
}

export const getUsers = async () => {
    const res = await api.get('/users');
    console.log("list of users :", res.data);
    return res.data;
};


export const updateUser = async (id, data, isMultipart = false) => {
    let config = {};
    if (isMultipart) {
        config.headers = {};
    }
    const res = await api.put(`/users/${id}`, data, config);
    return res.data;
};


export const deleteUser = async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
};