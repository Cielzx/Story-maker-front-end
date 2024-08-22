import { forwardRef, InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface iInputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  id: string;
  error?: FieldError;
  label: string;
}

const Input = forwardRef<HTMLInputElement, iInputProps>(
  ({ type, id, error, label, ...rest }, ref) => {
    return (
      <>
        <div className="mb-2 max-[940px]:w-full min-[940px]:w-full border-b-1 border-purple-400 ">
          <label className="block  font-semibold mb-2" htmlFor={id}>
            {label}
          </label>
          <input
            className="input-style w-full text-white  outline-none"
            required
            type={type}
            id={id}
            ref={ref}
            {...rest}
          />
        </div>
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;
