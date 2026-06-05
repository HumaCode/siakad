import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [role, setRole] = useState<'mahasiswa' | 'dosen' | 'admin' | 'keuangan'>('mahasiswa');
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // Helper for input label & placeholder based on role
    const getRoleDetails = () => {
        switch (role) {
            case 'mahasiswa':
                return { label: 'NIM / Username', placeholder: 'Masukkan NIM mahasiswa' };
            case 'dosen':
                return { label: 'NIDN / Username', placeholder: 'Masukkan NIDN dosen' };
            default:
                return { label: 'Email / Username', placeholder: 'Masukkan email atau username' };
        }
    };

    const roleDetails = getRoleDetails();

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="form-header">
                <div className="welcome-badge">
                    <span>✦</span> Portal Akademik
                </div>
                <h2>Selamat Datang<br />Kembali! 👋</h2>
                <p>Masuk untuk mengakses portal akademik Anda.</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {/* Google Login (Demo Alert) */}
            <button
                type="button"
                className="btn-google"
                onClick={() => alert('Fitur masuk dengan Google sedang dalam pengembangan.')}
            >
                <svg className="google-icon" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Masuk dengan Google
            </button>

            <div className="divider"><span>atau masuk dengan akun SIAKAD</span></div>

            <form onSubmit={submit}>
                {/* Role Selector */}
                <div className="mb-3">
                    <label className="form-label">Masuk sebagai</label>
                    <div className="role-selector">
                        <button
                            type="button"
                            className={`role-btn ${role === 'mahasiswa' ? 'active' : ''}`}
                            onClick={() => {
                                setRole('mahasiswa');
                                // Prepopulate with a seeded student NIM to make testing easy
                                if (!data.email) setData('email', '251011526101');
                            }}
                        >
                            <span className="rb-icon">🎓</span>Mahasiswa
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${role === 'dosen' ? 'active' : ''}`}
                            onClick={() => {
                                setRole('dosen');
                                // Prepopulate with a seeded lecturer NIDN to make testing easy
                                if (data.email === '251011526101') setData('email', '0412038901');
                            }}
                        >
                            <span className="rb-icon">👨‍🏫</span>Dosen
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                            onClick={() => {
                                setRole('admin');
                                if (data.email === '0412038901' || data.email === '251011526101') setData('email', 'admin@siakad.com');
                            }}
                        >
                            <span className="rb-icon">🛡️</span>Admin
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${role === 'keuangan' ? 'active' : ''}`}
                            onClick={() => {
                                setRole('keuangan');
                                if (data.email === 'admin@siakad.com') setData('email', 'keuangan@siakad.com');
                            }}
                        >
                            <span className="rb-icon">💼</span>Keuangan
                        </button>
                    </div>
                </div>

                {/* NIM/Email Input */}
                <div>
                    <label className="form-label">{roleDetails.label}</label>
                    <div className="input-wrap">
                        <input
                            className="form-control-custom"
                            type="text"
                            value={data.email}
                            placeholder={roleDetails.placeholder}
                            autoComplete="username"
                            required
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <span className="input-icon">🪪</span>
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                {/* Password */}
                <div className="mt-3">
                    <label className="form-label">Password</label>
                    <div className="input-wrap">
                        <input
                            className="form-control-custom"
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            placeholder="Masukkan password"
                            autoComplete="current-password"
                            required
                            style={{ paddingRight: '42px' }}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <span className="input-icon">🔒</span>
                        <button
                            className="pass-toggle"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                {/* Remember + Forgot */}
                <div className="form-row-util">
                    <label className="check-custom">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span>Ingat saya</span>
                    </label>
                    {canResetPassword && (
                        <Link href={route('password.request')} className="forgot-link">
                            Lupa password?
                        </Link>
                    )}
                </div>

                {/* Submit */}
                <button className="btn-login" type="submit" disabled={processing}>
                    {processing ? '⏳ Memproses...' : 'Masuk ke Portal'}
                </button>

                <div className="form-footer">
                    Butuh bantuan? <a href="#">Hubungi Admin</a>
                </div>
            </form>
        </GuestLayout>
    );
}
