import { forwardRef, InputHTMLAttributes } from 'react';
import '../styles/Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, ...props },
  ref
) {
  return (
    <div className="input-container">
      <input ref={ref} className="input-field" {...props} />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
});

export default Input;