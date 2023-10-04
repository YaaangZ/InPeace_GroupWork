import React, { useState, useEffect, useContext, useRef } from 'react';
import styles from './PostList.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import UpdatePostFlag from "../UpdatePostFlag"
import { AuthContext } from '../../../../AuthContext';
import RefreshFlagContext from '../RefreshFlagContext';
import BookmarkContext from '../BookmarkContext';

const PostList = ({ genre, area, place, selectedTags, posts, tags, loadMorePosts, placeShowValue, bookmarkPosts, fetchPosts}) => {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const navigate = useNavigate();
  const { updateFlag, setUpdateFlag } = useContext(UpdatePostFlag);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const { userID } = useContext(AuthContext);
  const { token } = useContext(AuthContext);
  const [topPost, setTopPost] = useState(null);
  const [isMappingDone, setIsMappingDone] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { refreshFlag, setRefreshFlag } = useContext(RefreshFlagContext);
  const { bookmarkChange, setBookmarkChange } = useContext(BookmarkContext);

  useEffect(() => {
    if (topPost) {
      topPost.scrollIntoView({ behavior: 'smooth' });
    }
  }, [topPost]);

  const topPostRef = (node) => {
      if (node !== null) {
        setTopPost(node);
      }
  };
  
  
  const adjustAvatarSize = (avatar) => {
    if (avatar) {
      return avatar.replace('<svg ', '<svg style="height: 80%; width: 80%;"');
    }
  
    return null;
  }
  
  
  useEffect(() => {
    let filteredPosts = [];
    if(placeShowValue === "withPlace"){
      filteredPosts = posts.filter(post => post.placeID !== null);
    } else if(placeShowValue === "withoutPlace") {
      filteredPosts = posts.filter(post => post.placeID === null);
    } else {
      filteredPosts = posts; 
    }
    setFilteredPosts(filteredPosts); 
  },[placeShowValue]);
  
  
  useEffect(() => {
    const filtered = posts.filter((post) => {
      const matchGenre = genre === 'All' || post.place?.category === genre || post.place?.category === null;
      const matchArea = area === 'All' || post.place?.zone_id === area || post.place?.zone_id === null;
      const matchPlace = place === 'All' || post.postPlaceID === place.place_ID;
      const matchTags = selectedTags.length === 0 || selectedTags.every((tag) => post.postTags.includes(tag));
      return matchGenre && matchArea && matchPlace && matchTags;
    });

    setFilteredPosts(filtered);
  }, [genre, area, place, selectedTags, posts]);


  const handlePostClick = async (postId) => {
    const selectedPost = posts.find((post) => post.postID === postId);
    const isBookmarked = isPostBookmarked(postId);

    localStorage.setItem('selectedPostId', postId);

    navigate(`/community/${postId}`, { state: { post: selectedPost, isBookmarked: isBookmarked} });
};



  const handleDelete = postID => {
    setDeleteConfirm(true);
    
    if(window.confirm("Are you sure you want to delete this post?")) {
      
      fetch(`${process.env.REACT_APP_BACKEND_URL}/community/posts/${postID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        alert(data.message);
        setRefreshFlag(true);
        setUpdateFlag(true);
        const isBookmarked = isPostBookmarked(postID);
        if(isBookmarked){
          setBookmarkChange(true);
        }
        navigate("/community");
        fetchPosts();
        
      })
      .catch(error => {
        console.log('Error:', error);
        alert('Failed to delete post.');
      });
    } else {
      setDeleteConfirm(false);
    }
  }

  useEffect(() => {
    if (filteredPosts.length > 0 || posts.length > 0) {
      setIsMappingDone(false);
      setTimeout(() => setIsMappingDone(true), 3500);
    }
  }, [posts]);

  const isPostBookmarked = (postId) => {
    return bookmarkPosts === null ? false : bookmarkPosts.some((post) => post.postID === postId);
};

  return (
    <div className={styles.posts}>
      
      <div className={styles.bottomBox}>
      {updateFlag  && (
        <button className={styles.loadMoreButton} onClick={loadMorePosts}>
          Load More
        </button>

      )}
      <div className={isMappingDone ? styles.page : `${styles.page} ${styles.disabledScroll}`}>
      {(filteredPosts.length > 0 && filteredPosts) ? (
  filteredPosts.map((post, index) => (
    (() => {
      return (
        <div
          key={post.postID}
          className={`${styles.post} ${styles.animation}`}
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => handlePostClick(post.postID)}
          ref={index === 0 ? topPostRef : null}
        >
          {post.placeID ? (
            <div className={styles.placeBox}>
              <div className={styles.placeImage} 
              style={{
                backgroundImage: post.place && post.place.image ? `url(${post.place.image})` : 'none',
                backgroundColor: post.place && post.place.image ? 'transparent' : 'white'
              }}></div>
              {post.userID === userID && <div className={styles.myPlacePost}>My Post</div>}
              <div className={styles.placePostBox}>
                <div className ={styles.placePostTop}>
                <div className={styles.placeUser}>
                <div className={styles.avatarDiv} dangerouslySetInnerHTML={{ __html: adjustAvatarSize(post.avatar) }}></div>
                  <div className={styles.placeUserID}><h3>{post.username}</h3></div>
                </div>
                <div className={styles.placeTitle}>
                  <h3>{post.postTitle}</h3>
                </div>
                </div>
                <div className={styles.placeContent}>
                  <p>{post.postContent}</p>
                </div>
                {post.userID === userID && <div className={styles.deletePlacePost} onClick={() => handleDelete(post.postID)}>Delete Post</div>}
              </div>
            </div>
          ) : (
            <div className={styles.generalPostBox}>
              <div className={styles.generalUser}>
              <div className={styles.generalAvatarDiv} dangerouslySetInnerHTML={{ __html: adjustAvatarSize(post.avatar) }}></div>
                  <div className={styles.generalPlaceUserID}><h3>{post.username}</h3></div>
                </div>
              {post.userID === userID && <div className={styles.myPost}>My Post</div>}
              <div className={styles.generalTitle}>
                <h2>{post.postTitle}</h2>
              </div>
              <div className={styles.generalContent}>
                <p>{post.postContent}</p>
              </div>
              {post.userID === userID && <div className={styles.deletePost} onClick={() => handleDelete(post.postID)}>Delete Post</div>}
            </div>
          )}
        </div>
      );
    })()
  ))
) : (
  <div className={styles.noPosts}><h2>No Posts</h2></div>
)}

      </div>
      </div>
    </div>
  );
};

export default PostList;
