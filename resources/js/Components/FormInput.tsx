import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function FormInput({
    label,
    error,
    className = '',
    id,
    type = 'text',
    ...props
}: FormInputProps) {
    return (
        <div>
            <label htmlFor={id} className="form-label-custom form-label-c mb-1 font-bold text-xs block">
                {label}
            </label>
            <input
                id={id}
                type={type}
                className={`form-ctrl ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-xxs mt-1 font-medium">{error}</p>}
        </div>
    );
}
