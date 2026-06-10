import React from 'react';

interface DosenImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImportStart: () => void;
}

export default function DosenImportModal({
    isOpen,
    onClose,
    onImportStart
}: DosenImportModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(15, 30, 69, 0.4)', zIndex: 1050 }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-custom">
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-between align-items-center">
                        <h5 className="modal-title font-poppins">
                            <i className="bi bi-file-earmark-excel-fill me-2 text-success"></i>
                            Import Data Dosen
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div
                            style={{
                                border: '2px dashed rgba(26,86,219,.25)',
                                borderRadius: '14px',
                                padding: '32px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: 'rgba(26,86,219,.02)',
                                transition: 'var(--transition)'
                            }}
                            className="upload-dropzone"
                        >
                            <div style={{ fontSize: '38px', color: 'var(--primary)', marginBottom: '10px' }}>
                                <i className="bi bi-file-earmark-excel-fill"></i>
                            </div>
                            <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                                Drag & Drop atau Klik untuk Upload
                            </div>
                            <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
                                Format: .xlsx atau .csv · Maks 10MB
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '12px' }}>
                            <a
                                href="#"
                                style={{
                                    fontSize: '.8rem',
                                    fontWeight: 700,
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <i className="bi bi-download"></i> Download Template Excel Dosen
                            </a>
                        </div>
                    </div>
                    <div className="modal-footer d-flex justify-content-between">
                        <button className="btn-outline" onClick={onClose}>
                            <i className="bi bi-x-lg"></i> Batal
                        </button>
                        <button className="btn-add" onClick={onImportStart}>
                            <i className="bi bi-upload"></i> Mulai Import
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
