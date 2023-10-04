import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Post.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import ReactStars from 'react-rating-stars-component';
import UpdatePostFlag from '../UpdatePostFlag';
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { AuthContext } from '../../../../AuthContext';
import {csv} from "d3";
import AllPostsFetchedContext from '../AllPostsFetchedContext';

const Post = () => {
  const navigate = useNavigate();
  const [lastTagFetchTime, setLastTagFetchTime] = useState(Date.now());
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [zone, setZone] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [showPostContainer, setShowPostContainer] = useState(false);
  const [rating, setRating] = useState(0);
  const [postType, setPostType] = useState("place");
  const [selectedTags, setSelectedTags] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const { updateFlag, setUpdateFlag } = useContext(UpdatePostFlag);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7831, lng: -73.9712 });
  const [postMessage, setPostMessage] = useState('');
  const [postFailMessage, setFailPostMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showFailMessage, setShowFailMessage] = useState(false);
  const location = useLocation();

  const [zones, setZones] = useState([]);
  const [fetchZonesFlag, setFetchZonesFlag] = useState(false);
  const { userID } = useContext(AuthContext);
  const { token } = useContext(AuthContext);
  const [tags, setTags] = useState([]);
  const [categories, setGenres] = useState([]);
  const { allPostsFetched, setAllPostsFetched } = useContext(AllPostsFetchedContext);

  useEffect(() => {
    if (postType === "place") {
      setFilteredPlaces([]);
      setZone("");
    }
  }, [postType]); 
  
  
  useEffect(() => {
    if (!fetchZonesFlag) {
        
        const storedZones = sessionStorage.getItem('zones');
        
        if (storedZones) {
            
            setZones(JSON.parse(storedZones));
            setFetchZonesFlag(true);
        } else {
            fetch(process.env.REACT_APP_BACKEND_URL + '/map/zones')  
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error fetching taxi zone data.');
                    }
                    return response.json();
                })
                .then(data => {
                    const fetchedZones = data.map(feature => ({
                      id: feature.properties.zoneID,
                      name: feature.properties.streetName
                    }));
                    
                    sessionStorage.setItem('zones', JSON.stringify(fetchedZones));
                    
                    setZones(fetchedZones);
                    setFetchZonesFlag(true);
                })
                .catch(err => console.error(`Error fetching zones: ${err.message}`));
        }
    }
}, []);

useEffect(() => {
  if (!token) return;


  const storedTags = sessionStorage.getItem('tags');
  
  if (storedTags) {
      setTags(JSON.parse(storedTags));
  } else {
      
      fetch(process.env.REACT_APP_BACKEND_URL + '/community/tags', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
      })
      .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
      })
      .then(data => {
          setTags(data);
          sessionStorage.setItem('tags', JSON.stringify(data)); 
      })
      .catch(err => console.error(`Error fetching tags: ${err}`));
  }
}, [token]);

          useEffect(() => {
            if (!token) return;
        
         
            const storedGenres = sessionStorage.getItem('genres');
            
            if (storedGenres) {
                setGenres(JSON.parse(storedGenres));
            } else {
              
                fetch(process.env.REACT_APP_BACKEND_URL + '/user/preferences/categories', {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    },
                })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    setGenres(data);
                    sessionStorage.setItem('genres', JSON.stringify(data));  
                })
                .catch(err => console.error(`Error fetching categories: ${err}`));
            }
        }, [token]);
      

  const checkForToxicity = async (text) => {
    const apiKey = "AIzaSyBPeC_yP-F5iUVzssFdgGbDEeCQS0Q3VY0";

    try {
        const response = await fetch('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=' + apiKey, {
            method: 'POST',
            body: JSON.stringify({
                comment: {text: text},
                languages: ['en'],
                requestedAttributes: {TOXICITY: {}}
            }),
            headers: {"Content-Type": "application/json"}
        });

        const data = await response.json();
        const toxicity = data.attributeScores.TOXICITY.summaryScore.value;

        if (toxicity > 0.6) {
            console.log("Bad words");
            return true;
        } else {
          console.log("No Bad words");
            return false;
        }

    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};


  const handlePostTypeChange = (type) => {
    setPostType(type);
  }

  

  const fetchPlaces = () => {
    
    fetch(`${process.env.REACT_APP_BACKEND_URL}/places/zone/${zone}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
    .then(async response => {   
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();   
        setAllPlaces(data);
      
        const filtered = data.filter(
            (place) =>
            (inputValue === '' || place.name.includes(inputValue) || place.category === inputValue)
        );

        setFilteredPlaces(filtered);
    })
    .catch(err => console.error(`Error fetching zones: ${err}`));
};

 

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };


  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
};

  const handleZoneChange = (event) => {
    setZone(event.target.value);
  };


  const handlePlaceChange = (event, place) => {
    if (selectedPlace === place) {
      setSelectedPlace(null);
      setShowPostContainer(false);
    } else {
      setSelectedPlace(place);
      setShowPostContainer(true);
    }
  };

  const handlePlaceHover = place => {
    setHoveredPlace(place);
  }

  const handlePostSubmit = async (event) => {
    event.preventDefault();
  
    const selectedPlaceObject = filteredPlaces.find((place) => place === selectedPlace);
    // console.log("selected" + selectedPlace);

    const newPost = {
      userID: userID, 
      postTitle: title,
      postContent: comment,
      postTags: selectedTags,
      placeID: selectedPlaceObject ? selectedPlaceObject.place_id : null
    };
  

    if (await checkForToxicity(newPost.postTitle) || await checkForToxicity(newPost.postContent)) {
      alert("Mind your language.");
    } else {
      try {

        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/community/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newPost)
        });

        if (response.ok) {
          setAllPostsFetched(false);
          setUpdateFlag(true);
          setTitle('');
          setComment('');
          setSelectedTags([]);
          setInputValue('');
          setZone('');
          setSelectedPlace('');
          setShowPostContainer(false);
          setPostMessage('Successfully posted!!');
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 7000);
          const result = await response.json();
          console.log(result.message);  

        } else {
          const contentType = response.headers.get("content-type");
          if(contentType && contentType.indexOf("application/json") !== -1) {
            const result = await response.json();
            // console.log(result.message);  
            setFailPostMessage('Failed to post. Try again');
            setShowFailMessage(true);
            setTimeout(() => setShowFailMessage(false), 7000);
          } else {
            // console.log(await response.text()); 
            setFailPostMessage('Failed to post. Try again'); 
            setShowFailMessage(true);
            setTimeout(() => setShowFailMessage(false), 7000);
          }
        }

      } catch (error) {
        console.error('Error:', error);
      }
    }
};



  
  

  const handleBackIconClick = () => {
    navigate('/community');
  };

  const handlePostBackIconClick = () => {
    setSelectedPlace(null);
    setShowPostContainer(false);
  };

  const handleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((name) => name !== tag));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      } else {
       
      }
    }
  };



  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} onClick={handleBackIconClick} />
        <div className={styles.topText}><h1>InPeace Community</h1></div>    
        <div className={styles.switch}>
          <div
            className={`${styles.placeSwitch} ${postType === 'place' ? styles.active : ''}`}
            onClick={() => handlePostTypeChange('place')}
          >
            Place
          </div>
          <div
            className={`${styles.generalSwitch} ${postType === 'general' ? styles.active : ''}`}
            onClick={() => handlePostTypeChange('general')}
          >
            General
          </div>
      </div> 
      </div>
      
      {showMessage && <div className={styles.resultMessage}><p>{postMessage}</p></div>}
      {showFailMessage && <div className={styles.resultFailMessage}><p>{postFailMessage}</p></div>}

      {postType === "place" && (
      <div className={styles.bottomContainer}>
      <div className={styles.leftContainer}> 
          <div className={styles.selects}>
          <div className={styles.selectsText}><h2>Let's find a place to leave a review!</h2></div>

          <div className={styles.selectsBox}>
                <select value={zone} onChange={handleZoneChange}>
                <option value="" disabled>Select a zone</option>
                    {/* {zones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                            {zone.name}
                        </option>
                    ))} */}
                    {zones.map((zone, index) => (
                        <option key={zone.id || index} value={zone.id}>
                            {zone.name}
                        </option>
                    ))}
                </select>
                <input 
                    type="text" 
                    value={inputValue} 
                    onChange={handleInputChange} 
                    list="categories"
                    placeholder="Enter name or category"
                />
                <datalist id="categories">
                    {categories.map((category) => (
                        <option key={category} value={category} />
                    ))}
                </datalist>
                <FontAwesomeIcon className={styles.searchIcon} icon={faSearch} onClick={fetchPlaces} />
            </div>
             
          </div> 

          <div className={styles.places}>
            {filteredPlaces.map((place) => (
              <div
                key={place.place_id}
                className={`${styles.place} ${selectedPlace === place ? styles.selected : ''}`}
                onClick={(event) => handlePlaceChange(event, place)}
                onMouseOver={() => {
                  handlePlaceHover(place);
                  setMapCenter({ lat: place.coordinates.latitude, lng: place.coordinates.longitude });
                }}
                onMouseLeave={() => handlePlaceHover(null)}
              >
                <div className={styles.placeImage} style={{backgroundImage: `url(${place.image})`}}></div>
                <div className={styles.placeInfo}>
                <h2>{place.name}</h2>
                <h3>{place.category}</h3>
                <h3>{place.rating}</h3>
                </div>
              </div>
            ))}
          </div>

      </div>
      <div className={styles.rightContainer}>
        <div className={styles.mapContainer}>
        <GoogleMap
              mapContainerStyle={{ height: "100%", width: "100%" }}
              center={mapCenter}
              zoom={16}
            >
              {filteredPlaces.map((item) => (
                <Marker 
                  key={item.place_id} 
                  position={{ 
                    lat: item.coordinates.latitude, 
                    lng: item.coordinates.longitude 
                  }}
                />
              ))}
        
              {hoveredPlace && (
                <InfoWindow
                  position={{ 
                    lat: hoveredPlace.coordinates.latitude, 
                    lng: hoveredPlace.coordinates.longitude 
                  }}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div>
                    <h2>{hoveredPlace.name}</h2>
                    <p>{hoveredPlace.category}</p>
                    <p>{hoveredPlace.rating}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>


        {showPostContainer && <div className={styles.overlay}></div>}
        </div>
        
        
        {showPostContainer && (
          <div className={styles.postContainer}>
            <FontAwesomeIcon icon={faArrowLeft} className={styles.postBackIcon} onClick={handlePostBackIconClick} />
            <h2>{selectedPlace.name}</h2>
            <textarea
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter title"
              className={styles.titleInput}
            />
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Enter Comment"
              className={styles.commentInput}
            />
            <div className={styles.placeTagsBox}>
              {tags.map((tag) => (
                <label
                  key={tag}
                  className={`${styles.tag} ${selectedTags.includes(tag) ? styles.tagSelected : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagSelection(tag)}
                    className={styles.tagCheckbox}
                  />
                  <span className={styles.tagLabel}>{tag}</span>
                </label>
              ))}
            </div>


            <button type="submit" className={styles.submitButton} onClick={handlePostSubmit}>
              Post
            </button>
          </div>
        )}
      </div>

      </div>)}
      {postType === "general" && (
        <div className={styles.generalBottomContainer}>
        <div className={styles.generalLeft}>
          <div className={styles.generalText}>
            <h2>Post anything you want</h2>
          </div>
          <div className={styles.generalTitleBox}>
            <textarea
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter title"
              className={styles.generalTitleInput}
            />
          </div>
          <div className={styles.generalLeftMiddle}>
          <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Enter Comment"
              className={styles.generalCommentInput}
            />
            <div className={styles.tagsBox}>
              {tags.map((tag) => (
                <label
                  key={tag}
                  className={`${styles.tag} ${selectedTags.includes(tag) ? styles.tagSelected : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagSelection(tag)}
                    className={styles.tagCheckbox}
                  />
                  <span className={styles.tagLabel}>{tag}</span>
                </label>
              ))}
            </div>
          </div>
          <div className={styles.submitButtonBox}>
          <button type="submit" className={styles.generalSubmitButton} onClick={handlePostSubmit}>
            Post
          </button>
          </div>
        </div>

        <div className={styles.generalRight}>
          <div className={styles.postExamples}>
            <div className={styles.exampleLeft}>Where is the nicest cafe?</div>
            <div className={styles.exampleMiddle}>Recommendations for hiking spots?</div>
            <div className={styles.exampleRight}>Tips for a vegetarian restaurant?</div>
          </div>
        </div>
      </div>
      

      )}
    </div>
  );
};

export default Post;
