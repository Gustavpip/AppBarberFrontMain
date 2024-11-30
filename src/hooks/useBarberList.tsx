import { useState } from 'react';
import api from '../axiosConfig';

const useBarberList = () => {
  const [loading, setLoading] = useState(false);

  const getBarbers = async (id?: string) => {
    let url = `${id ? '/api/barber/' + id : '/api/barber'}`;
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
  return { getBarbers, loading };
};

export default useBarberList;
