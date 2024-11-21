import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import './overlaySpinner.css';

function OverlaySpinner() {
    return (
        <div className="overlay">
            <Spinner animation="border" role="status" className="spinner" />
        </div>
    );
}

export default OverlaySpinner;
