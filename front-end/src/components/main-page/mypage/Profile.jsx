import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../AuthContext';
// import Cookies from 'js-cookie';
import styles from'./Profile.module.css';

const Profile = () => {
    // user name
    const [username, setUsername] = useState('');
    const [savedUsername, setSavedUsername] = useState('');
    // user bio
    const [about, setAbout] = useState(null);
    const [savedAbout, setSavedAbout] = useState(null);
    const [aboutCount, setAboutCount] = useState(140);
    // user avatar
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatarID, setSelectedAvatarID] = useState(null);
    const [selectedAvatarSvg, setSelectedAvatarSvg] = useState(null);
    const [savedSelectedAvatarID, setSavedSelectedAvatarID] = useState(null);
    const [savedSelectedAvatarSvg, setSavedSelectedAvatarSvg] = useState(null);
    // preferred busyness level
    const [selectedBusynessLevel, setSelectedBusynessLevel] = useState(null);
    const [savedSelectedBusynessLevel, setSavedSelectedBusynessLevel] = useState(null);
    const [busynessLevels, setBusynessLevels] = useState([]);
    // preferred category
    const [selectedPreferredCategory, setSelectedPreferredCategory] = useState(null);
    const [savedSelectedPreferredCategory, setSavedSelectedPreferredCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    // indoor outdoor
    const [indooroutdoor, setIndoorOutdoor] = useState(null);
    const [saveSelectedIndoorOutdoor, setSavedSelectedIndoorOutdoor] = useState(null);
    const [selectedIndoorOutdoor, setSelectedIndoorOutdoor] = useState(null);
    // user MBTI
    const [selectedUserMBTI, setSelectedUserMBTI] = useState(null);
    const [savedSelectedUserMBTI, setSavedSelectedUserMBTI] = useState(null);
    const [mbti,setUserMBTI]= useState([]);
    // accessibility needs
    const [accessibilityNeeds,setAccessibilityNeeds] = useState([]);
    const [selectedAccessibilityNeeds, setSelectedAccessibilityNeeds] = useState([]);
    const [savedSelectedAccessibilityNeeds, setSavedSelectedAccessibilityNeeds] = useState([]);
    // amenity needs
    const [selectedAmenityNeeds, setSelectedAmenityNeeds] = useState([]);
    const [savedSelectedAmenityNeeds, setSavedSelectedAmenityNeeds] = useState([]);
    const [amenityNeeds, setAmenityNeeds] = useState([]);

    const { userID } = useContext(AuthContext);
    const {token} = useContext(AuthContext);

    // deal with the defalut mbti and busyness level json value
    function isValidFormat(value) {
        return value && typeof value === "string" && !value.includes("inpeace.userservice.model");
    }

    useEffect(() => {
        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BACKEND_URL + '',
            // withCredentials: true, 
        });
        axiosInstance.get(`/user/profile/${userID}`,
        {headers: {
                    'Authorization': `Bearer ${token}`
                }})
        .then(response => {
            const data = response.data;
            console.log(data); 
            setUsername(data.username);
            setSavedUsername(data.username);
            setAbout(data.bio);
            setSavedAbout(data.bio);
            setSelectedBusynessLevel(isValidFormat(data.preferredBusyness) ? data.preferredBusyness : null);
            setSavedSelectedBusynessLevel(isValidFormat(data.preferredBusyness) ? data.preferredBusyness : null);
            // setSelectedBusynessLevel(data.preferredBusyness);
            // setSavedSelectedBusynessLevel(data.preferredBusyness);
            setSelectedPreferredCategory(data.preferredCategory);
            setSavedSelectedPreferredCategory(data.preferredCategory);
            // setSelectedIndoorOutdoor(data.preferredIndoorOutdoor);
            // setSavedSelectedIndoorOutdoor(data.preferredIndoorOutdoor);
            setSelectedIndoorOutdoor(isValidFormat(data.preferredIndoorOutdoor) ? data.preferredIndoorOutdoor : null);
            setSavedSelectedIndoorOutdoor(isValidFormat(data.preferredIndoorOutdoor) ? data.preferredIndoorOutdoor : null);
            // setSelectedUserMBTI(data.myersBriggsType);
            // setSavedSelectedUserMBTI(data.myersBriggsType)
            setSelectedUserMBTI(isValidFormat(data.myersBriggsType) ? data.myersBriggsType : null);
            setSavedSelectedUserMBTI(isValidFormat(data.myersBriggsType) ? data.myersBriggsType : null);
            setSelectedAccessibilityNeeds(data.accessibilityNeeds);
            setSavedSelectedAccessibilityNeeds(data.accessibilityNeeds);
            setSelectedAmenityNeeds(data.amenityNeeds);
            setSavedSelectedAmenityNeeds(data.amenityNeeds);
            setSelectedAvatarSvg(data.avatar);
            axiosInstance.get('/user/preferences/avatars')
                .then(response => {
                    setAvatars(response.data);
                    const matchingAvatar = response.data.find(avatar => avatar.avatar === data.avatar);
                    if (matchingAvatar) {
                        setSelectedAvatarID(matchingAvatar.avatarID);
                        setSavedSelectedAvatarID(matchingAvatar.avatarID);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
            setSavedSelectedAvatarSvg(data.avatar);
            })
        .catch(error => {
            console.error(error);
        });
    
        // Fetch avatars
        axiosInstance.get('/user/preferences/avatars')
        .then(response => {
            setAvatars(response.data);
            console.log(response.data)
        })
        .catch(error => {
            console.error(error);
        });

        // Fetch the list of busyness-level
        axiosInstance.get('/user/preferences/busyness-levels')
        .then(response => {
            console.log(response.data);
            setBusynessLevels(response.data);
        })
        .catch(error => {
            console.error(error);
        });

        // Fetch preferred places
        axiosInstance.get('/user/preferences/categories')
        .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            console.error(error);
        });

        // Fetch MBTI
        axiosInstance.get('/user/preferences/mbti')
        .then(response => {
            console.log(response.data);
            setUserMBTI(response.data);
        })
        .catch(error => {
            console.error(error);
        });
        
        // Fetch accessibility needs
        axiosInstance.get('/user/preferences/accessibility-needs')
        .then(response => {
            setAccessibilityNeeds(response.data);
        })
        .catch(error => {
            console.error(error);
        });

         // Fetch amenity needs
         axiosInstance.get('/user/preferences/amenity-needs')
         .then(response => {
            setAmenityNeeds(response.data);
         })
         .catch(error => {
             console.error(error);
         });
        
         // Fetch Indoor/Outfoor
         axiosInstance.get('/user/preferences/indoor-outdoor')
         .then(response => {
            setIndoorOutdoor(response.data);
         })
         .catch(error => {
             console.error(error);
         });
},[userID,token]);
    
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleAboutChange = (event) => {
        const input = event.target.value;
        setAbout(input);
        setAboutCount(140 - input.length);
    };

    const handleAvatarClick = (avatar) => {
        setSelectedAvatarID(avatar.avatarID);
        setSelectedAvatarSvg(avatar.avatar);
    };

    const handleBusynessChange = (event) => {
        if (event.target.value === "--Select--") {
            setSelectedBusynessLevel(null);
        } else {
            setSelectedBusynessLevel(event.target.value);
        }
    };

    const handlePreferredCategoryChange = (event) => {
        if(event.target.value === "--Select--"){
            setSelectedPreferredCategory(null);
        }else{
            setSelectedPreferredCategory(event.target.value);
        }
    };

    const handleIndoorOutdoorChange = (event) => {
        if(event.target.value ==="--Select--"){
            setSavedSelectedIndoorOutdoor(null);
        }else{
            setSelectedIndoorOutdoor(event.target.value);
        }
    };

    const handleMbtiChange = (event) => {
        if (event.target.value === "--Select--") {
            setSelectedUserMBTI(null);
        } else {
            setSelectedUserMBTI(event.target.value);
        }
    };

    const handleAccessibilityNeedsChange = (e) => {
        const { value, checked } = e.target;

        setSelectedAccessibilityNeeds(prevState => {
            if (checked) {
                return [...prevState, value]; // add accessibility
            } else {
                return prevState.filter(accessibility => accessibility !== value); // remove accessibility
            }
        });
    }

    const handleAmenityNeedsChange = (e) => {
        const { value, checked } = e.target;
    
        setSelectedAmenityNeeds(prevState => {
            if (checked) {
                return [...prevState, value]; // add amenity
            } else {
                return prevState.filter(amenity => amenity !== value); // remove amenity
            }
        });
    };    

    const handleSaveClick = () => {
        const profileData = {
            username: username,
            bio: about,
            avatar: selectedAvatarID,
            preferredBusyness: selectedBusynessLevel,
            preferredCategory: selectedPreferredCategory,
            preferredIndoorOutdoor: selectedIndoorOutdoor,
            myersBriggsType:selectedUserMBTI,
            accessibilityNeeds: selectedAccessibilityNeeds,
            amenityNeeds: selectedAmenityNeeds,
        };
        
        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BACKEND_URL + '',
            // withCredentials: true,
            // crossOriginal: true,
        });
        const user = localStorage.getItem('user');
        axiosInstance.put(`/user/update/${userID}`,profileData,{headers: {

                'Authorization': `Bearer ${user}`
                // 'Authorization': `${user}`
            } })
        .then(response => {
            console.log(profileData);
            if (response.status === 200) {
                alert('Profile saved successfully!');
                // Update saved states with current states
                setSavedUsername(username);
                setSavedAbout(about);
                setSavedSelectedAvatarID(selectedAvatarID);
                setSavedSelectedBusynessLevel(selectedBusynessLevel);
                setSavedSelectedPreferredCategory(selectedPreferredCategory);
                setSelectedIndoorOutdoor(selectedIndoorOutdoor);
                setSavedSelectedUserMBTI(selectedUserMBTI);
                setSavedSelectedAccessibilityNeeds(selectedAccessibilityNeeds);
                setSavedSelectedAmenityNeeds(selectedAmenityNeeds);
            } else {
                throw new Error(response.data.message);
            }
        })
        .catch(error =>{
        console.log(error.response);})
    }

    const handleCancelClick = () => {
        // Reset states to saved states
        setUsername(savedUsername);
        setAbout(savedAbout);
        setSelectedAvatarID(savedSelectedAvatarID);
        setSelectedAvatarSvg(savedSelectedAvatarSvg);
        setSelectedBusynessLevel(savedSelectedBusynessLevel);
        setSelectedPreferredCategory(savedSelectedPreferredCategory);
        setSelectedIndoorOutdoor(saveSelectedIndoorOutdoor);
        setSelectedUserMBTI(savedSelectedUserMBTI);
        setSelectedAccessibilityNeeds(savedSelectedAccessibilityNeeds);
        setSelectedAmenityNeeds(savedSelectedAmenityNeeds);
    };

    return (
        <div>
            <h2 className={styles.title}>Profile</h2>
            <h2 className={styles.title2}>Customize profile</h2>
            <h3 className={styles.subtitle}>PEROFILE INFORMATION</h3>
            <section>
                <label className={styles.heading}>
                    Username
                    <p className={styles.text}>Set a display name. Anyone can see this information in the community when you make contact with them.</p>
                    <input type="text" value={username} onChange={handleUsernameChange} style={{marginLeft:'20px',marginBottom:'20px',}}/>
                </label>
            </section>
            <section>
                <label className={styles.heading}>
                    About
                    <p className={styles.text}>A brief descrpition of yourself shown on your profile.</p>
                    <div>
                        <textarea 
                            placeholder="About (optional)" 
                            maxLength="140" 
                            rows="4" 
                            value={about}
                            onChange={handleAboutChange}
                            style={{marginBottom: "0px", resize: "both",marginLeft:'20px',width:'75%',}}
                        />
                        <div>
                            <div className={styles.text} style={{color:'#ABB2B9',}}>{aboutCount} Characters remaining</div>
                        </div>
                    </div>
                </label>
            </section>
            <div>
                <h3 className={styles.subtitle}>IMAGE</h3>
                <div className={styles.avatarContainer}>
                    <div className={styles.selectedAvatar} 
                        dangerouslySetInnerHTML={{__html: selectedAvatarSvg ? selectedAvatarSvg.replace("<svg", '<svg width="70pt" height="70pt" viewBox="0 0 512 512"') : '' }} />
                    </div>
                    <div>
                        <h3 className={styles.heading}>Choose your Avatars</h3>
                        <div className={styles.avatarList}>
                        {avatars.map((avatar, index) => (
                            <div key={index} onClick={() => handleAvatarClick(avatar)}> 
                                <div dangerouslySetInnerHTML={{__html: avatar.avatar.replace("<svg", '<svg width="70pt" height="70pt" viewBox="0 0 512 512"')}} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
                <h3 className={styles.heading}>ADVANCED(optional)</h3>
                <p className={styles.text} style={{marginTop:'-15px',}}>This information is private, only you can see them.</p>
                <div className={styles.preferenceContainer}>
                <h4 className={styles.heading} style={{fontSzie:'16px',}}>Places Preference</h4>
                <section className={styles.section}> 
                    <label className={styles.option}>
                        Preferred  busyness level
                        <select value={selectedBusynessLevel} onChange={handleBusynessChange} className={styles.select}>
                            <option>--Select--</option>
                            {busynessLevels.map((level, index) => (
                                <option key={index} value={level}>{level}</option>
                            ))}
                        </select>
                    </label>
                </section>
                <section>
                    <label className={styles.option}>
                        Preferred category
                        <select value={selectedPreferredCategory} onChange={handlePreferredCategoryChange} className={styles.select}>
                            <option>--Select--</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </label>
                </section>
                <h4 className={styles.heading} style={{fontSzie:'16px',}}>Personal Preference</h4>
                <section className={styles.section}>
                    <label className={styles.option}>
                    I am an indoor/outdoor person
                        <select value={selectedIndoorOutdoor} onChange={handleIndoorOutdoorChange} className={styles.select}>
                            <option>--Select--</option>
                            {Array.isArray(indooroutdoor) && indooroutdoor.map((indooroutdoor, index) => (
                                <option key={index} value={indooroutdoor}>{indooroutdoor}</option>
                            ))}
                        </select>
                    </label>
                </section>
                <section className={styles.section}>
                    <label className={styles.option}>
                        MBTI
                        <select value={selectedUserMBTI} onChange={handleMbtiChange} className={styles.select}>
                            <option>--Select--</option>
                            {mbti.map((mbti, index) => (
                                <option key={index} value={mbti.acronym}>{mbti.fullName}</option>
                            ))}
                        </select>
                    </label>
                </section>
                <section className={styles.section}>
                    <label className={styles.option}>
                        Accessibility Needs
                        <div className={styles.gridContainer}>
                            {Array.isArray(accessibilityNeeds) && accessibilityNeeds.map((need, index) => (
                                <div key={index} className={styles.gridItem}>
                                    <input
                                    type="checkbox"
                                    id={`accessibility_${index}`}
                                    value={need}
                                    checked={selectedAccessibilityNeeds.includes(need)}
                                    onChange={handleAccessibilityNeedsChange}
                                    />
                                <label htmlFor={`accessibility_{index}`}>{need}</label>
                            </div>
                            ))}
                        </div>
                    </label>
                </section>
                <section className={styles.section}>
                    <label className={styles.option}>
                        Amenity Needs
                        <div className={styles.gridContainer}>
                            {Array.isArray(amenityNeeds) && amenityNeeds.map((need, index) => (
                                <div key={index} className={styles.gridItem}>
                                    <input 
                                        type="checkbox" 
                                        id={`amenity_${index}`} 
                                        value={need}
                                        checked={selectedAmenityNeeds.includes(need)}
                                        onChange={handleAmenityNeedsChange}
                                    />
                                    <label htmlFor={`amenity_${index}`}>{need}</label>
                                </div>
                            ))} 
                        </div>
                    </label>
                </section>
                <section className={styles.buttonContainer}>
                    <button onClick={handleSaveClick} className={styles.button}>Save</button>
                    <button onClick={handleCancelClick} className={styles.button}>Cancel</button>
                </section>
                </div>
            </div>
    );
};

export default Profile;
