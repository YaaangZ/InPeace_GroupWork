import React from "react";
import { useNavigate } from "react-router-dom";
import AboutUs from "./aboutus/AboutUs";
import styles from "./MainPage.module.css";
// import Footer from "./header/MainPageFooter";


const MainPage = () => {
  // const aboutUsRef = useRef(null);
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/explore");
  };

  // const handleCommunityClick = () => {
  //   navigate("/community");
  // };s

  return (
    <div>
      <section className={styles.introduction}>
        <div className={styles.left}>
          <h1>
            Welcome to InPeace.
            <br/>
            You will find a relaxed place in one of the busiest cities, New York.
          </h1>
          <button onClick={handleExploreClick}>Explore</button>
        </div>
        <div className={styles.right}></div>
      </section>
      <div className={styles.aboutus}>
        <AboutUs />
      </div>
      {/* <Footer /> */}
   </div>
  );
};
export default MainPage;