import { ReactNode } from "react";

interface SmallCheckboxProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

export const SmallCheckbox = ({
  id,
  label,
  checked,
  onChange,
  required = false,
}: SmallCheckboxProps) => {
  return (
    <div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        required={required}
      />
      <label htmlFor={id} className="ml-2 text-sm text-gray-600">
        {label}
      </label>
    </div>
  );
};
