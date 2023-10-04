import React, { useEffect, useRef, useState } from 'react';
import styles from './AboutUs.module.css';
import _ from 'lodash';

const AboutUs = () => {
  const [activePage, setActivePage] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = _.debounce(() => {
      const container = containerRef.current;
      if (container) {
        const scrollPosition = container.scrollLeft;
        const pageWidth = container.offsetWidth;
        const pageIndex = Math.floor(scrollPosition / pageWidth);
        setActivePage(pageIndex);
      }
    }, 200); // Debouncing the function to get executed 200ms after the last scroll event.

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
      <div className={styles.aboutus}>
      <div className={styles.top}>
          <div className={styles.topleft}>
              <h1>About<br></br>
                  <span className={styles.span}>Us</span>
              </h1>
          </div>
          <div className={styles.topright}>
              <h1>Hi, We are InPeace.</h1>
              <h2>Introducing our web app for introverts in NYC! Discover peaceful routes, serene spots, and a supportive community.
                  Navigate the city with ease, find tranquility, and connect with like-minded individuals.
                  {/* Join us to experience NYC in a whole new way. */}
              </h2>
          </div>
      </div>
      <div className={styles.bottom} ref={containerRef}>
          <div className={styles.page}>
              <div className={styles.first}>
                  <div className={styles.firstpic}>
                      <img src="images/CAFEv1.jpeg" />
                  </div>
                  <div className={styles.firsttext}>
                      <p>Our Service</p>
                      <h1>Find a less busier place</h1>
                      <p>We will give you a less busier place to your destination.
                          So you do not have to worry about being intimidated by too many people around.
                      </p>
                  </div>
              </div>
              <div className={styles.dots}>
                  <div className={`${styles.dot} ${activePage === 0 ? styles.active : ''}`}></div>
                  <div className={`${styles.dot} ${activePage === 1 ? styles.active : ''}`}></div>
              </div>
          </div>
          <div className={styles.page}>
              <div className={styles.second}>
                  <div className={styles.secondpic}><img src="images/COMMUNITYv1.jpeg" /></div>
                  <div className={styles.secondtext}>
                      <p>Our Service</p>
                      <h1>InPeace community</h1>
                      <p>We will give you a small community where you can communicate with others.
                          So you will have an opportunity to talk with someone who has a similar personality.
                      </p>
                  </div>
              </div>
              <div className={styles.dots}>
                  <div className={`${styles.dot} ${activePage === 0 ? styles.active : ''}`}></div>
                  <div className={`${styles.dot} ${activePage === 1 ? styles.active : ''}`}></div>
              </div>
          </div>
      </div>
  </div>

  );
};

export default AboutUs;
