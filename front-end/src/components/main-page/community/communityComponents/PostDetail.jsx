import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PostDetail.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHeart, faComment, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import UpdatePostFlag from "../UpdatePostFlag";
import { AuthContext } from '../../../../AuthContext';
import BookmarkContext from '../BookmarkContext';

const PostDetail = (props) => {
  const { bookmarkChange, setBookmarkChange } = useContext(BookmarkContext);
  const location = useLocation();
  const navigate = useNavigate();

  let initialPost = null;
  let initialIsBookmarked = false;

  if (location.state) {
    initialPost = location.state.post;
    initialIsBookmarked = location.state.isBookmarked;
  } 

  const [post, setPost] = useState(initialPost);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  useEffect(() => {
    if (!location.state) {
      navigate('/community');
    }
  }, [location, navigate]);


// console.log(post);
  const { updateFlag, setUpdateFlag } = useContext(UpdatePostFlag);
  const [comment, setComment] = useState('');
  const [expandedComments, setExpandedComments] = useState([]);
  const [placeInfoVisible, setPlaceInfoVisible] = useState(false);
  const [parentCommentID, setParentCommentID] = useState(null);
  const [replyingToUsername, setReplyingToUsername] = useState(null);
  const [comments, setComments] = useState([]);
  const [parentPostID, setParentPostID] = useState(null);
  const [visibleReplies, setVisibleReplies] = useState({});

  const { userID } = useContext(AuthContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if(post){
      setParentPostID(post.postID);
    } else {
      navigate('/community');
    }
}, [post, navigate]);
  


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

        if (toxicity > 0.7) {
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


  const handleToggleReplies = (commentID) => {
    setVisibleReplies(prev => ({...prev, [commentID]: !prev[commentID]}));
};

  const fetchComments = async () => {
    if(post){
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/community/post/${post.postID}/comments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
  
    if (!response.ok || response.status === 204) {
      console.error('No comments found for this post');
      return null;
    }
  
    const data = await response.json();
    setComments(data ? data : []);}
  };
  
  useEffect(() => {
    fetchComments();
  }, []);
  


  const handlePlaceInfo = () => {
    setPlaceInfoVisible(!placeInfoVisible);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleReplyClick = (commentID, username) => {
    if (parentCommentID === commentID) {
        setParentCommentID(null);
        setReplyingToUsername(null);
        setComment('');
        setParentPostID(post.postID);
    } else {
        setParentCommentID(commentID);
        setReplyingToUsername(username);
        setComment(`@${username} `);
        setParentPostID(null);
    }
};


  useEffect(() => {
    if (replyingToUsername && !comment.includes(`@${replyingToUsername}`)) {
        setParentCommentID(null);
        setReplyingToUsername(null);
    }
}, [comment, replyingToUsername]);

  

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    
    const requestBody = {
      userID: userID,  
      parentPostID: parentPostID,  
      parentCommentID: parentCommentID,
      commentContent: comment.replace(`@${replyingToUsername}`, '').trim()
      
    };
    if ( await checkForToxicity(requestBody.commentContent)){
      alert("Mind your language Please.");
    } else {
      fetch(process.env.REACT_APP_BACKEND_URL + '/community/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(responseData => {
        console.log('Comment created:', responseData);
        setComment('');
        fetchComments();
      })
      .catch(error => {
        console.error('Failed to create comment:', error);
      });
    }
};

  

const handleBookmarkClick = async () => {
  try {
    if (!isBookmarked) {
      const bookmarkResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${userID}/bookmark-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: post.postID
      });

      if (bookmarkResponse.ok) {
        const bookmarkData = await bookmarkResponse.json();
        console.log(bookmarkData.message);
        setIsBookmarked(true); 
        setBookmarkChange(true);
      } else {
        console.log('Failed to bookmark post.');
      }
    } else {
      const removeBookmarkResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${userID}/remove-bookmark-post/${post.postID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (removeBookmarkResponse.ok) {
        const removeBookmarkData = await removeBookmarkResponse.json();
        // console.log(removeBookmarkData.message);
        setIsBookmarked(false); 
      } else {
        console.log('Failed to remove bookmark.');
      }
    }
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};
  
  

  const handleBackIconClick = () => {
    navigate('/community');
  };

  const handleCommentIconClick = () => {
    const commentInput = document.getElementById('comment-input');
    if (commentInput) {
      commentInput.focus();
    }
  };
  const adjustAvatarSize = (avatar) => {
    if (avatar) {
      return avatar.replace('<svg ', '<svg style="height: 80%; width: 80%;"');
    }
  
    return null;
  }

  const renderComments = (commentList, parentUsername = null, depth = 0) => {
    return (
        <div>
        {commentList.map((comment) => {
            return (
                <div key={comment.commentID} className={depth === 1 ? styles.nestedCommentsContainer : styles.commentContainer}>
                <div className={styles.commentUser}>
                <div className={styles.avatarDiv} dangerouslySetInnerHTML={{ __html: adjustAvatarSize(comment.avatar) }}></div>
                    <div className={styles.commentUserID}><p>{comment.username}</p></div>
                    </div>
                    <div className={styles.commentBottom}>
                    <div className={styles.commentContent} onClick={() => handleReplyClick(comment.commentID, comment.username)}> 
                        {comment.parentCommentID && (
                        <div className={styles.replyComment}>               
                            <div className={styles.commentReplyUserID}>{comment.parentCommentID && `Reply to  @${parentUsername}`}</div>
                            <div className={styles.commentReplyContent}>{comment.commentContent}</div>
                        </div>
                        )}
                    
                        {comment.parentPostID !== null && <div className={styles.commentNoReplyContent}>{comment.commentContent}</div>}
                    </div>
                    <div className={styles.commentActions}> 
                        {comment.childrenComments.length > 0 && (
                        <button
                            className={styles.viewRepliesButton}
                            onClick={() => handleToggleReplies(comment.commentID)}
                        >
                            {visibleReplies[comment.commentID] ? '---Hide Replies' : '---View Replies'}
                        </button>
                        )}
                    </div>
                    
                </div>
                {visibleReplies[comment.commentID] && comment.childrenComments.length > 0 && (
                    <div>
                    {renderComments(comment.childrenComments, comment.username, depth + 1)}
                    </div>
                )}
                </div>
            )
        })}
        </div>
    );
};


  


  return (
    <div className={styles.container}>
      {post ? (
      <div className={styles.insideContainer}>
        <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} onClick={handleBackIconClick} />

        {post.placeID ? (
          <div className={styles.instagramPostBox}>
            <div className={styles.placeImage} 
            style={{
              backgroundImage: post.place && post.place.image ? `url(${post.place.image})` : 'none',
              backgroundColor: post.place && post.place.image ? 'transparent' : 'white'
            }}></div>
            <div className={styles.postContent}>
              <div className={styles.userInfo}>
              <div className={styles.avatarDiv} dangerouslySetInnerHTML={{ __html: adjustAvatarSize(post.avatar) }}></div>
              <div className={styles.userID}><h2>{post.username}</h2></div>
                <FontAwesomeIcon
                  icon={faBuilding}
                  onClick={handlePlaceInfo}
                  className={styles.buildingIcon}
                />
              </div>
              {placeInfoVisible && (
                <div className={styles.placeInfo}>
                  <h2>{post.place.name}</h2>
                    <p>Category: {post.place.category}</p>

                </div>
              )}

              <div className={styles.commentBox}>
              <div className={styles.topPostContent}>
                <div className={styles.topPostUser}>
                <div className={styles.avatarDiv} dangerouslySetInnerHTML={{ __html: adjustAvatarSize(post.avatar) }}></div>
                  <div className={styles.topPostRightTopUserID}><h2>{post.username}</h2></div>
                  </div>
                  <div className={styles.topPostBottom}>
                    <div className={styles.topPostRightTopTitle}><h3>{post.postTitle}</h3></div>
                   
                    <div className={styles.topPost}>
                      <p>{post.postContent}</p>
                    </div>
                  </div>
                </div>
                {renderComments(comments.filter((comment) => comment.parentCommentID === null))}
              </div>
              <div className={styles.likesContainer}>
              <button onClick={handleBookmarkClick}>
                <FontAwesomeIcon icon={faHeart} color={isBookmarked ? 'red' : 'white'} />
              </button>
                <button onClick={handleCommentIconClick}>
                  <FontAwesomeIcon icon={faComment} />
                </button>
              </div>
              <div className={styles.commentInput}>
                <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
                  <input
                    type="text"
                    id="comment-input"
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Enter your comment"
                  />
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.twitterPostBox}>
            <div className={styles.postTwitterContent}>
              <div className={styles.userInfo}>
              <div className={styles.avatarDiv} dangerouslySetInnerHTML={{ __html: adjustAvatarSize(post.avatar) }}></div>
              <div className={styles.userID}><h2>{post.username}</h2></div>
              </div>
        
              <div className={styles.commentBox}>
                <div className={styles.topPostContent}>
                <div className={styles.topPostUser}>
                <div className={styles.avatarDiv} dangerouslySetInnerHTML={{ __html: adjustAvatarSize(post.avatar) }}></div>
                  <div className={styles.topPostRightTopUserID}><h2>{post.username}</h2></div>
                  </div>
                  <div className={styles.topPostBottom}>
                    <div className={styles.topPostRightTopTitle}><h3>{post.postTitle}</h3></div>
                   
                    <div className={styles.topPost}>
                      <p>{post.postContent}</p>
                    </div>
                  </div>
                </div>
                {renderComments(comments.filter((comment) => !comment.replyToID))}
              </div>
              <div className={styles.likesContainer}>
                <button onClick={handleBookmarkClick}>
                  <FontAwesomeIcon icon={faHeart} color={isBookmarked ? 'red' : 'white'}/>
                </button>
                <button onClick={handleCommentIconClick}>
                  <FontAwesomeIcon icon={faComment} />
                </button>
              </div>
              <div className={styles.commentInput}>
                <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
                  <input
                    type="text"
                    id="comment-input"
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Enter your comment"
                  />
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>):(
        <div>
        <p>Post not found, redirecting...</p>
      </div>
      )}
    </div>
  );
};

export default PostDetail;
