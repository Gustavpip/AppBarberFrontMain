import { useState } from 'react';
import api from '../axiosConfig';

const useGetService = () => {
  const [loading, setLoading] = useState(false);

  const getService = async (serviceId: string) => {
    let url = `/api/service/${serviceId}`;
    setLoading(true);

    try {
      const response = await api.get(url);

      if (response.request.status === 200 || response.data.success === true) {
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
  return { getService, loading };
};

export default useGetService;
