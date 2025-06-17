import { useState } from "react";
import { updatePassword, verifyResetCode } from "../api";

export default function ForgotPasswordModal({ onClose, onCodeVerified }) {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendEmail = async e => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await updatePassword(email);
            if (res.success) {
                setStep(2);
            } else {
                setError(res.error || "Failed to send code.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send code.");
        }
        setLoading(false);
    };

    const handleVerifyCode = async e => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await verifyResetCode(email, code);
            if (res.success) {
                onCodeVerified(email, code);
            } else {
                setError(res.error || "Invalid code.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Invalid code.");
        }
        setLoading(false);
    };

    return (
        <>
            <h2>Forgot Password</h2>
            {step === 1 && (
                <form onSubmit={handleSendEmail}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="neumorph-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="neumorph-btn" style={{ width: '100%' }} disabled={loading}>
                        {loading ? "Sending..." : "Send validation code"}
                    </button>
                    {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handleVerifyCode}>
                    <div className="form-group">
                        <label>Validation Code</label>
                        <input
                            type="text"
                            className="neumorph-input"
                            placeholder="Enter code"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="neumorph-btn" style={{ width: '100%' }} disabled={loading}>
                        {loading ? "Verifying..." : "Verify code"}
                    </button>
                    {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
                </form>
            )}
            <button className="close-btn" onClick={onClose} type="button">✖</button>
        </>
    );
}