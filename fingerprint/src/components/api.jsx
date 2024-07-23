import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // URL của API Spring Boot

export const getDoors = async () => {
    try {
        const response = await axios.get(`${API_URL}/doors`);
        return response.data;
    } catch (error) {
        throw new Error('Không thể lấy danh sách cửa: ' + error.message);
    }
};

export const getMembers = async () => {
    try {
        const response = await axios.get(`${API_URL}/members`);
        return response.data;
    } catch (error) {
        throw new Error('Không thể lấy danh sách thành viên: ' + error.message);
    }
};

// Phương thức để thêm thành viên
export const addMember = async (name) => {
    try {
        const response = await axios.post(`${API_URL}/members`, { name });
        return response.data;
    } catch (error) {
        throw new Error('Không thể thêm thành viên: ' + error.message);
    }
};

// Phương thức để cập nhật thành viên
export const updateMember = async (id, name) => {
    try {
        const response = await axios.put(`${API_URL}/members/${id}`, { name });
        return response.data;
    } catch (error) {
        throw new Error('Không thể cập nhật thành viên: ' + error.message);
    }
};

// Phương thức để xóa thành viên
export const deleteMember = async (id) => {
    try {
        await axios.delete(`${API_URL}/members/${id}`);
    } catch (error) {
        throw new Error('Không thể xóa thành viên: ' + error.message);
    }
};

// Phương thức để lấy lịch sử
export const getHistory = async () => {
    try {
        const response = await axios.get(`${API_URL}/histories`);
        return response.data;
    } catch (error) {
        throw new Error('Không thể lấy lịch sử: ' + error.message);
    }
};

// Phương thức để thêm lịch sử
export const addHistory = async (detail) => {
    try {
        const response = await axios.post(`${API_URL}/histories`, { detail_verify_id: detail });
        return response.data;
    } catch (error) {
        throw new Error('Không thể thêm lịch sử: ' + error.message);
    }
};

// Phương thức để cập nhật lịch sử
export const updateHistory = async (id, detail) => {
    try {
        const response = await axios.put(`${API_URL}/histories/${id}`, { detail_verify_id: detail });
        return response.data;
    } catch (error) {
        throw new Error('Không thể cập nhật lịch sử: ' + error.message);
    }
};

// Phương thức để xóa lịch sử
export const deleteHistory = async (id) => {
    try {
        await axios.delete(`${API_URL}/histories/${id}`);
    } catch (error) {
        throw new Error('Không thể xóa lịch sử: ' + error.message);
    }
};