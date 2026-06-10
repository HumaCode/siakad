import React from 'react';
import Modal from '@/Components/Modal';

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
    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="modal-content" style={{ background: '#fff', border: 'none' }}>
                <div className="modal-header d-flex justify-content-between align-items-center p-4 border-b border-gray-100">
                    <h5 className="modal-title font-poppins m-0">
                        <i className="bi bi-file-earmark-excel-fill me-2 text-success"></i>
                        Import Data Dosen
                    </h5>
                    <button 
                        type="button" 
                        className="text-gray-400 hover:text-gray-600 transition border-0 bg-transparent p-1" 
                        onClick={onClose} 
                        aria-label="Close"
                    >
                        <i className="bi bi-x-lg" style={{ fontSize: '1.2rem' }}></i>
                    </button>
                </div>
                <div className="modal-body p-4">
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
                <div className="modal-footer d-flex justify-content-between p-4 border-t border-gray-100">
                    <button className="btn-outline" onClick={onClose}>
                        <i className="bi bi-x-lg"></i> Batal
                    </button>
                    <button className="btn-add" onClick={onImportStart}>
                        <i className="bi bi-upload"></i> Mulai Import
                    </button>
                </div>
            </div>
        </Modal>
    );
}
