import React, { useEffect, useState } from 'react';


export default function CustomAlert({ type = "success", message, onClose }) {
   
    const [fade, setFade] = useState(false);

    useEffect(() => {
       
        if (message) {
            setFade(false); 
            const timer = setTimeout(() => setFade(true), 2000);
            const remove = setTimeout(() => onClose && onClose(), 2800);
            return () => { clearTimeout(timer); clearTimeout(remove); };
        }
    }, [message, onClose]);

    
    if (!message) return null;

    return (
        <div className={`custom-alert ${type}${fade ? ' fade-out' : ''}`}>
            
            {message}
            
            {onClose && (
                <button
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        marginLeft: 16,
                        fontSize: 18,
                        cursor: "pointer"
                    }}
                    onClick={onClose}
                >
                    ×
                </button>
            )}
        </div>
    );
}