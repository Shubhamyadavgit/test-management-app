import { useFormContext } from "react-hook-form";
import type { FieldValues, RegisterOptions } from "react-hook-form";

type Option = {
  label: string;
  value: string | number;
};

type RHFAutocompleteProps = {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  rules?: RegisterOptions<FieldValues, string>;
};

export default function RHFAutocomplete({
  name,
  label,
  options,
  placeholder = "Select option",
  rules,
}: RHFAutocompleteProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FieldValues>();

  const error = errors[name]?.message as string | undefined;

  return (
    <div>
      <label className="text-sm text-gray-700 block mb-2">{label}</label>

      <select
        {...register(name, rules)}
        defaultValue=""
        className={`
          w-full
          px-3
          py-2
          border
          rounded-md
          outline-none
          focus:ring-2
          focus:ring-blue-500
          bg-white
          ${error ? "border-red-500" : "border-gray-300"}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
