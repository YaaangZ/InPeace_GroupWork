import React, {useState, useEffect} from 'react';
import styles from './Popup.module.css';
import {useNavigate} from 'react-router-dom';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faHeart, faStar} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useAuth} from '../../../AuthContext';

library.add(faHeart, faStar);

const Popup = () => {
    const navigate = useNavigate();
    const { logout, isLoggedIn } = useAuth();
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [showIconOptions, setShowIconOptions] = useState(false);

    useEffect(() => {
        const storedIcon = localStorage.getItem('selectedIcon');
        if (storedIcon) {
            setSelectedIcon(JSON.parse(storedIcon));
        }
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleBackClick = () => {
        navigate('/');
    };

    const handleMypageClick = () => {
        navigate('/mypage');
    };

    const handleLogoutClick = () => {
        logout();
        alert("logout successfully")
        navigate('/');
    };

    const handleIcon = (icon) => {
        setSelectedIcon(icon);
        setShowIconOptions(false);
        localStorage.setItem('selectedIcon', JSON.stringify(icon));
    };

    const handleOptions = () => {
        setShowIconOptions(true);
    };

    const closeOptions = () => {
        setShowIconOptions(false);
    };


    const iconOption1 = faHeart;
    const iconOption2 = faStar;

    return (
        <div className={styles.popup}>
            <div className={styles.iconbox}>
                <div className={styles.icon} onClick={selectedIcon && showIconOptions ? closeOptions : handleOptions}>
                    {selectedIcon ? (
                        <FontAwesomeIcon icon={selectedIcon} className={styles.selectedIcon}/>
                    ) : (
                        <div className={styles.emptyIcon}>Select an icon</div>
                    )}
                </div>
                <div className={styles.options}>
                    {showIconOptions && (
                        <div className={styles.iconOptions}>
                            <FontAwesomeIcon icon={iconOption1} onClick={() => handleIcon(iconOption1)}/>
                            <FontAwesomeIcon icon={iconOption2} onClick={() => handleIcon(iconOption2)}/>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.secondbox}>
                <div className={styles.userName}></div>
                {/*only show MYPAGE when user has login*/}
                {isLoggedIn && (
                    <div className={styles.mypage} onClick={handleMypageClick}>
                        <h2>MYPAGE</h2>
                    </div>
                )}
                {/*<div className={styles.mypage} onClick={handleMypageClick}>*/}
                {/*    <h2>MYPAGE</h2>*/}
                {/*</div>*/}
                <div className={styles.home} onClick={handleBackClick}>
                    <h2>HOME</h2>
                </div>
                <div className={styles.login} onClick={handleLoginClick}>
                    <h2>LOGIN</h2>
                </div>
                <div className={styles.logout} onClick={handleLogoutClick}>
                    <h2>LOGOUT</h2>
                </div>

            </div>
        </div>
    );
};

export default Popup;
