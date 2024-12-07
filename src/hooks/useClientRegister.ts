import { useState } from 'react';
import api from '../axiosConfig';

const useClientRegister = () => {
  const [loading, setLoading] = useState(false);

  const createClient = async (data: any, token: string) => {
    setLoading(true);

    try {
      const response = await api.post(`/api/client/${token}`, data);

      if (response.request.status === 201 || response.data.success === true) {
        return { success: true, data: response };
      } else {
        return { success: false, data: response };
      }
    } catch (err: any) {
      return { success: false, data: err };
    } finally {
      setLoading(false);
    }
  };
  return { createClient, loading };
};

export default useClientRegister;
