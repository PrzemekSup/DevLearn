import { ReactNode } from "react";

interface TextAreaProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  message?: ReactNode;
  rows?: number;
}

export const TextArea = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled,
  message,
  rows = 4,
}: TextAreaProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
          disabled={disabled}
        />
      </div>
      {message}
    </div>
  );
};
