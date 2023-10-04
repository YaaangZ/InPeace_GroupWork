const posts = [
    {
      postID: 'post1',
      userID: 'user1',
      username: 'User 1',
      title: 'Post 1',
      content: 'Content of Post 1',
      tags: ['tag1', 'tag2'],
      genre: 'Cafe',
      area: 'Area 1',
      commentIDs: ['comment1', 'comment2', 'comment9', 'comment10', "comment11", "comment12"],
      placeID: 'Place 1',
      place: 'Place 1'
    },
    {
      postID: 'post2',
      userID: 'user2',
      username: 'User 2',
      title: 'Post 2',
      content: 'Content of Post 2',
      tags: ['tag3', 'tag4'],
      genre: 'Restaurant',
      area: 'Area 2',
      commentIDs: ['comment3'],
      placeID: 'Place 2',
      place: 'Place 2'  
    },
    {
      postID: 'post3',
      userID: 'user3',
      username: 'User 3',
      title: 'Post 3',
      content: 'Content of Post 3',
      tags: ['tag5', 'tag6'],
      genre: 'Park',
      area: 'Area 3',
      commentIDs: ['comment4'],
      placeID: 'Place 3',
      place: 'Place 3'
    },
    {
      postID: 'post4',
      userID: 'user4',
      username: 'User 4',
      title: 'Post 4',
      content: 'Content of Post 4',
      tags: ['tag7', 'tag8'],
      genre: 'Cafe',
      area: 'Area 1',
      commentIDs: ['comment5'],
      placeID: 'Place 4',
      place: 'Place 4'
    },
    {
      postID: 'post5',
      userID: 'user5',
      username: 'User 5',
      title: 'Post 5',
      content: 'Content of Post 5',
      tags: ['tag9', 'tag10'],
      genre: 'Cafe',
      area: 'Area 2',
      commentIDs: ['comment6'],
      placeID: 'Place 3',
      place: 'Place 3'
    },
    {
      postID: 'post6',
      userID: 'user6',
      username: 'User 6',
      title: 'Post 6',
      content: 'Content of Post 6',
      tags: ['tag11', 'tag12'],
      genre: 'Park',
      area: 'Area 3',
      commentIDs: ['comment7'],
      placeID: 'Place 2',
      place: 'Place 2'
    },
    {
      postID: 'post7',
      userID: 'user7',
      username: 'User 7',
      title: 'Do you know any nice cafe?',
      content: 'Content of Post 7',
      tags: ['tag13', 'tag14'],
      genre: 'Restaurant',
      area: 'Area 1',
      commentIDs: ['comment8'],
      placeID: false,
      place: 'Place 1'
    },
  ];
  
  const comments = [
    {
      commentID: 'comment1',
      userID: 'user8',
      username: 'User 8',
      replyToID: '',
      content: 'Comment 1',
    },
    {
      commentID: 'comment2',
      userID: 'user9',
      username: 'User 9',
      replyToID: 'comment1',
      content: 'Reply to Comment 1',
    },
    {
      commentID: 'comment3',
      userID: 'user10',
      username: 'User 10',
      replyToID: '',
      content: 'Comment 2',
    },
    {
      commentID: 'comment4',
      userID: 'user11',
      username: 'User 11',
      replyToID: '',
      content: 'Comment 3',
    },
    {
      commentID: 'comment5',
      userID: 'user12',
      username: 'User 12',
      replyToID: '',
      content: 'Comment 4',
    },
    {
      commentID: 'comment6',
      userID: 'user13',
      username: 'User 13',
      replyToID: 'comment5',
      content: 'Reply to Comment 4',
    },
    {
      commentID: 'comment7',
      userID: 'user14',
      username: 'User 14',
      replyToID: '',
      content: 'Comment 5',
    },
    {
      commentID: 'comment8',
      userID: 'user15',
      username: 'User 15',
      replyToID: 'comment7',
      content: 'Reply to Comment 5',
    },
    {
        commentID: 'comment9',
        userID: 'user16',
        username: 'User 16',
        replyToID: 'comment2',
        content: 'Reply to Comment 2',
      },
      {
        commentID: 'comment10',
        userID: 'user17',
        username: 'User 17',
        replyToID: 'comment1',
        content: 'Reply to Comment 1',
      },
      {
        commentID: 'comment11',
        userID: 'user18',
        username: 'User 18',
        replyToID: '',
        content: 'Comment 11',
      },
      {
        commentID: 'comment12',
        userID: 'user19',
        username: 'User 19',
        replyToID: 'comment11',
        content: 'Reply to Comment 11',
      },
  ];
  
  
  
  const allPlaces = [
    { id: 1, name: 'Place 1', genre: 'Cafe', area: 'Area 1' },
    { id: 2, name: 'Place 2', genre: 'Restaurant', area: 'Area 2' },
    { id: 3, name: 'Place 3', genre: 'Park', area: 'Area 3' },
    { id: 4, name: 'Place 4', genre: 'Cafe', area: 'Area 1' },
    { id: 5, name: 'Place 5', genre: 'Cafe', area: 'Area 2' },
    { id: 6, name: 'Place 6', genre: 'Park', area: 'Area 3' },
    { id: 7, name: 'Place 7', genre: 'Cafe', area: 'Area 1' },
    { id: 8, name: 'Place 8', genre: 'Cafe', area: 'Area 2' }
  ];

  const allTags = 
    ["Wall Street", "Quiet", "Moderate Noise", "Noisy", "Parks", "Cafes", "Libraries",
     "Museums", "Scenic Views", "Wi-Fi", "Outdoor Seating", "Study Areas", "Power Outlets", 
     "Peaceful Gardens", "Morning", "Afternoon", "Evening", "Night", "Wheelchair Accessible", 
     "Public Transportation", "Bike-Friendly", "Work-Friendly", "Pet-Friendly", "Meditation", "Family-Friendly"]

  
  
  export { posts,comments, allPlaces, allTags };
  
