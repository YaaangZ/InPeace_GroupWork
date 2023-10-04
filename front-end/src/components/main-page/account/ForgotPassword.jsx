import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        handleSendEmailClick(); // Call the email sending logic when the form is submitted
    };

    const handleSendEmailClick = () => {
        axios.post( process.env.REACT_APP_BACKEND_URL+ '/auth/forgot-password', 
            email,
            {
                headers: {
                    'Content-Type': 'text/plain'
                }
            }
        )
        .then(response => {
            alert('Reset link has been sent to your email address');
            setIsEmailSubmitted(true);
            navigate('/', { state: { userEmail: email } });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to send password reset email.');
        });
    };

    const handleBackClick = () => {
      navigate('/login');
    }

    const handleLoginClick = () => {
      navigate('/login');
    }
  
    return (
        <div className={styles.password}>
          <div className={styles.blur}></div>
            <div className={styles.midbox}>
            <div className={styles.above}>
                <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} onClick={handleBackClick}/>
                <h1>PASSWORD</h1>
            </div>
            <div className={styles.below}>
                <div className={styles.contentcontainer}>
                <h2>Forgot Password</h2>
                {isEmailSubmitted ? (
                    <p>An email has been sent to your email address with further instructions.</p>
                ) : (
                    <>
                    <h3>Enter your email address to reset your password.</h3>
                    <form onSubmit={handleEmailSubmit}>
                        <label style={{ marginBottom: '20px' }}>
                        Email Address:
                        <input
                            className={styles.emaillabel}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            required
                        />
                        </label>
                        <br/>
                        <div className="buttonContainer">
                          <button type="submit" className={styles.btn}>
                            Submit
                          </button>
                        </div>
                    </form>
                    <p className={styles.options}>
                        ✔️Wanna to go back to sign in? <span onClick={handleLoginClick} className={styles.loginClick}>Login</span>.
                    </p>
                    </>
                )}
                </div>
            </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
