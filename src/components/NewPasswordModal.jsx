import { useState } from "react";
import { resetPassword } from "../api";

export default function NewPasswordModal({ email, code, onClose, onSuccess }) {
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleReset = async e => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await resetPassword(email, code, newPassword);
            if (res.success) {
                setSuccess(true);
                onSuccess && onSuccess();
            } else {
                setError(res.error || "Failed to reset password.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to reset password.");
        }
        setLoading(false);
    };
    return (
        <>
            <h2>Set New Password</h2>
            <form onSubmit={handleReset}>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        className="neumorph-input"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="neumorph-btn" style={{ width: '100%' }} disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                </button>
                {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
                {success && <div style={{ color: "green", marginTop: 8 }}>Password updated! You can now log in.</div>}
            </form>
            <button className="close-btn" onClick={onClose} type="button">✖</button>
        </>
    );
}