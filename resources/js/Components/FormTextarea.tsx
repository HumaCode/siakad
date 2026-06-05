import { TextareaHTMLAttributes } from 'react';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export default function FormTextarea({
    label,
    error,
    className = '',
    id,
    ...props
}: FormTextareaProps) {
    return (
        <div>
            <label htmlFor={id} className="form-label-custom mb-1 font-bold text-xs block">
                {label}
            </label>
            <textarea
                id={id}
                className={`form-ctrl ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-xxs mt-1 font-medium">{error}</p>}
        </div>
    );
}
