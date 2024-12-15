import { useState } from 'react';
import api from '../axiosConfig';
import { ProfileDTO } from '../types/allTypes';

const useProfileEdit = () => {
  const [loading, setLoading] = useState(false);

  const updateProfile = async (
    data: Pick<
      ProfileDTO,
      'email' | 'endereco' | 'logo' | 'nome_barbearia' | 'phone'
    >
  ) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('endereco', data.endereco);
      formData.append('nome_barbearia', data.nome_barbearia);
      formData.append('phone', data.phone);

      formData.append('logo', data.logo[0]);

      const response = await api.put('/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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

  return { updateProfile, loading };
};

export default useProfileEdit;
