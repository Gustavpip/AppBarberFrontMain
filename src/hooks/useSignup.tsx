// src/hooks/useSignup.ts
import { useState } from 'react';
import api from '../axiosConfig';
import { UserDTO } from '../types/allTypes';

const useSignup = () => {
  const [loading, setLoading] = useState(false);

  const signup = async (data: Partial<UserDTO>) => {
    setLoading(true);

    try {
      const response = await api.post('/api/signup', data);

      if (response.request.status === 201 || response.data.success === true) {
        return { success: true, data: response.data };
      } else {
        console.log('salve');
        return { success: false, data: response };
      }
    } catch (err: any) {
      return { success: false, data: err };
    } finally {
      setLoading(false);
    }
  };
  return { signup, loading };
};

export default useSignup;
