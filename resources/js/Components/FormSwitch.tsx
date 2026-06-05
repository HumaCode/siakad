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
        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800">
            <div>
                <label className="form-label-custom font-bold text-xs mb-0.5 block">{label}</label>
                {description && <p className="text-xxs text-slate-400">{description}</p>}
            </div>
            <button
                type="button"
                className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 cursor-pointer border-none focus:outline-none ${checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                onClick={() => onChange(!checked)}
            >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
        </div>
    );
}
