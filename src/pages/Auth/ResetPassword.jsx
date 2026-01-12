import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordEmail } from '../../api/api';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPasswordEmail(formData);
      toast.success('Password reset successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <input
        type="text"
        placeholder="Token"
        value={formData.token}
        onChange={(e) => setFormData({...formData, token: e.target.value})}
      />
      <input
        type="password"
        placeholder="New Password"
        value={formData.newPassword}
        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;