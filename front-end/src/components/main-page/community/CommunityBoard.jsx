import React, { useState, useEffect, useContext } from 'react';
import styles from './CommunityBoard.module.css';
import PostList from './communityComponents/PostList';
import TagFilter from './communityComponents/TagFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import places from "./CommunityBoard.jsx";
import {csv} from "d3";
import UpdatePostFlag from "./UpdatePostFlag.jsx"
import { AuthContext } from '../../../AuthContext';
import BookmarkContext from './BookmarkContext';
import AllPostsFetchedContext from './AllPostsFetchedContext';
import RefreshFlagContext from './RefreshFlagContext';

const CommunityBoard = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedPlace, setSelectedPlace] = useState('All');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [places, setPlaces] = useState([]);
  const [genres, setGenres] = useState([]);
  const [posts, setPosts] = useState([]);
  const storedPostLimit = sessionStorage.getItem('postLimit');
  const [postLimit, setPostLimit] = useState(storedPostLimit ? parseInt(storedPostLimit) : 10);
  const [zones, setZones] = useState([]);
  const [lastTagFetchTime, setLastTagFetchTime] = useState(Date.now());
  const [fetchZonesFlag, setFetchZonesFlag] = useState(false);
  const [sortType, setSortType] = useState("---");
  const { updateFlag, setUpdateFlag } = useContext(UpdatePostFlag);
  const [placeShowValue, setPlaceShowValue] = useState("default");
  const [popupVisible, setPopupVisible] = useState(false);
  const [sortValue, setSortValue] = useState("new");
  const { userID } = useContext(AuthContext);
  const { token } = useContext(AuthContext);
  const [bookmarkPosts, setBookmarkPosts] = useState([]);
  const [starActive, setStarActive] = useState(() => {
    const storedStarActive = JSON.parse(localStorage.getItem('starActive')) || false;
    return storedStarActive;
  });
  
  const { allPostsFetched, setAllPostsFetched } = useContext(AllPostsFetchedContext);
  const { refreshFlag, setRefreshFlag } = useContext(RefreshFlagContext);
  const { bookmarkChange, setBookmarkChange } = useContext(BookmarkContext);
  const [allPlaces, setAllPlaces] = useState([]);

  useEffect(() => {
    if (updateFlag) {
      setPopupVisible(true);
    }
  }, [updateFlag]);

  const handlePopupClose = () => {
    setPopupVisible(false);
    setUpdateFlag(false);
    fetchPosts();
  };


  const loadMorePosts = () => {
    const storedAllPostsFetched = JSON.parse(sessionStorage.getItem('allPostsFetched')) || false;
    setAllPostsFetched(storedAllPostsFetched);
    if (!allPostsFetched) {
      setPostLimit((prevLimit) => prevLimit + 10);
      setRefreshFlag(true);
      // console.log("this");
    }else{
      setRefreshFlag(true);
     // console.log("that");
    }
  };

  const navigate = useNavigate();

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  const handleZoneChange = (zone) => {
    setSelectedZone(zone);
};


  const handlePlaceChange = (place) => {
    setSelectedPlace(place);
  };

  const handleTagChange = (tag) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tag)) {
        return prevSelectedTags.filter((t) => t !== tag);
      } else {
        return [...prevSelectedTags, tag];
      }
    });
  };


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
        

  
            const fetchPosts = async () => {
              if (!token || (allPostsFetched && !refreshFlag)) {
                  setUpdateFlag(false);
                  return;
              }
          
              if (updateFlag) {
                  console.log("Fetching posts...");
                  try {
                      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/community/posts/recent/${postLimit}`, {
                          method: 'GET',
                          headers: {
                              'Authorization': `Bearer ${token}`
                          },
                      });
          
                      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
                      const posts = await response.json();
          
                      
                      const uniquePlaceIDs = [...new Set(posts.filter(post => post.placeID).map(post => post.placeID))];

                      if (uniquePlaceIDs.length > 0) {
                        const placesResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/places/places`, {
                          method: 'POST',
                          headers: {
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(uniquePlaceIDs)
                      });
                      
          
                          if (!placesResponse.ok) throw new Error(`HTTP error when fetching places! status: ${placesResponse.status}`);

                          const places = await placesResponse.json();
                          console.log(places); 

                          const placeLookup = places.reduce((acc, place) => {
                              acc[place.place_id] = place;
                              return acc;
                          }, {});
          
                          const updatedPosts = posts.map(post => {
                              return {
                                  ...post,
                                  place: post.placeID ? placeLookup[post.placeID] : null
                              };
                          });
          
                          setPlaces(places);
                          if(!starActive){
                          setPosts(updatedPosts);
                          }
                          sessionStorage.setItem('posts', JSON.stringify(updatedPosts));
                          
                          if (posts.length < postLimit) {
                            setAllPostsFetched(true);
                            sessionStorage.setItem('allPostsFetched', 'true');
                        } else {
                            setAllPostsFetched(false);
                            sessionStorage.setItem('allPostsFetched', 'false');
                        }
                      }
          
                      setUpdateFlag(false);
                      setRefreshFlag(false);
          
                  } catch (err) {
                      console.error(`Error fetching posts: ${err}`);
                  }
              } else {
                  const storedPosts = JSON.parse(sessionStorage.getItem('posts')) || [];
                  setPosts(storedPosts);
                  const storedUniquePlaces = JSON.parse(sessionStorage.getItem('uniquePlaces')) || [];
                  setPlaces(storedUniquePlaces);
              }
          };
          
  
  useEffect(() => {
    if(refreshFlag){
      fetchPosts();
      sessionStorage.setItem('postLimit', postLimit);
    }}, [postLimit, refreshFlag]);

          
    useEffect(() => {
      if (posts.length === 0) {
        const storedPosts = JSON.parse(sessionStorage.getItem('posts')) || [];
        setPosts(storedPosts);
      }
    }, []);      
          

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
  



  const handlePostingClick = () => {
    navigate('/community/post');
  };

  const handleBackIconClick = () => {
    navigate('/');
  };


  useEffect(() => {
    const storedSortValue = sessionStorage.getItem('sortValue');
    if (storedSortValue) {
      setSortValue(storedSortValue);
      if (storedSortValue === 'old') {
        setPosts(prevPosts => [...prevPosts].reverse());
      }
    }
  }, []);

  const handleSortChange = (event) => {
    const selectedSortValue = event.target.value;
    setSortValue(selectedSortValue);
    sessionStorage.setItem('sortValue', selectedSortValue);
    if (selectedSortValue === 'old' || (sortValue === 'old' && selectedSortValue === 'new')) {
      setPosts(prevPosts => [...prevPosts].reverse());
    }
  };


  const fetchPostsByIds = async (postIds) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/community/posts`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postIds)
    });

    if (!response.ok) {
        console.error(`Error: ${response.status}`);
        return [];
    }

    return await response.json();
};

const fetchPlacesByIds = async (placeIds) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/places/places`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(placeIds)
    });

    if (!response.ok) {
        console.error(`Error when fetching places: ${response.status}`);
        return [];
    }

    return await response.json();
};

const fetchBookmarkedPosts = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${userID}/bookmark-posts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error(`Error: ${response.status}`);
            return [];
        }

        const data = await response.json();
        const bookmarkedPostIds = data.map(post => post.postID);

        const bookmarkedPosts = await fetchPostsByIds(bookmarkedPostIds);

        const placeIds = bookmarkedPosts
            .filter(post => post.placeID != null)
            .map(post => post.placeID);

        const places = await fetchPlacesByIds(placeIds);

        bookmarkedPosts.forEach(post => {
            post.place = places.find(place => place.place_id === post.placeID) || null;
        });

        return bookmarkedPosts;
    } catch (error) {
        console.error(error);
        return [];
    }
};



  

  const handleStarClick = async () => {
    if (starActive) {
      setStarActive(false);
      localStorage.setItem('starActive', JSON.stringify(false));
      const storedPosts = JSON.parse(sessionStorage.getItem('posts')) || [];
      setPosts(storedPosts);
    } else {
      let bookmarkedPosts = bookmarkPosts;
    
        setStarActive(true);
        localStorage.setItem('starActive', JSON.stringify(true));
        setPosts(bookmarkedPosts);
      
    }
  };
  
  
  useEffect(() => {
    const storedStarActive = JSON.parse(localStorage.getItem('starActive')) || false;
    let storedBookmarkPosts;
    try {
        storedBookmarkPosts = JSON.parse(localStorage.getItem('bookmarkPosts')) || null;
    } catch (e) {
        storedBookmarkPosts = null;
    }

    if(storedBookmarkPosts === null){
        fetchBookmarkedPosts().then(bookmarkedPosts => {
            localStorage.setItem('bookmarkPosts', JSON.stringify(bookmarkedPosts));
            setBookmarkPosts(bookmarkedPosts);
        });    
    } else {
        if (storedStarActive && bookmarkChange) {
            fetchBookmarkedPosts().then(bookmarkedPosts => {
              localStorage.setItem('bookmarkPosts', JSON.stringify(bookmarkedPosts));
                setPosts(bookmarkedPosts);
                setBookmarkPosts(bookmarkedPosts);
                setBookmarkChange(false);
            });
           
        } else if (storedStarActive && !bookmarkChange){
            setPosts(storedBookmarkPosts);
            setBookmarkPosts(storedBookmarkPosts);
            
        } else {
            const storedPosts = JSON.parse(sessionStorage.getItem('posts')) || [];
            const storedAllPostsFetched = JSON.parse(sessionStorage.getItem('allPostsFetched')) || false;
            setAllPostsFetched(storedAllPostsFetched);
            if(allPostsFetched && !refreshFlag){
                setPosts(storedPosts);
            }else{

                setUpdateFlag(true);
                sessionStorage.setItem('postLimit', postLimit);
                
            }
            setBookmarkPosts(storedBookmarkPosts);
        }
    }
}, [starActive]);



  return (
    <div className={styles.community}>
      <div className={styles.topPart}>
        <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} onClick={handleBackIconClick} />
        <div className={styles.createPost} onClick={handlePostingClick}>
          Create a post
        </div>
        <div className={styles.topText}>
          <h1>InPeace Community</h1>
        </div>
        <div className={styles.topBottom}>
        <div className={styles.favStar}>
        <FontAwesomeIcon 
            icon={faStar} 
            className={starActive ? `${styles.star} ${styles.starActive}` : `${styles.star} ${styles.starInactive}`} 
            onClick={handleStarClick}
        />

        </div>

        
        <div className={styles.sortOption}>
        <select value={sortValue} onChange={handleSortChange}>
          <option value="new">New to Old</option>
          <option value="old">Old to New</option>
        </select>

        </div>
        </div>
      </div>
       <TagFilter
            selectedGenre={selectedGenre}
            selectedZone={selectedZone}
            selectedPlace={selectedPlace}
            selectedTags={selectedTags}
            onGenreChange={handleGenreChange}
            onZoneChange={handleZoneChange}
            onPlaceChange={handlePlaceChange}
            onTagChange={handleTagChange}
            places={places || []} 
            genres={genres || []} 
            zones={zones || []}
            tags={tags || []}
            placeShowValue = {placeShowValue}
            setPlaceShowValue = {setPlaceShowValue}
          />

      <div className={styles.postContainer}>
        <PostList
          genre={selectedGenre}
          area={selectedZone}
          place={selectedPlace}
          selectedTags={selectedTags}
          posts={posts}
          loadMorePosts={loadMorePosts}
          tags={tags}
          placeShowValue = {placeShowValue}
          bookmarkPosts = {bookmarkPosts}
          fetchPosts = {fetchPosts}
        />
      </div>
    </div>
  );
};

export default CommunityBoard;
