import axios from "axios";

const API_URL = "http://localhost:8080/api"; // Địa chỉ API của bạn

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});
// Door Service
export const getDoors = async () => {
    const response = await axios.get(`${API_URL}/door`);
    return response.data;
};

export const createDoor = async (doorData) => {
    console.log("Sending data to server:", JSON.stringify(doorData));
    const response = await axiosInstance.post(`/door`, doorData);
    console.log(response.data)
    return response.data;
};

export const updateDoor = async (id, doorData) => {
    const response = await axios.put(`${API_URL}/door/${id}`, doorData);
    return response.data;
};

export const deleteDoor = async (id) => {
    await axios.delete(`${API_URL}/door/${id}`);
};

// Member Service
export const getMembers = async () => {
    const response = await axios.get(`${API_URL}/members`);
    return response.data;
};

export const createMember = async (memberData) => {
    console.log("Sending data to server:", JSON.stringify(memberData));
    const response = await axiosInstance.post(`/members`, memberData);
    return response.data;
};

export const updateMember = async (id, memberData) => {
    const response = await axios.put(`${API_URL}/members/${id}`, memberData);
    return response.data;
};

export const deleteMember = async (id) => {
    await axios.delete(`${API_URL}/members/${id}`);
};

// History Service
export const getHistories = async () => {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
};

export const createHistory = async (historyData) => {
    const response = await axios.post(`${API_URL}/history`, historyData);
    return response.data;
};

export const updateHistory = async (id, historyData) => {
    const response = await axios.put(`${API_URL}/history/${id}`, historyData);
    return response.data;
};

export const deleteHistory = async (id) => {
    await axios.delete(`${API_URL}/history/${id}`);
};

// Detail Verify Service
export const getDetailVerifies = async () => {
    const response = await axios.get(`${API_URL}/detail-verify`);
    return response.data;
};

export const createDetailVerify = async (detailVerifyData) => {
    const response = await axiosInstance.post(`/detail-verify`, detailVerifyData);
    return response.data;
};

export const updateDetailVerify = async (id, detailVerifyData) => {
    const response = await axios.put(`${API_URL}/detail-verify/${id}`, detailVerifyData);
    return response.data;
};

export const deleteDetailVerify = async (id) => {
    await axios.delete(`${API_URL}/detail-verify/${id}`);
};