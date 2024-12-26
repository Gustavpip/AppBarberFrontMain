import { useState } from 'react';
import api from '../axiosConfig';

const useBlockAppointments = () => {
  const [loading, setLoading] = useState(false);

  const blockAppointments = async (data: any) => {
    setLoading(true);

    try {
      const response = await api.put('/api/block/appointments', data);

      if (response.status === 200 || response.data.success === true) {
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

  return { blockAppointments, loading };
};

export default useBlockAppointments;
