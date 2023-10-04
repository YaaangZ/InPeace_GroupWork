import React, {useState} from 'react';
import Account from './Account';
import Profile from './Profile';
// import Footer from '../header/MainPageFooter';
import styles from './MyPage.module.css';

const MyPage = () => {
    const [view, setView] = useState('account');

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2 className={styles.userSetting}>User Settings</h2>
                <div className={styles.setView}>
                    <button
                        className={`${styles.button} ${view === 'account' ? styles.active : ''}`}
                        onClick={() => setView('account')}>
                        Account
                    </button>
                    <button
                        className={`${styles.button} ${view === 'profile' ? styles.active : ''}`}
                        onClick={() => setView('profile')}>
                        Profile
                    </button>
                    {view === 'account' && <Account/>}
                    {view === 'profile' && <Profile/>}
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default MyPage;
