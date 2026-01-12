import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../../api/api';
import { loginSuccess } from '../../store/slices/userSlice';
import { toast } from 'react-toastify';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signup(formData);
      dispatch(loginSuccess(data));
      toast.success('Signup successful!');
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'Signup failed';
      toast.error(errorMessage);
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Create Account</h2>

        <input
          type="text"
          className="signup-input"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />

        <input
          type="email"
          className="signup-input"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />

        <input
          type="text"
          className="signup-input"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={(e) => setFormData({...formData, mobile: e.target.value})}
          required
        />

        <input
          type="password"
          className="signup-input"
          placeholder="Create Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
          minLength="6"
        />

        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
