// src/hooks/useSignin.ts
import { useState } from 'react';
import api from '../axiosConfig';
import { UserDTO } from '../types/allTypes';

const useUpdatePassword = () => {
  const [loading, setLoading] = useState(false);

  const updatePassword = async (data: Partial<UserDTO>) => {
    setLoading(true);

    try {
      const response = await api.patch('/api/update/password', data);

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
  return { updatePassword, loading };
};

export default useUpdatePassword;
