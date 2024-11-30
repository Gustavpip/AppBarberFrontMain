// src/hooks/useSignin.ts
import { useState } from 'react';
import api from '../axiosConfig';
import { UserDTO } from '../types/allTypes';
import { useAuth } from '../context/AuthContext';

const useSignin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const signin = async (data: Partial<UserDTO>) => {
    setLoading(true);

    try {
      const response = await api.post('/api/signin', data);

      if (response.request.status === 200 || response.data.success === true) {
        const { token, user } = response.data;
        const { id, ...rest } = user;
        login(token, rest);
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
  return { signin, loading };
};

export default useSignin;
