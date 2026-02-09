import { useFormContext } from "react-hook-form";
import type { FieldValues, RegisterOptions } from "react-hook-form";

type RHFTextFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  rules?: RegisterOptions<FieldValues, string>;
  numeric?: boolean;
};

export default function RHFTextField({
  name,
  label,
  placeholder,
  type = "text",
  rules,
  numeric = false,
}: RHFTextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FieldValues>();

  const error = errors[name]?.message as string | undefined;

  const registerOptions: RegisterOptions<FieldValues, string> = {
    ...rules,
  };

  if (numeric) {
    registerOptions.pattern = {
      value: /^[0-9]*$/,
      message: "Only numbers are allowed",
    };
  }

  return (
    <div>
      <label className="text-sm text-gray-700 block mb-2">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        {...register(name, registerOptions)}
        onInput={(e: React.FormEvent<HTMLInputElement>) => {
          if (numeric) {
            const input = e.currentTarget;
            input.value = input.value.replace(/[^0-9]/g, "");
          }
        }}
        className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"}`}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
