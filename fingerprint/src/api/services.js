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
    console.log(memberData.name)
    const response = await axios.post(`${API_URL}/members`, memberData, {
        headers: {
            'Content-Type' : "multipart/form-data"
        }
    });
    return response.data;
};

export const updateMember = async (id, memberData) => {
    const response = await axios.put(`${API_URL}/members/${id}`, memberData,{
        headers: {
            'Content-Type' : "multipart/form-data"
        }
    });
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

export const deleteDetailVerify = async (doorId,memberId) => {
    await axios.delete(`${API_URL}/detail-verify/delete`, {
        params: {
            doorId: doorId,
            memberId: memberId
        }
    });
};

//
export const verifyFingerprint = async (doorId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doorId', doorId);
  
    try {
      const response = await axios.post(`${API_URL}/door/${doorId}/verify`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying fingerprint:', error);
      throw error;
    }
  };

  export const verifyFingerprintByModel2 = async (doorId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doorId', doorId);
  
    try {
      const response = await axios.post(`${API_URL}/door/${doorId}/verify2`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying fingerprint:', error);
      throw error;
    }
  };



// Fetch members associated with a specific door
export const getMembersByDoor = async (doorId) => {
    const response = await axiosInstance.get(`/door/${doorId}/members`);
    return response.data;
};

// Fetch history associated with a specific door
export const getHistoryByDoor = async (doorId) => {
    const response = await axiosInstance.get(`/door/${doorId}/history`);
    return response.data;
};


export const ResetFingerPrint = async () => {
    const response = await axiosInstance.post('/other');
    return response.data;
}

export const getMemberForDoor = async (id) => {
    const response = await axios.get(`${API_URL}/members/getmemberfordoor`, {
        params: {
            doorId: id
        }
    });
    return response.data;
}