interface Props {
  label: string;
  placeholder?: string;
  textarea?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export function FormField({
  label,
  placeholder,
  textarea,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          rows={4}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}
