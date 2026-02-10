import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import type { FieldValues, RegisterOptions } from "react-hook-form";
import { FiChevronDown, FiCheck } from "react-icons/fi";

type Option = {
  label: string;
  value: string;
};

type RHFAutocompleteProps = {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  rules?: RegisterOptions<FieldValues, string>;
  multiple?: boolean;
};

export default function RHFAutocomplete({
  name,
  label,
  options,
  placeholder = "Select option",
  rules,
  multiple = false,
}: RHFAutocompleteProps) {
  const {
    setValue,
    watch,
    formState: { errors },
    register,
  } = useFormContext<FieldValues>();

  const error = errors[name]?.message as string | undefined;

  const value = watch(name);

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const current: string[] = value || [];

      if (current.includes(optionValue)) {
        setValue(
          name,
          current.filter((v) => v !== optionValue),
          { shouldValidate: true },
        );
      } else {
        setValue(name, [...current, optionValue], {
          shouldValidate: true,
        });
      }
    } else {
      setValue(name, optionValue, { shouldValidate: true });
      setOpen(false);
    }
  };

  const displayLabel = () => {
    if (!value || (multiple && value.length === 0)) {
      return placeholder;
    }

    if (multiple) {
      const selected = options.filter((o) => value.includes(o.value));

      return selected.map((s) => s.label).join(", ");
    }

    const selected = options.find((o) => o.value === value);

    return selected?.label || placeholder;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input type="hidden" {...register(name, rules)} />

      <label className="text-sm text-gray-700 block mb-2">{label}</label>
      <div
        onClick={() => setOpen(!open)}
        className={`w-full px-3 py-2 border rounded-md bg-white cursor-pointer flex items-center justify-between ${error ? "border-red-500" : "border-gray-300"}`}
      >
        <span className="text-sm text-gray-700 truncate">{displayLabel()}</span>

        <FiChevronDown />
      </div>
      {open && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
          {options.map((option) => {
            const isSelected = multiple
              ? value?.includes(option.value)
              : value === option.value;

            return (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-blue-50`}
              >
                <span>{option.label}</span>

                {isSelected && <FiCheck className="text-primary" />}
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
