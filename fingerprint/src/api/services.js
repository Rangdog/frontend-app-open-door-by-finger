import axios from "axios";
import axiosInstance from "../api/api";
import { da } from "date-fns/locale";

const API_URL = "http://localhost:8080/api"; // Địa chỉ API của bạn

export const login = async(username, password) => {
    try{
        const response = await axiosInstance.post("/auth/login", {username, password});
        console.log(response)
        return response.data;
    }
    catch(error){
        console.log(error);
        throw (error)
    }
}

export const register = async(username, password, email) => {
    try{
        const response = await axiosInstance.post("/auth/register", {username, password, email});
        return response.data;
    }
    catch(error){
        throw (error)
    }
}
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
    const response = await axiosInstance.put(`/door/${id}`, doorData);
    return response.data;
};

export const deleteDoor = async (id) => {
    await axiosInstance.delete(`/door/${id}`);
};

// Member Service
export const getMembers = async () => {
    const response = await axios.get(`${API_URL}/members`);
    return response.data;
};

export const createMember = async (memberData) => {
    console.log(memberData.name)
    const response = await axiosInstance.post(`/members`, memberData, {
        headers: {
            'Content-Type' : "multipart/form-data"
        }
    });
    return response.data;
};

export const updateMember = async (id, memberData) => {
    const response = await axiosInstance.put(`/members/${id}`, memberData,{
        headers: {
            'Content-Type' : "multipart/form-data"
        }
    });
    return response.data;
};

export const deleteMember = async (id) => {
    await axiosInstance.delete(`/members/${id}`);
};

// History Service
export const getHistories = async () => {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
};

export const createHistory = async (historyData) => {
    const response = await axiosInstance.post(`/history`, historyData);
    return response.data;
};

export const updateHistory = async (id, historyData) => {
    const response = await axiosInstance.put(`/history/${id}`, historyData);
    return response.data;
};

export const deleteHistory = async (id) => {
    await axiosInstance.delete(`/history/${id}`);
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
    const response = await axiosInstance.put(`/detail-verify/${id}`, detailVerifyData);
    return response.data;
};

export const deleteDetailVerify = async (doorId,memberId) => {
    await axios.axiosInstance(`/detail-verify/delete`, {
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
      const response = await axiosInstance.post(`/door/${doorId}/verify`, formData, {
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
      const response = await axiosInstance.post(`/door/${doorId}/verify2`, formData, {
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

export const getHistoryByMemberID = async (memberID) => {
    const response = await axiosInstance.get(`/history/member/${memberID}`);
    return response.data;
};

export const ResetFingerPrint = async () => {
    const response = await axiosInstance.post('/other');
    return response.data;
}

export const getMemberForDoor = async (id) => {
    if(!id){
        return null;
    }
    const response = await axiosInstance.get(`/members/underperformed`, {
        params: {
            doorId: id
        }
    });
    return response.data;
}

export const getHistoriesFalse = async () => {
    const response = await axiosInstance.get('/historyfalse');
    console.log(response.data)
    return response.data;
}


export const updatePassword  = async (id, data) => {
    const response = await axiosInstance.put(`/door/${id}/password`,
        data
    );
    console.log(response.data);
    return response.data;
}

export const openDoorByPassword = async (id,data) => {
    const response = await axiosInstance.post(`/door/${id}/opendoor/password`,
       data
    );
    console.log(response.data);
    return response.data;
}
