import { SelectHTMLAttributes } from 'react';

interface FormSelectOption {
    value: string | number;
    label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: FormSelectOption[];
    error?: string;
}

export default function FormSelect({
    label,
    options,
    error,
    className = '',
    id,
    ...props
}: FormSelectProps) {
    return (
        <div>
            <label htmlFor={id} className="form-label-custom mb-1 font-bold text-xs block">
                {label}
            </label>
            <select
                id={id}
                className={`form-ctrl ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-xxs mt-1 font-medium">{error}</p>}
        </div>
    );
}
