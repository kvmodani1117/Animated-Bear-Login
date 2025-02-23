// components/Login.tsx
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useBearImages } from '../hooks/useBearImages';
import { useBearAnimation } from '../hooks/useBearAnimation';
import BearAvatar from './BearAvatar';
import Input from './Input';
import '../styles/Login.css';
import '../App.css';
import EyeIconSrc from '/src/assets/icons/eye_on.svg';
import EyeOffIconSrc from '/src/assets/icons/eye_off.svg';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors
  } = useForm<LoginFormData>();

  const [values, setValues] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const { watchBearImages, hideBearImages, peakBearImages } = useBearImages();

// Bringing functions from "useBearAnimation". Also, we're passing the required props to it.
// We can see, values and showPassword are passed as props to "useBearAnimation", due to which we can use them in the hook.
// When values or showPassword changes, Login.tsx re-renders, causing "useBearAnimation" to be called again with updated values.
// This enables reactive behavior within the hook, making it a great way to share state between components and hooks.
  const {
    currentBearImage,
    setCurrentFocus,
    currentFocus,
    isAnimating,
  } = useBearAnimation({
    watchBearImages,
    hideBearImages,
    peakBearImages,
    emailLength: values.email.length,
    showPassword,
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('Form submitted:', data);
    alert('Voilà~');
  };

  const togglePassword = () => {
    if (!isAnimating) {
      setShowPassword((prev) => !prev);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(
        (prev) => ({ ...prev, [name]: value }));
    setValue(name as keyof LoginFormData, value, { shouldValidate: true });
    clearErrors(name as keyof LoginFormData);
  };

  return (
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="avatar-container">
                <div className="avatar-wrapper">
                {currentBearImage && (
                    <BearAvatar
                    currentImage={currentBearImage}
                    key={`${currentFocus}-avatar`}
                    />
                )}
                </div>
            </div>
            <div className="input-container">
                <div className="input-wrapper">
                    <Input 
                        placeholder="Email" 
                        {...register('email', { required: 'Email is required' })} 
                        type="email"
                        name="email"
                        onFocus={() => setCurrentFocus('EMAIL')}
                        onChange={handleInputChange}
                    />
                </div>
                {errors.email && <p className="error-text">{errors.email.message}</p>}
                
            </div>
            
            <div className="input-container">
                <div className="input-wrapper">
                <Input 
                    placeholder="Password" 
                    {...register('password', { required: 'Password is required' })} 
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    onFocus={() => setCurrentFocus('PASSWORD')}
                    onChange={handleInputChange}
                />
                <button type="button" className="toggle-password" onClick={togglePassword}>
                    <img className="password-icon" src={showPassword ? EyeOffIconSrc : EyeIconSrc} alt="Toggle Password" />
                </button>
                </div>
                {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>
            
            <button type="submit" className="login-button">Log In</button>
        </form>
    );
}
