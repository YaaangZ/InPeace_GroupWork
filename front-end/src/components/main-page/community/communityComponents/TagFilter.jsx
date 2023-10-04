import React, { useState, useEffect } from 'react';
import styles from './TagFilter.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faBuilding, faCircle, faTag } from '@fortawesome/free-solid-svg-icons';

const TagFilter = ({
  selectedGenre,
  selectedZone,
  selectedPlace,
  selectedTags,
  onGenreChange,
  onZoneChange,
  onPlaceChange,
  onTagChange,
  genres,
  places,
  tags,
  zones,
  placeShowValue,
  setPlaceShowValue
}) => {
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(false);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const options = ["withPlace", "default", "withoutPlace"];

  const handleGenreChange = (event) => {
    const selectedGenre = event.target.value;
    onGenreChange(selectedGenre);
  };

  const handleZoneChange = (event) => {
    const selectedZone = event.target.value;
    onZoneChange(selectedZone);
  };

  const handleSwitchChange = (event) => {
    const selectedSwitchValue = event.target.value;
    setPlaceShowValue(options[selectedSwitchValue])
    onGenreChange("All");
    onZoneChange("All");
    onPlaceChange("All");
  };
  
  
  

  const handlePlaceChange = (event) => {
    const selectedPlace = event.target.value;
    onPlaceChange(selectedPlace);
  };

  const handleTagChange = (event, tag) => {
    const selectedTag = event.target.getAttribute('value');
    onTagChange(selectedTag);
  };

  const toggleAllTags = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every((checkbox) => checkbox.checked);

    checkboxes.forEach((checkbox) => {
      if (allChecked) {
        checkbox.checked = false;
        checkbox.click();
      } else if (!checkbox.checked) {
        checkbox.click();
      }
    });
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarVisible(!leftSidebarVisible);
  };

  const toggleRightSidebar = () => {
    setRightSidebarVisible(!rightSidebarVisible);
  };


  useEffect(() => {
    if (places.length > 0) {
      let newFilteredPlaces = [...places]; 
    
      if (selectedGenre !== 'All') {
        newFilteredPlaces = newFilteredPlaces.filter(place => place.category === selectedGenre);
      }
    
      if (selectedZone !== 'All') {
        newFilteredPlaces = newFilteredPlaces.filter(place => place.zone_id === selectedZone);
      }
    
      setFilteredPlaces(newFilteredPlaces);
    }
  }, [selectedGenre, selectedZone, places]);
  
  
  return (
    <div className={styles.tagFilter}>
      <div className={`${styles.tagLeftSidebar} ${leftSidebarVisible ? styles.visible : ''}`}>
        <div className={styles.tagTop}>
        <h3>Tags:</h3>
        <div className={styles.tagButtons}>
          <button onClick={toggleAllTags}>Select All</button>
        </div>
        </div>
        <ul className={styles.tagList}>
          {tags.map((tag) => (
            <li
              key={tag}
              className={`${styles.tagListItem} ${selectedTags.includes(tag) ? styles.tagListItemSelected : ''}`}
            >
              <label>
                <input
                  type="checkbox"
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={(event) => handleTagChange(event, tag)}
                />
                <FontAwesomeIcon icon={faCircle} className={styles.tagListIcon} />
                {tag}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className={`${styles.leftSidebarToggle} ${leftSidebarVisible ? styles.visible : ''}`} onClick={toggleLeftSidebar}>
        <FontAwesomeIcon
          icon={faTag}
          className={`${styles.leftSidebarToggleIcon} ${leftSidebarVisible ? styles.visible : ''}`}
        />
      </div>

      <div className={`${styles.tagRightSidebar} ${rightSidebarVisible ? styles.visible : ''}`}>
      <div className={styles.placeOptions}>
        <div className={styles.place}><p>Place</p></div>
        <input 
          type="range"
          min="0"
          max="2"
          value={options.indexOf(placeShowValue)}
          onChange={handleSwitchChange}
          className={styles.threeWaySlider}
        />
        <div className={styles.general}><p>General</p></div>
      </div>

        {placeShowValue === "withPlace" &&  <div className={styles.placeShown}>
        <div className={styles.placesText}><h3>Places:</h3></div>
        <div className={styles.genreFilter}>
          <label htmlFor="category">Category:</label>
          <select id="category" value={selectedGenre} onChange={handleGenreChange}>
            <option value="All">All</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.areaFilter}>
          <label htmlFor="zone">Area:</label>
          <select id="zone" value={selectedZone} onChange={handleZoneChange}>
            <option value="All">All</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.placeFilter}>
          <label htmlFor="place">Place:</label>
          <select id="place" value={selectedPlace} onChange={handlePlaceChange}>
            <option value="All">All</option>
            {filteredPlaces.map((place) => (
              <option key={place} value={place}>
                {place.name}
              </option>
            ))}
          </select>
        </div>
        </div>}

      </div>

      <div className={`${styles.rightSidebarToggle} ${rightSidebarVisible ? styles.visible : ''}`} onClick={toggleRightSidebar}>
        <FontAwesomeIcon
          icon={faBuilding}
          className={`${styles.sidebarToggleIcon} ${rightSidebarVisible ? styles.active : ''}`}
        />
      </div>
    </div>
  );
};

export default TagFilter;
