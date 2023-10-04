import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import styles from './SignUp.module.css';
import axios from 'axios';
import { faCheckCircle, faEye, faEyeSlash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showCreatePassword, setShowCreatePassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [passwordBlurred, setPasswordBlurred] = useState(false);
    const [confirmPasswordBlurred, setConfirmPasswordBlurred] = useState(false);

    const handleSignUp = async (e) => {
      e.preventDefault();
    
      // clear the old message
      setErrorMessage('');
      setSuccessMessage('');
    
      // call the backend register API
      try {
        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/auth/register', {
          emailAddress: email,
          password: password,
        });
    
        const data = response.data;
    
        // handle the response from the backend
        if (data.message === "User registered successfully.") {
          // navigate to the login page
          setSuccessMessage('Registration successful. You can now login.');
          setEmail('');  // reset email
          setPassword('');  // reset password
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        console.error('Error:', error);
        if (error.response) {
          setErrorMessage(`Server error! status: ${error.response.status}, message: ${error.response.data.message}`);
        } else {
          setErrorMessage('Registration failed. No response received from the server. Check your network connection.');
        }
      }
    };
    
    
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    }

    const handleLoginClick = () => {
        navigate('/login');
    }

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

    return (
        <div className={styles.signupcontainer}>
            <div className={styles.blur}>
            </div>
            <div className={styles.midbox}>
                <div className={styles.leftcontainer}>
                    <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} onClick={handleBackClick}/>
                    <div className={styles.signupContainer}>
                        <h2 style={{marginLeft: '23px'}}>Hey, Hello 👋</h2>
                        <form onSubmit={handleSignUp}>
                            <br/>
                            <label>
                                Email Address:
                                <input
                                    type="email"
                                    className={styles.sinputfield}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email"
                                    required
                                />
                            </label>
                            <br/>
                            {/* <label>
                                Password (at least 8 characters):
                                <input
                                    type="password"
                                    className={styles.sinputfield}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    required
                                />
                            </label> */}
                            <div className={styles.inputContainer}>
                            <div className={styles.passwordinput}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type={showCreatePassword ? 'text' : 'password'}
                                        className={styles.inputfield}
                                        onBlur={() => setPasswordBlurred(true)}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="Create Password"
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
                            <br/>
                            <br/>
                            <button type="submit" 
                            className={`${styles.sbtn} ${!passwordValid || !passwordsMatch ? styles.disabledButton : ''}`}
                            disabled={!passwordValid || !passwordsMatch} >
                                Sign Up
                            </button>
                        </form>
                        <p className={styles.options}>
                            ✔️Wanna to back to sign in? <span onClick={handleLoginClick}
                                                              className={styles.backToLogin}>Login</span>.
                        </p>
                        {errorMessage && (
                            <p className={styles.errorMessage}>
                                {errorMessage}
                            </p>
                        )}
                        {successMessage && (
                            <p className={styles.successMessage}>
                                {successMessage}
                            </p>
                        )}
                    </div>
                </div>
                <div className={styles.rightcontainer}>
                    <h1>IN PEACE <br></br>
                        <span style={{marginLeft: '10px'}}>SIGN UP</span></h1>
                </div>
            </div>
        </div>
    );
}

export default SignUp;