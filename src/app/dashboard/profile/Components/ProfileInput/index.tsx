import { forwardRef, InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface iInputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  id: string;
  error?: FieldError;
  label: string;
}

const InputProfile = forwardRef<HTMLInputElement, iInputProps>(
  ({ type, id, error, label, ...rest }, ref) => {
    return (
      <>
        <div className="max-[940px]:w-full min-[940px]:w-full border-b border-1 text-black border-black relative">
          <label className="block  font-semibold mb-2" htmlFor={id}>
            {label}
          </label>
          <input
            className="input-style w-full text-black outline-none"
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

InputProfile.displayName = "Input";

export default InputProfile;
