import { useState } from "react";

export default function AcceptCGU({
  label,
  onChange,
}: {
  label: string;
  onChange?: (val: boolean) => void;
}) {
  const [checked, setChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setChecked(val);
    onChange?.(val);
  };

  return (
    <label className="flex gap-2 items-center">
      <input type="checkbox" checked={checked} onChange={handleChange} />
      {label}
    </label>
  );
}
