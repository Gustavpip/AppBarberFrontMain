// src/hooks/useSignin.ts
import { useState } from 'react';
import api from '../axiosConfig';
import { UserDTO } from '../types/allTypes';

const useRecoverPassword = () => {
  const [loading, setLoading] = useState(false);

  const recoverPassword = async (data: Partial<UserDTO>) => {
    setLoading(true);

    try {
      const response = await api.post('/api/recover', data);

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
  return { recoverPassword, loading };
};

export default useRecoverPassword;
