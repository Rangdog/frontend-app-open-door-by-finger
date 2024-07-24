import axios from "axios";

const API_URL = "http://localhost:8080/api"; // Địa chỉ API của bạn

export const getDoors = async () => {
    const response = await axios.get(`${API_URL}/doors`);
    return response.data;
};

export const getMembers = async () => {
    const response = await axios.get(`${API_URL}/members`);
    return response.data;
};

export const getHistory = async () => {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
};

export const getDetailVerify = async (historyId) => {
    const response = await axios.get(`${API_URL}/detail_verify/${historyId}`);
    return response.data;
};