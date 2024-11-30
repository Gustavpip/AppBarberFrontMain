import { useState } from 'react';
import api from '../axiosConfig';

const useScheduling = () => {
  const [loading, setLoading] = useState(false);

  const createScheduling = async (data: any) => {
    setLoading(true);

    try {
      const response = await api.post(`/api/scheduling/`, data);

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
  return { createScheduling, loading };
};

export default useScheduling;
