import { useState } from 'react';
import api from '../axiosConfig';

const useBarberRegister = () => {
  const [loading, setLoading] = useState(false);

  const createBarber = async (data: any) => {
    setLoading(true);

    try {
      const response = await api.post('/api/barber', data);

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
  return { createBarber, loading };
};

export default useBarberRegister;
