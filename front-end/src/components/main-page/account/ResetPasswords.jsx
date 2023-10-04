import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import axios from 'axios'; 
import { AuthContext } from '../../../AuthContext';
import styles from'./ResetPasswords.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEye, faEyeSlash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}  

const ResetPasswords = () => {
    const navigate = useNavigate();
    const query = useQuery();
    const token = query.get("token");
    const { isAuthenticated, token: authToken } = useContext(AuthContext);
    const location = useLocation();
    const emailFromForgotPasswordPage = location.state?.userEmail || '';

    const [emailAddress, setEmailAddress] = useState(''); 
    const [password, setPassword] = useState('');
    const [showCreatePassword, setShowCreatePassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [passwordBlurred, setPasswordBlurred] = useState(false);
    const [confirmPasswordBlurred, setConfirmPasswordBlurred] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const axiosInstance = axios.create({
                baseURL: process.env.REACT_APP_BACKEND_URL,
            });

            axiosInstance.get('/auth/current-user', { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then(response => {
                const data = response.data;
                if (data.emailAddress) {
                    setEmailAddress(data.emailAddress);
                } else {
                    console.error('Could not retrieve email address');
                }
            }).catch(error => {
                console.log("Error fetching email:", error);
            });
        }else {
            setEmailAddress(emailFromForgotPasswordPage);}
    }, [isAuthenticated, authToken,emailFromForgotPasswordPage]);

    const checkPasswordValidity = (pass) => {
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(pass);
        const hasMinLength = pass.length >= 8;
        return hasUpperCase && hasLowerCase && hasSpecialChar && hasMinLength;
    };

    const handlePasswordChange = (e) => {
        const pass = e.target.value;
        setPassword(pass);
        setPasswordValid(checkPasswordValidity(pass));
        setPasswordsMatch(pass === confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        const confPass = e.target.value;
        setConfirmPassword(confPass);
        setPasswordsMatch(password === confPass);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordValid && passwordsMatch) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/reset-password?token=${token}`, {
                    emailAddress,
                    password
                });
                if (response.data.message === "Password updated successfully") {
                    alert("Password has been reset successfully!");
                    navigate('/');
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                if (error.response && error.response.data.message) {
                    alert(error.response.data.message);
                } else {
                    alert("Failed to reset password.");
                }
            }
        }
    };

    return (
        <div className={styles.resetpassword}>
            <div className={styles.blur}></div>
            <div className={styles.midbox}>
                <div className={styles.left}>
                    <h1>INPEACE <br/>
                    <span>Reset Password</span>
                    </h1>
                </div>
                <div className={styles.right}>
                    <form onSubmit={handleSubmit} className={styles.resetcontainer}>
                        <h2>New Password</h2>
                        <h3>Create a new, strong password that you don't use for other websites.</h3>
                        <br/>
                        <div className={styles.inputContainer}>
                            <div className={styles.passwordinput}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type={showCreatePassword ? 'text' : 'password'}
                                        className={styles.inputfield}
                                        onBlur={() => setPasswordBlurred(true)}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="Create New Password"
                                    />
                                    <span onClick={() => setShowCreatePassword(!showCreatePassword)} className={styles.eyeIcon}>
                                        <FontAwesomeIcon icon={showCreatePassword ? faEye : faEyeSlash} />
                                    </span>
                                </div>
                                {
                                    passwordBlurred && (passwordValid ? 
                                        <FontAwesomeIcon className={styles.validicon} icon={faCheckCircle} /> 
                                        : 
                                        <FontAwesomeIcon className={styles.invalidicon} icon={faExclamationTriangle} />
                                    )
                                }
                            </div>
                            <div className={styles.requirements}>
                                <ul>
                                    <li>At least 8 characters long</li>
                                    <li>At least one uppercase letter</li>
                                    <li>At least one lowercase letter</li>
                                    <li>At least one special character</li>
                                </ul>
                            </div>
                            <div className={styles.passwordinput}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className={styles.inputfield}
                                        onBlur={() => setConfirmPasswordBlurred(true)}
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        placeholder="Confirm Your Password"
                                    />
                                    <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.eyeIcon}>
                                        <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                                    </span>
                                </div>
                                {
                                    confirmPasswordBlurred && (passwordsMatch && passwordValid ? 
                                        <FontAwesomeIcon className={styles.validicon} icon={faCheckCircle} /> 
                                        : 
                                        <FontAwesomeIcon className={styles.invalidicon} icon={faExclamationTriangle} />
                                    )
                                }
                            </div>
                        </div>
                        <br />
                            <button type="submit" 
                            className={`${styles.btn} ${!passwordValid || !passwordsMatch ? styles.disabledButton : ''}`}
                            disabled={!passwordValid || !passwordsMatch}>
                                Reset
                            </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswords;
