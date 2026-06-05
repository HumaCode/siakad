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
                className={`form-switch-custom ${checked ? 'active' : ''} border-none cursor-pointer focus:outline-none`}
                onClick={() => onChange(!checked)}
            >
                <div className="toggle-switch" />
            </button>
        </div>
    );
}
