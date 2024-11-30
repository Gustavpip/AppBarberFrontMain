import { useState } from 'react';
import api from '../axiosConfig';

const useServiceRegister = () => {
  const [loading, setLoading] = useState(false);

  const createService = async (data: any) => {
    setLoading(true);

    try {
      const response = await api.post('/api/service', data);

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
  return { createService, loading };
};

export default useServiceRegister;
