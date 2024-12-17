import { useState } from 'react';
import api from '../axiosConfig';
import { ServiceDTO } from '../types/allTypes';

const useServiceEdit = () => {
  const [loading, setLoading] = useState(false);

  const updateService = async (data: Partial<ServiceDTO>) => {
    setLoading(true);

    try {
      const response = await api.put('/api/service', data);

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
  return { updateService, loading };
};

export default useServiceEdit;
