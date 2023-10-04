import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../AuthContext';
// import Cookies from 'js-cookie';
import styles from './Account.module.css';

const Account = () => {
    const [email, setEmail] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    // const { isAuthenticated } = useContext(AuthContext);
    const {token} = useContext(AuthContext);

    useEffect(() => {
        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BACKEND_URL + '',
            // withCredentials: true,
            // crossOriginal: true,
        });
        //   //jwt token request
        // const user = Cookies.get('user');
        axiosInstance.get('/auth/current-user',{headers: {

                'Authorization': `Bearer ${token}`,
                // 'Authorization': `${token}`,

            } })
        .then(response => {
            const data = response.data;
            if (data.emailAddress) {
                setEmail(data.emailAddress);
            } else {
                console.error('Could not retrieve email address');
            }
        }).catch(error=>{
            console.log("inAccount", error);
        });
    }, [token]);

    const handlePasswordResetClick = () => {
        setIsResetting(true);
    };

    const handleSendEmailClick = () => {
        console.log(email);
        axios.post(process.env.REACT_APP_BACKEND_URL + '/auth/forgot-password',
                email, // sending email as a plain string
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'text/plain' // specifying content type as plain text
                    }
                }
            )
            .then(response => {
                alert('Reset link has been sent to your email address');
                setIsResetting(false); // reset the state after successful operation
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to send password reset email.'); // Inform the user of the error
            });
    };
    
    
    const handleCancelClick = () => {
        setIsResetting(false);
    };

    return (
        <div className={styles.accountContainer}>
            <h2 className={styles.title}>Account settings</h2>
            <h3 className={styles.subtitle}>ACCOUNT PREFERENCES</h3>
            <h2 className={styles.heading}>Email address </h2>
            <p className={styles.emailaddress}>{email}</p>
           <h2 className= {styles.heading}>Change Passwords</h2> 
            <div className={styles.changePasswordContainer}>
                {!isResetting ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <p className={styles.alertMessage}>Reset your password regularly to keep your account secure</p>
                        <button onClick={handlePasswordResetClick} className={styles.button}>Reset</button>
                    </div>
                ) : (
                    <>
                        <p className={styles.alertMessage}>To change your password, we need to send a reset link to your email address</p>
                        <div style={{ marginBottom: '5px',marginTop:'-50px', textAlign: 'left' }}>
                            <div className={styles.sendNcancel} 
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                <button onClick={handleSendEmailClick} className={styles.button}>Send</button>
                                <button onClick={handleCancelClick} className={styles.button} style={{ marginBottom: '5px',marginTop:'20px', }}>Cancel</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Account;
