import './Modal.css'

export const Modal = ({ children, onClose }) => {
    return (
        <div className="modal-container">
            <div className="modal">
                {children}
            </div>
        </div>
    );
}