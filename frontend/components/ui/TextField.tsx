import React from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

export function TextField({ label, error, ...rest }: TextFieldProps) {
  // `rest` may contain a `name` or `id` property coming from react-hook-form's
  // register spread. Prefer `id` if provided, otherwise use `name` for htmlFor.
  const restTyped = rest as React.InputHTMLAttributes<HTMLInputElement> & {
    name?: string;
  };
  const id = restTyped.id ?? restTyped.name;
  return (
    <div className="mb-4">
      <label
        htmlFor={id as string}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id as string}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...restTyped}
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

export default TextField;
