import { useState } from 'react';
import api from '../axiosConfig';

const useServiceDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteService = async (data: any) => {
    setLoading(true);

    try {
      const response = await api.delete('/api/services', { data });

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
  return { deleteService, loading };
};

export default useServiceDelete;
