import React, {useState, useEffect} from 'react';
import moment from 'moment-timezone';
import {useNavigate} from 'react-router-dom';
import styles from './explore.module.css';
import axios from 'axios';

const Explore = () => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [category, setCategory] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [expectedLevelOfBusyness, setExpectedLevelOfBusyness] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [displayedDestination, setDisplayedDestination] = useState("");


    // destination auto-complete
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (destination.length > 2) {
                try {
                    const result = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${destination}&key=03589e3b2c464ae194bedf378705923c&bounds=-74.04305,40.67545,-73.90228,40.85745`);
                    setSuggestions(result.data.results.map(location => location.formatted));
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                }
            } else {
                setSuggestions([]); // Clear the suggestions if the destination is too short
            }
        };
    fetchSuggestions()

    }, [destination]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!destination || !category || !dateTime || !expectedLevelOfBusyness) {
            setLoading(false);  // Ensure loading state is set to false in case of error
            setError('⚠️ Please fill all fields before you submit. Or use the see all button to explore.');
            return;
        }

        await doSubmit();

    };

    const handleDefaultSubmit = (event) => {
        event.preventDefault();
        setDisplayedDestination('Manhattan');
        setDestination({
            latitude: 40.7831, // central Manhattan latitude
            longitude: -73.9712 // central Manhattan longitude
        });
        setCategory('All');
        setDateTime(getCurrentTimeInManhattan());
        setExpectedLevelOfBusyness(6);
    };


    function getCurrentTimeInManhattan() {
        return moment.tz("America/New_York").format('YYYY-MM-DDTHH:mm');
    }

    function mapBusynessValueToString(value) {
        const busynessMapping = {
            1: "Not Busy",
            2: "Somewhat Busy",
            3: "Moderately Busy",
            4: "Quiet Busy",
            5: "Very Busy",
            6: "All Busyness Levels"
        };

        return busynessMapping[value] || "Unknown";
    }

    async function doSubmit() {
        setLoading(true)
        let longitude, latitude;

        // Check if destination is a lat/long object
        if (typeof destination === 'object' && destination.latitude && destination.longitude) {
            latitude = destination.latitude;
            longitude = destination.longitude;
        } else {
            // Get coordinates from destination using OpenCage API
              const result = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${destination}&key=03589e3b2c464ae194bedf378705923c`);
            const coordinates = result.data.results[0].geometry;
            longitude = coordinates.lng;
            latitude = coordinates.lat;
        }

        try {
            let places;
            if (category === 'Café') {
                places = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/places/search?latitude=${latitude}&longitude=${longitude}&category=Cafe&radius=500`);
            } else {
                const encodedCategory = encodeURIComponent(category);
                places = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/places/search?latitude=${latitude}&longitude=${longitude}&category=${encodedCategory}&radius=500`);
            }

            const hour = new Date(dateTime).getHours();
            const placeIDs = places.data.map(place => place.place_id);

            const busynessData = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/busyness/forecast/places/${hour}`, placeIDs);

            const desiredBusynessString = mapBusynessValueToString(expectedLevelOfBusyness);

            places.data = places.data.map(place => {
                const placeBusynessInfo = busynessData.data.find(busyness => busyness.placeID === place.place_id);

                // Attach the busyness info to the place object
                if (placeBusynessInfo) {
                    place.predictedBusyness = placeBusynessInfo.predictedBusyness;
                }
                return place;

            }).filter(place => {
                // Filter by busyness if needed
                return expectedLevelOfBusyness === 6 || place.predictedBusyness === desiredBusynessString;
            });
            setLoading(false);  // Set the loading state to false after the request finishes
            navigate('/map', {state: {destination, category, dateTime, expectedLevelOfBusyness, places: places.data}});

        } catch (error) {
            setLoading(false);  // Ensure loading state is set to false in case of error
            setError('⚠️ Sorry, there was an error fetching the data. Please try later.');
            console.log(error)
        }

    }


    return (
    <div className={styles.wholeExploreContainer}>
          <div className={styles.exploreContainer}>
                <div className={styles.mapForm}>
                    <h1 className={styles.exploreH1Text}>What are you looking for?</h1>
                    <form onSubmit={handleSubmit}>
                        <label className={styles.exploreText}>
                            Destination:
                            <input
                                list="suggestions"
                                type="text"
                                value={displayedDestination}
                                onChange={(e) => {
                                    setDestination(e.target.value);  // assuming destination can also be a string for OpenCage lookup
                                    setDisplayedDestination(e.target.value);
                                }}
                                className={styles.mapFormInput}
                                placeholder="Enter your destination"
                                disabled={loading}
                            />
                            <datalist id="suggestions">
                                {suggestions.map((suggestion, index) => (
                                    <option key={index} value={suggestion}/>
                                ))}
                            </datalist>
                        </label>
                        <br></br>
                        <label className={styles.exploreText}>
                            Category:
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={styles.mapFormInputSelect}
                                disabled={loading}
                            >
                                <option value="">Select a category</option>
                                <option value="Restaurant">Restaurant</option>
                                <option value="Café">Café</option>
                                <option value="Park">Park</option>
                                <option value="All">All</option>
                            </select>
                        </label>
                        <br></br>
                        <label className={styles.exploreText}>
                            Expected level of busyness:
                            <select
                                value={expectedLevelOfBusyness}
                                onChange={(e) => setExpectedLevelOfBusyness(Number(e.target.value))}
                                className={styles.mapFormInputSelect}
                                disabled={loading}
                            >
                                <option value={1}>Not Busy</option>
                                <option value={2}>Somewhat Busy</option>
                                <option value={3}>Moderately Busy</option>
                                <option value={4}>Quite Busy</option>
                                <option value={5}>Very Busy</option>
                                <option value={6}>All Busyness Levels</option>
                            </select>
                        </label>
                        <label className={styles.exploreText}>
                            Date/Time:
                            <input
                                type="datetime-local"
                                value={dateTime}
                                onChange={(e) => setDateTime(e.target.value)}
                                className={styles.mapFormInput}
                                disabled={loading}
                            />
                        </label>
                        <br></br>
                        <br></br>
                        <div className={styles.buttonContainer}>
                            <div id={styles.spinnerContainer}>
                                {loading && <div className={styles.ldsRoller} aria-label="Loading content" role="alert">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>}
                            </div>
                            <div>
                                <button type="button" className={styles.mapSubmitBtn} onClick={handleDefaultSubmit} disabled={loading}>
                                    DEFAULT
                                </button>
                            </div>
                            <div>
                                <button type="submit" className={styles.mapSubmitBtn} disabled={loading}>
                                    GO
                                </button>
                            </div>
                        </div>
                        {error && <div className={styles.error}>{error}</div>}
                    </form>
                </div>
            </div>
    </div>
    );
}
export default Explore;
