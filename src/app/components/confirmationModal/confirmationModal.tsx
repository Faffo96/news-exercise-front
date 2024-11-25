import { showToast } from '@/app/lib/showToast';
import OverlaySpinner from '../overlaySpinner/overlaySpinner';
import '../overlaySpinner/overlaySpinner.css';

interface ConfirmationModalProps {
    show: boolean;
    title: string;
    onConfirm: () => Promise<void>;
    onHide: () => void;
    loading: boolean;
}

export default function ConfirmationModal({
    show,
    title,
    onConfirm,
    onHide,
    loading
}: ConfirmationModalProps) {



    const handleConfirm = async () => {
        try {
            await onConfirm();
            onHide();
        } catch (error) {
            showToast("error", 'Error during confirmation: ' + error)
            console.error('Error during confirmation: ', error);
        }
    };

    return (
        <div className={show ? 'modal show d-block' : 'modal fade'} tabIndex={-1} aria-labelledby="modalLabel" aria-hidden={!show}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title color6 fs-5" id="modalLabel">{title}</h1>
                        <button type="button" className="btn-close" onClick={onHide} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p className=''>Are you sure you want proceed?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="bg-secondary hover-bright20 text-light p-2 border-0 rounded-2" onClick={onHide}>
                        Close
                        </button>
                        <button
                            type="button"
                            className="bg-color6 hover-bright20 text-light p-2 border-0 rounded-2"
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
            {loading && <OverlaySpinner />}
        </div>
    );
}
