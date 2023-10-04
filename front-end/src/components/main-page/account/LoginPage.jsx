import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../AuthContext';
import styles from './LoginPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    }

    const handleSignupClick = () => {
        navigate('/signup');
    }

    const handlePasswordClick = () => {
        navigate('/password');
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        console.log(process.env.REACT_APP_BACKEND_URL);

        // console.log('Email:', email);  // Logging email
        // console.log('Password:', password);  // Logging password
        const loginUsingAccount = async () => {
            try {
                const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/auth/authenticate', {
                    emailAddress: email,
                    password: password,
                });

                // console.log('Response:', response);  // Logging response

                if (response.status === 200) {
                    const data = response.data.jwt;
                    localStorage.setItem('user', data);
                    Cookies.set('user', data, { expires: 7, secure: true }); // Store the cookies
                    console.log("saved cookies when login in", Cookies.get('user'));

                    login();
                    setSuccessMessage('Login successfully!');
                    toast.success('Login successfully!', {
                        position: 'bottom-center',
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setTimeout(() => {
                        // get the redirect path stored in session storage
                        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
                        // if it exists, navigate to it, otherwise navigate to '/'
                        navigate(redirectPath || '/');
                        // then remove the redirect path from session storage
                        sessionStorage.removeItem('redirectAfterLogin');
                    }, 3000);

                }

            } catch (error) {
                console.log('Error', error.message);
                if (error.response) {
                    console.log('Error response:', error.response);  // Logging error response
                    setErrorMessage(`Login failed, please try again later.`);
                } else {
                    setErrorMessage('Login attempt failed, please try again later.');
                }
                toast.error('Login attempt failed, please try again later.', {
                    position: 'bottom-center',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        };

        const token = localStorage.getItem('user');
        if (!token) {
            loginUsingAccount();
            // try {
            //     const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/auth/authenticate', {
            //         emailAddress: email,
            //         password: password,
            //     });
            //
            //     // console.log('Response:', response);  // Logging response
            //
            //     if (response.status === 200) {
            //         const data = response.data.jwt;
            //         Cookies.set('user', data, { expires: 7, secure: true }); // Store the cookies
            //         console.log("saved cookies when login in", Cookies.get('user'));
            //
            //         login();
            //         setSuccessMessage('Login successfully!');
            //         setTimeout(() => {
            //             // get the redirect path stored in session storage
            //             const redirectPath = sessionStorage.getItem('redirectAfterLogin');
            //             // if it exists, navigate to it, otherwise navigate to '/'
            //             navigate(redirectPath || '/');
            //             // then remove the redirect path from session storage
            //             sessionStorage.removeItem('redirectAfterLogin');
            //         }, 3000);
            //
            //     }
            //
            // } catch (error) {
            //     console.log('Error', error.message);
            //     if (error.response) {
            //         console.log('Error response:', error.response);  // Logging error response
            //         setErrorMessage(`Login failed, error status: ${error.response.status}`);
            //     } else {
            //         setErrorMessage('Login attempt failed, please try again later.');
            //     }
            // }
        } else {
            //try to use Cookies to login, if failed, use user name and password to login


        }
        // try {
        //     const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/auth/authenticate', {
        //         emailAddress: email,
        //         password: password,
        //     });

        //     console.log('Response:', response);  // Logging response

        //     const data = response.data;

        //     if (response.status === 200) {
        //         Cookies.set('user', data, { expires: 7, secure: true }); // Store the cookies
        //         console.log(Cookies);

        //         login();
        //         setSuccessMessage('Login successfully!');
        //         setTimeout(() => {
        //             navigate('/');
        //         }, 3000);
        //     }

        // } catch (error) {
        //     console.log('Error', error.message);
        //     if (error.response) {
        //         console.log('Error response:', error.response);  // Logging error response
        //         setErrorMessage(`Login failed, error status: ${error.response.status}`);
        //     } else {
        //         setErrorMessage('Login attempt failed, please try again later.');
        //     }
        // }
    };

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.login}>
            <div className={styles.blur}>
            </div>

            <div className={styles.midbox}>
                <div className={styles.left}>
                    <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} onClick={handleBackClick} />
                    <h1>INPEACE<br></br>
                        <span>LOGIN</span>
                        {/* <span style={{ marginLeft: '170px' }}>LOGIN</span> */}
                    </h1>
                </div>

                <div className={styles.right}>
                    <div className={styles.logincontainer}>
                        <h2>InPeace Login</h2>
                        <h3>Hi, enter your details to sign into your account.</h3>
                        <form onSubmit={handleLogin}>
                            <label>
                                User Account:
                                <input
                                    type="text"
                                    className={styles.inputfield}
                                    placeholder="Enter email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>
                            <br />
                            <label>
                                Password:
                                <div className={styles.passwordinput}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={styles.inputfield}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                    />
                                    <div className={styles.showpasswordtoggle}>
                                        <input
                                            type="checkbox"
                                            className={styles.showpassword}
                                            checked={showPassword}
                                            onChange={handlePasswordToggle}
                                        />
                                        <label htmlFor="showpassword"></label>
                                    </div>
                                </div>
                            </label>
                            <br />
                            <button type="submit" className={styles.btn}>
                                Login
                            </button>
                        </form>
                        <p className={styles.options} onClick={handlePasswordClick}>
                            😖 Having trouble signing in?
                        </p>
                        <p className={styles.signup}>
                            🗝️ Don't have an account?
                            <span onClick={handleSignupClick} className={styles.signupClick}>Register now</span>
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
            </div>
        </div>
    );
}

export default LoginPage;
