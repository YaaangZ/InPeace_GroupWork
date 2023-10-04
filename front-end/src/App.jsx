import React, {useState} from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';
import MainPage from './components/main-page/MainPage';
import LoginPage from './components/main-page/account/LoginPage';
import SignUp from './components/main-page/account/SignUp';
import ResetPasswords from './components/main-page/account/ResetPasswords'; 
import ForgotPassword from './components/main-page/account/ForgotPassword';
import MyPage from './components/main-page/mypage/MyPage';
import Explore from "./components/explore-page/Explore";
import MapComponent from "./components/explore-page/MapComponent";
import CommunityBoard from './components/main-page/community/CommunityBoard';
import Post from './components/main-page/community/communityComponents/Post';
import PostDetail from './components/main-page/community/communityComponents/PostDetail';
import {AuthProvider} from './AuthContext';
import PredictBusyness from './components/explore-page/PredictBusyness';
import Header from './components/main-page/header/MainPageHeader';
import Footer from './components/main-page/header/MainPageFooter';
import { ToastContainer } from "react-toastify";
import UpdatePostFlag from './components/main-page/community/UpdatePostFlag';
import BookmarkContext from './components/main-page/community/BookmarkContext';
import AllPostsFetchedContext from './components/main-page/community/AllPostsFetchedContext';
import RefreshFlagContext from './components/main-page/community/RefreshFlagContext';

const App = () => {
    const location = useLocation();
    const excludeHeaderRoutes = ['/map', '/map/predict', "/community", "/community/post", "/community/"];

    const shouldRenderHeader = !excludeHeaderRoutes.some(path => location.pathname.startsWith(path));
    const [updateFlag, setUpdateFlag] = useState(true);
    const [bookmarkChange, setBookmarkChange] = useState(false);
    const [allPostsFetched, setAllPostsFetched] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(true);

    console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);


    return (
        <AuthProvider>
            <ToastContainer />
            {shouldRenderHeader && <Header/>}
            <BookmarkContext.Provider value={{ bookmarkChange, setBookmarkChange }}>
            <UpdatePostFlag.Provider value={{ updateFlag, setUpdateFlag }}>
            <AllPostsFetchedContext.Provider value={{ allPostsFetched, setAllPostsFetched }}>
            <RefreshFlagContext.Provider value={{ refreshFlag, setRefreshFlag }}>
              <Routes>
                  <Route path="/" element={<MainPage/>}/>
                  <Route path="/login" element={<LoginPage/>}/>
                  <Route path="/auth/reset-password" element={<ResetPasswords/>} />
                  <Route path="/signup" element={<SignUp/>}/>
                  <Route path="/password" element={<ForgotPassword/>}/>
                  <Route path="/mypage" element={<MyPage/>}/>
                  <Route path="/explore" element={<Explore/>}/>
                  <Route path="/map" element={<MapComponent/>}/>
                  <Route path="/map" element={<MapComponent/>}>
                      <Route path="predict" element={<PredictBusyness/>}/>
                  </Route>
                  <Route path="/community" element={<CommunityBoard/>}/>
                  <Route path="/community/post" element={<Post/>}/>
                  <Route path="/community/:postId" element={<PostDetail/>}/>
                 

              </Routes>
              </RefreshFlagContext.Provider>
              </AllPostsFetchedContext.Provider>
              </UpdatePostFlag.Provider>
            </BookmarkContext.Provider>
            {shouldRenderHeader && <Footer/>}
        </AuthProvider>

    );
};

export default App;

// import React from 'react';
// import {Routes, Route, useLocation} from 'react-router-dom';
// import MainPage from './components/main-page/MainPage';
// import LoginPage from './components/main-page/account/LoginPage';
// import SignUp from './components/main-page/account/SignUp';
// import ForgotPassword from './components/main-page/account/ForgotPassword';
// import MyPage from './components/main-page/mypage/MyPage';
// import Explore from "./components/explore-page/Explore";
// import MapComponent from "./components/explore-page/MapComponent";
// import CommunityBoard from './components/main-page/community/CommunityBoard';
// import Post from './components/main-page/community/communityComponents/Post';
// import PostDetail from './components/main-page/community/communityComponents/PostDetail';
// import {AuthProvider} from './AuthContext'; // Import AuthContext
// import PredictBusyness from './components/explore-page/PredictBusyness';
// import Header from './components/main-page/header/MainPageHeader';
// import Footer from './components/main-page/header/MainPageFooter';
// import { ToastContainer } from "react-toastify";
//
// const App = () => {
//     const location = useLocation();
//     const excludeHeaderRoutes = ['/map', '/map/predict'];
//
//     const shouldRenderHeader = !excludeHeaderRoutes.includes(location.pathname);
//
//     return (
//         <AuthProvider>
//             <ToastContainer />
//             {shouldRenderHeader && <Header/>}
//             <Routes>
//                 <Route path="/" element={<MainPage/>}/>
//                 <Route path="/login" element={<LoginPage/>}/>
//                 <Route path="/signup" element={<SignUp/>}/>
//                 <Route path="/password" element={<ForgotPassword/>}/>
//                 <Route path="/mypage" element={<MyPage/>}/>
//                 <Route path="/explore" element={<Explore/>}/>
//                 <Route path="/map" element={<MapComponent/>}/>
//                 <Route path="/map" element={<MapComponent/>}>
//                     <Route path="predict" element={<PredictBusyness/>}/>
//                 </Route>
//                 <Route path="/community" element={<CommunityBoard/>}/>
//                 <Route path="/community/post" element={<Post/>}/>
//                 <Route path="/community/:postId" element={<PostDetail/>}/>
//             </Routes>
//             <Footer/>
//         </AuthProvider>
//     );
// };
//
// export default App;


// import React, { useState } from 'react';
// import {Routes, Route, useLocation} from 'react-router-dom';
// import MainPage from './components/main-page/MainPage';
// import LoginPage from './components/main-page/account/LoginPage';
// import SignUp from './components/main-page/account/SignUp';
// import ForgotPassword from './components/main-page/account/ForgotPassword';
// import MyPage from './components/main-page/mypage/MyPage';
// import Explore from "./components/explore-page/Explore";
// import MapComponent from "./components/explore-page/MapComponent";
// import CommunityBoard from './components/main-page/community/CommunityBoard';
// import Post from './components/main-page/community/communityComponents/Post';
// import PostDetail from './components/main-page/community/communityComponents/PostDetail';
// import {AuthProvider} from './AuthContext'; // Import AuthContext
// import PredictBusyness from './components/explore-page/PredictBusyness';
// import Header from './components/main-page/header/MainPageHeader';
// import Footer from './components/main-page/header/MainPageFooter';
// import { ToastContainer } from "react-toastify";
// import UpdatePostFlag from './components/main-page/community/UpdatePostFlag';
//
// const App = () => {
//     const location = useLocation();
//     const excludeHeaderRoutes = ['/map', '/map/predict', "/community", "/community/post", "/community/:postId"];
//
//     const shouldRenderHeader = !excludeHeaderRoutes.includes(location.pathname);
//     const [updateFlag, setUpdateFlag] = useState(true);
//     return (
//         <UpdatePostFlag.Provider value={{ updateFlag, setUpdateFlag }}>
//         <AuthProvider>
//             <ToastContainer />
//             {shouldRenderHeader && <Header/>}
//             <Routes>
//                 <Route path="/" element={<MainPage/>}/>
//                 <Route path="/login" element={<LoginPage/>}/>
//                 <Route path="/signup" element={<SignUp/>}/>
//                 <Route path="/password" element={<ForgotPassword/>}/>
//                 <Route path="/mypage" element={<MyPage/>}/>
//                 <Route path="/explore" element={<Explore/>}/>
//                 <Route path="/map" element={<MapComponent/>}/>
//                 <Route path="/map" element={<MapComponent/>}>
//                     <Route path="predict" element={<PredictBusyness/>}/>
//                 </Route>
//                 <Route path="/community" element={<CommunityBoard/>}/>
//                 <Route path="/community/post" element={<Post/>}/>
//                 <Route path="/community/:postId" element={<PostDetail/>}/>
//             </Routes>
//             <Footer/>
//         </AuthProvider>
//         </UpdatePostFlag.Provider>
//     );
// };
//
// export default App;

