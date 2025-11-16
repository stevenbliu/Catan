interface InputProps {
  label?: string;
  placeholder?: string;
  inputProps: any; 
  error?: string;
  type?: string;
}

export default function Input({ label, placeholder, inputProps, error, type = "text" }: InputProps) {
  return (
    <div className="flex-1 mb-2">
      {label && <label className="block mb-1">{label}</label>}
      <input
        {...inputProps}
        type={type}
        placeholder={placeholder}
        className="border p-2 rounded w-full"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
