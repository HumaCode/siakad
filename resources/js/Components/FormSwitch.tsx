interface FormSwitchProps {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function FormSwitch({
    label,
    description,
    checked,
    onChange,
}: FormSwitchProps) {
    return (
        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/20 p-3.5 rounded-xl border border-slate-100/50 dark:border-slate-800">
            <div className="pr-4">
                <label className="form-label-custom font-bold text-xs mb-0.5 block">{label}</label>
                {description && (
                    <p className="text-slate-400 mt-0.5 leading-tight" style={{ fontSize: '10.5px' }}>
                        {description}
                    </p>
                )}
            </div>
            <button
                type="button"
                className="transition-all duration-300 flex items-center cursor-pointer border-none focus:outline-none rounded-full shrink-0"
                style={{
                    width: '40px',
                    height: '24px',
                    padding: '4px',
                    backgroundColor: checked ? '#10b981' : '#cbd5e1'
                }}
                onClick={() => onChange(!checked)}
            >
                <div 
                    className="rounded-full bg-white transition-all duration-300 shadow-sm"
                    style={{
                        width: '16px',
                        height: '16px',
                        transform: checked ? 'translateX(16px)' : 'translateX(0px)'
                    }}
                />
            </button>
        </div>
    );
}
