import { useState } from 'react';
import api from '../axiosConfig';

const useGetAppointment = () => {
  const [loading, setLoading] = useState(false);

  const getAppointment = async (id?: string) => {
    let url = `/api/appointment/${id}`;
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
  return { getAppointment, loading };
};

export default useGetAppointment;
