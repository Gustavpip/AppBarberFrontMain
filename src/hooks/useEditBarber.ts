import { useState } from 'react';
import api from '../axiosConfig';

const useBarberEdit = () => {
  const [loading, setLoading] = useState(false);

  const updateBarber = async (data: any) => {
    setLoading(true);

    try {
      const response = await api.put('/api/barber', data);

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
  return { updateBarber, loading };
};

export default useBarberEdit;
