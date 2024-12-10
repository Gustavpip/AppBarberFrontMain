import { useState } from 'react';
import api from '../axiosConfig';

const useCancelAppointment = () => {
  const [loading, setLoading] = useState(false);

  const cancelAppointment = async (data: any) => {
    setLoading(true);

    try {
      const response = await api.patch('/api/appointment/cancel', data);

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
  return { cancelAppointment, loading };
};

export default useCancelAppointment;
