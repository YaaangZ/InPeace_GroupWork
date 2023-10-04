import React from 'react';
import styles from './RecommendedList.module.css';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

const BusynessLevelMapping = {
    'Not Busy' : 'Not Busy',
    'Somewhat Busy': 'Somewhat Busy',
    'Moderately Busy': 'Moderately Busy',
    'Quite Busy': 'Quite Busy',
    'Very Busy': 'Very Busy'
};
const levelColorMapping = {
    'Not Busy': '#CD5C5C',  // Red
    'Somewhat Busy': '#E9967A',  // Orange
    'Moderately Busy': '#EEE8AA',  // Yellow
    'Quite Busy': '#98FB98',  // Green
    'Very Busy': '#ADD8E6'   // Light Green
};
function PlaceCard({place, category, onClick, expectedLevelOfBusyness}) {
    let iconComponent = null;

    if (place.category === 'restaurant') {
        iconComponent = <RestaurantIcon style={{fontSize: 30}}/>;
    } else if (place.category === 'cafe') {
        iconComponent = <LocalCafeIcon style={{fontSize: 30}}/>;
    } else if (place.category === 'park') {
        iconComponent = <LocalParkingIcon style={{fontSize: 30}}/>;
    }
    return (
       <div className={styles.placeCard} onClick={() => onClick(place)}>
            <div className={styles.placeCardInfo}>
                <h3 className={styles.placeName}>Name: {place.name}</h3>
                <p className={styles.placeStatus}>Status: {place.is_closed ? 'Closed' : 'Open'}</p>
                <p className={styles.placeAddress}>Address: {place.address}</p>
                <div className={styles.placeBusynessContainer} style={{backgroundColor: levelColorMapping[place.predictedBusyness]}}>
                    <p>{BusynessLevelMapping[place.predictedBusyness]}</p>
                </div>
            </div>
           <div className={styles.placeCardIcon}>
               {iconComponent}
           </div>

        </div>
    );
}

export function RecommendedList({placeList, category, onPlaceSelect, expectedLevelOfBusyness}) {
    return (
        <div className={styles.recommendedList}>
            <h2 className={styles.recTitle}>Explore Nearby</h2>
            {placeList.map((place) => {
                return (
                    <PlaceCard
                        key={place.place_id}
                        place={place}
                        category={category}
                        onClick={onPlaceSelect}
                        expectedLevelOfBusyness={expectedLevelOfBusyness}
                    />
                );
            })}
        </div>
    );
}
