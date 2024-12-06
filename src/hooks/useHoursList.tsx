import { useState } from 'react';
import api from '../axiosConfig';

const useHoursList = () => {
  const [loading, setLoading] = useState(false);

  const getHours = async (
    barberShopId: string,
    barbeiroId: string,
    data: string
  ) => {
    let url = '/api/barber/hours';
    setLoading(true);

    try {
      const response = await api.post(url, { barberShopId, barbeiroId, data });

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
  return { getHours, loading };
};

export default useHoursList;
