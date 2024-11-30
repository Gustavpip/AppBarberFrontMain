import { useState } from 'react';
import api from '../axiosConfig';

const useBarberDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteBarber = async (data: any) => {
    setLoading(true);

    try {
      const response = await api.delete('/api/barber', { data });

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
  return { deleteBarber, loading };
};

export default useBarberDelete;
