import React, {useEffect, useRef, useState, useContext} from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './MapComponent.module.css';
import 'wicket/wicket-leaflet';
import markerIcon from './markers.png';
import {StreetDataFetcher} from './StreetDataFetcher';
import {useLocation} from 'react-router-dom';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import {RecommendedList} from './RecommendedList';
import axios from 'axios';
import PredictBusyness from './PredictBusyness';
import './PredictBusyness.module.css';
import 'leaflet-bounce-marker';
import {AuthContext} from "../../AuthContext";

const MapComponent = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const location = useLocation();
    const [destination] = useState(location.state?.destination || '');
    const [category] = useState(location.state?.category || '');
    const [dateTime] = useState(location.state?.dateTime || '');
    const [expectedLevelOfBusyness] = useState(location.state?.expectedLevelOfBusyness || 1);
    const [streetData, setStreetData] = useState([]);
    const [data, setData] = useState(null);
    const [isFromExplore, setIsFromExplore] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [streetsLayerGroup, setStreetsLayerGroup] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const selectedZoneRef = useRef(null);
    const geojsonRef = useRef(null);
    const [recommendedPlaces] = useState(location.state?.places || []);
    const [places, setPlaces] = useState([]);
    const clusterRef = useRef(L.markerClusterGroup());
    const [selectedHour, setSelectedHour] = useState(0);
    const [isShowAllPlaces, setIsShowAllPlaces] = useState(false);
    const [isShowPredictPane, setIsShowPredictPane] = useState(false);
    const authContext = useContext(AuthContext);
    const {isAuthenticated} = authContext;
    // console.log("selectedHour", selectedHour);

    useEffect(() => {
        if (location.state) {
            setIsFromExplore(true);
            handleSubmit();
        }
    }, [destination, category, dateTime, expectedLevelOfBusyness]);

    React.useEffect(() => {
        // console.log("recommendedPlaces", recommendedPlaces);
        if (recommendedPlaces.length > 0 && isFromExplore) {
            setData(recommendedPlaces);
        }
    }, [recommendedPlaces, isFromExplore]);

    // when data (recommendedPlaces) change, draw makers on map
    React.useEffect(() => {
        if (!data) {
            return;
        }
        const markers = [];
        data.forEach(place => {
            let icon;
            if (place.image) {
                icon = L.icon({
                    iconUrl: place.image,
                    iconSize: [40, 40],
                    popupAnchor: [0, -20],
                    iconAnchor: [22, 94]
                });
            } else {
                icon = L.icon({
                    iconUrl: markerIcon,
                    iconSize: [40, 40],
                    popupAnchor: [0, -20],
                    iconAnchor: [22, 94]
                });
            }


            // create new marker
            const newMarker = L.marker([place.coordinates.latitude, place.coordinates.longitude], {
                icon: icon
            }).bindPopup(`<b>Name: ${place.name}</b><br>Address: ${place.address}`);
            markers.push(newMarker);
            clusterRef.current.addLayer(newMarker);

        });
        return () => {
            // remove previous markers
            markers.forEach(marker => {
                clusterRef.current.removeLayer(marker);
            });
        };
    }, [data]);

    const handleSubmit = () => {
        if (recommendedPlaces.length === 0) {
            console.error("No recommended places found. Please try later.");
        } else {
            setData(recommendedPlaces);
            setIsFromExplore(true);
        }
    };

    const handleStreetDataFetch = (data) => {
        setStreetData(data);
    };

    // useEffect to fetch places
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/places`);
                setPlaces(response.data);
            } catch (error) {
                console.error("Error fetching places:", error);
            }
        };

        fetchPlaces();
    }, []);  // Only run when component mounts

    useEffect(() => {
        let markers = [];

        const updateMapWithPlaces = () => {
            if (isShowAllPlaces && places.length > 0 && mapInstanceRef.current) {
                places.forEach(place => {
                    if (place.coordinates && place.coordinates.latitude && place.coordinates.longitude) {
                        const customIcon = L.icon({
                            iconUrl: markerIcon,
                            iconSize: [20, 26],
                            iconAnchor: [22, 94],
                            popupAnchor: [-3, -76]
                        });

                        const marker = L.marker([place.coordinates.latitude, place.coordinates.longitude], {icon: customIcon})
                            .bindPopup(`<b>Place name: ${place.name}</b><br>Address: ${place.address}<br>Category:${place.category.charAt(0).toUpperCase() + place.category.slice(1)}`);
                        markers.push(marker);
                        clusterRef.current.addLayer(marker);
                    }
                });
            }
        };

        // Hide markers when isShowAllPlaces is false
        const hideMarkers = () => {
            markers.forEach((marker) => {
                clusterRef.current.removeLayer(marker);
            });
        };

        if (isShowAllPlaces) {
            updateMapWithPlaces();
        } else {
            hideMarkers();
        }

        return () => {
            hideMarkers();
        };
    }, [places, isShowAllPlaces]);  // Run when places or isShowAllPlaces changes



    // get zones, render zones, render zones' heatmap, render predict zones' busyness
    useEffect(() => {
        if (mapRef.current && !mapInstanceRef.current) {
            const map = L.map(mapRef.current).setView([40.7831, -73.9712], 13);
            mapInstanceRef.current = map;
            L.tileLayer('https://api.mapbox.com/styles/v1/tlopes123x/cll5dxz0q00ke01pm87932lbb/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGxvcGVzMTIzeCIsImEiOiJjbGw1ZHRpbzkwZHN5M2Rsb2lubTJ6M2drIn0.usintqKL8sJo-oj1ZFrfEA', {
                maxZoom: 19,
                tileSize: 512,
                zoomOffset: -1,
                id: 'mapbox/streets-v11',
                attribution: 'Map data &copy; OpenStreetMap contributors, &copy; Mapbox',
            }).addTo(map);
            // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //     attribution: 'Map data &copy; OpenStreetMap contributors',
            // }).addTo(map);
            map.addLayer(clusterRef.current);
        }
        const fetchData = async () => {
            try {
                const url_geom = process.env.REACT_APP_BACKEND_URL + '/map/zones';
                const url_busyness = `${process.env.REACT_APP_BACKEND_URL}/busyness/forecast/zones/${selectedHour}`;
                const [response1, response2] = await Promise.all([axios.get(url_geom), axios.get(url_busyness)]);
                if (response1.status !== 200 || response2.status !== 200) {
                    throw new Error("Error when getting geom and busyness data for zones");
                }
                const data_geom = response1.data;
                const data_busyness = response2.data;

                const integrateData = (data_geom, data_busyness) => {
                    const busynessMap = data_busyness.reduce((acc, cur) => {
                        acc[cur.zoneID] = cur.predictedBusyness;
                        return acc;
                    }, {});
                    data_geom.forEach(item => {
                        if (busynessMap.hasOwnProperty(item.properties.zoneID)) {
                            item.properties.predictedBusyness = busynessMap[item.properties.zoneID];
                        } else {
                            item.properties.predictedBusyness = item.properties.zoneID;
                        }
                    });
                    return data_geom;
                };

                const data = integrateData(data_geom, data_busyness);

                function getColor(d) {
                    if ((typeof d) === 'number') {
                        return "#2b2b2b";
                    } else if ((typeof d) === 'string') {
                        return d === "Very Busy" ? '#CD5C5C' :
                            d === "Quiet Busy" ? '#E9967A' :
                                d === "Moderately Busy" ? '#EEE8AA' :
                                    d === "Somewhat Busy" ? '#98FB98' :
                                        '#ADD8E6';
                    }
                }

                function style(feature) {
                    return {
                        fillColor: getColor(feature.properties.predictedBusyness),
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    };
                }

                var geojson;

                function highlightFeature(e) {
                    var layer = e.target;
                    if (!selectedZoneRef.current || e.target.feature.properties.zoneID !== selectedZoneRef.current.feature.properties.zoneID) {
                        layer.setStyle({
                            weight: 5,
                            color: '#666',
                            dashArray: '',
                            fillOpacity: 0.7
                        });
                    }
                }

                function resetHighlight(e) {
                    if (!selectedZoneRef.current || e.target.feature.properties.zoneID !== selectedZoneRef.current.feature.properties.zoneID) {
                        geojson.resetStyle(e.target);
                    }
                }

                function zoomToFeature(e) {
                    mapInstanceRef.current.fitBounds(e.target.getBounds());
                    fetchStreetDataForZone(e.target.feature);
                    setSelectedZone(e.target);
                }

                function onEachFeature(feature, layer) {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: zoomToFeature
                    });
                }

                if (geojsonRef.current) {
                    mapInstanceRef.current.removeLayer(geojsonRef.current);
                }

                geojson = L.geoJSON(data, {
                    style: style,
                    onEachFeature: onEachFeature,
                }).addTo(mapInstanceRef.current);

                geojsonRef.current = geojson;

            } catch (error) {
                console.error('Error fetching and processing dataset:', error);
            }
        };
        fetchData();
    }, [selectedHour]);


    // what happen when selected zone change
    useEffect(() => {
        // change the previous selected zone to get the color it should have
        if (selectedZoneRef.current) {
            geojsonRef.current.resetStyle(selectedZoneRef.current);
        }
        // remove current selected zone's color and update selectedZoneRef
        if (selectedZone) {
            selectedZoneRef.current = selectedZone;
            selectedZone.setStyle({
                color: '#32435f',
                fillOpacity: 0
            });
        }


    }, [selectedZone]);

    useEffect(() => {
        function getColor(d) {
            if ((typeof d) === 'number') {
                return "#EEE8AA";
            } else if ((typeof d) === 'string') {
                // when d is the real busyness, use this
                return d === "Very Busy" ? '#CD5C5C' :
                    d === "Quiet Busy" ? '#E9967A' :
                        d === "Moderately Busy" ? '#EEE8AA' :
                            d === "Somewhat Busy" ? '#98FB98' :
                                '#ADD8E6';
            }
        }

        function getStyle(feature) {
            return {
                color: getColor(feature.properties.predictedBusyness),
                weight: 3.5,
            };
        }

        const drawStreetData = () => {
            // console.log("streetData", streetData);
            if (!streetData) {
                // If streetData is not defined, exit the useEffect hook
                return;
            }
            if (streetData.length > 0 && mapInstanceRef.current) {
                // Remove old streets layer from the map
                if (streetsLayerGroup) {
                    mapInstanceRef.current.removeLayer(streetsLayerGroup);
                }

                const newStreetsLayerGroup = L.layerGroup(); // Create a layer group to hold all street layers

                streetData.forEach(streetFeature => {
                    if (streetFeature.geometry && streetFeature.geometry.type === 'MultiLineString') {
                        streetFeature.geometry.coordinates.forEach(lineCoordinates => {
                            // Create a new GeoJSON feature for each line segment
                            const lineFeature = {
                                type: 'Feature',
                                geometry: {
                                    type: 'LineString',
                                    coordinates: lineCoordinates,
                                },
                                properties: streetFeature.properties,
                            };

                            const layer = L.geoJSON(lineFeature, {
                                style: getStyle(streetFeature)
                            });

                            newStreetsLayerGroup.addLayer(layer); // Add the layer to the layer group
                        });
                    }
                });

                // Add the layer group with all street layers to the map
                mapInstanceRef.current.addLayer(newStreetsLayerGroup);
                // Save the new streets layer group
                setStreetsLayerGroup(newStreetsLayerGroup);
            }
        };

        drawStreetData();
    }, [streetData]);

    const fetchStreetDataForZone = async (zone) => {
        console.log('Fetching street data for zone:', zone.properties.zoneID);
        try {
            // This is the geometry data
            const url1 = `${process.env.REACT_APP_BACKEND_URL}/map/streets/${zone.properties.zoneID}`;
            // This is the business data
            // const url2 = `./test_street.json`;
            const url2 = `${process.env.REACT_APP_BACKEND_URL}/busyness/current/streets/${zone.properties.zoneID}`;
            const [response1, response2] = await Promise.all([axios.get(url1), axios.get(url2)]);
            if (response1.status !== 200 || response2.status !== 200) {
                throw new Error("Error when getting geom and busyness data for streets");
            }
            const data_geom = response1.data; // it's a array
            // console.log("data_geom", data_geom);
            const data_busyness = response2.data;
            console.log("data_busyness", data_busyness);
            // Combine data together
            // create a mapping
            const integrateData = (data_geom, data_busyness) => {
                const busynessMap = data_busyness.reduce((acc, cur) => {
                    acc[cur.streetID] = cur.predictedBusyness;
                    return acc;
                }, {});
                data_geom.forEach(item => {
                    if (busynessMap.hasOwnProperty(item.properties.streetID)) {
                        item.properties.predictedBusyness = busynessMap[item.properties.streetID];
                    } else {
                        item.properties.predictedBusyness = item.properties.streetID;// remove it when we get full data, this is just for test
                    }
                });
                return data_geom;
            };
            const data = integrateData(data_geom, data_busyness);

            setStreetData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const BouncingIcon = L.DivIcon.extend({
        createIcon: function () {
            var div = document.createElement('div');
            var img = this._createImg(this.options['iconUrl']);
            img.style.width = this.options.iconSize[0] + 'px';
            img.style.height = this.options.iconSize[1] + 'px';
            img.setAttribute('class', 'bouncing');
            // div.setAttribute('class', 'bouncing');
            div.style.backgroundColor = 'transparent';
            div.style.border = 'none';
            div.appendChild(img);
            this._setIconStyles(div, 'icon');
            return div;
        },
    });

    useEffect(() => {
        if (selectedPlace && mapInstanceRef.current) {
            mapInstanceRef.current.setView([selectedPlace.coordinates.latitude, selectedPlace.coordinates.longitude], 14);

            // deleted old marker
            if (selectedMarker) {
                selectedMarker.remove();
            }

            const icon = L.icon({
                iconUrl: 'images/selected-marker.png',
                iconSize: [40, 40],
                popupAnchor: [0, -20]
            });

            // create new marker
            const newMarker = L.marker([selectedPlace.coordinates.latitude, selectedPlace.coordinates.longitude], {
                icon: new BouncingIcon({iconUrl: '/images/selected-marker.png', iconSize: [40, 40]})
            }).addTo(mapInstanceRef.current);

            newMarker.bindPopup(`<b>Name: ${selectedPlace.name}</b><br>Address: ${selectedPlace.address}`);

            // save new marker
            setSelectedMarker(newMarker);

        }
    }, [selectedPlace]);

    const handleShowAllPlaces = () => {
        setIsShowAllPlaces(isShowAllPlaces => !isShowAllPlaces);
    };
    const handleShowPredictPane = () => {
        setIsShowPredictPane(isShowPredictPane => !isShowPredictPane)
    };
    return (
        <div className={styles.mapContainer}>
            <div className={styles.mapLeftContainer}>
                <div className={styles.scrollableContent}>
                    <RecommendedList
                        placeList={recommendedPlaces.slice(0, 10)}
                        category={category}
                        onPlaceSelect={(place) => setSelectedPlace(place)}
                        expectedLevelOfBusyness={expectedLevelOfBusyness}
                    />
                </div>
            </div>
            <div className={styles.mapRightContainer}>
                <div className={styles.mapShow}>
                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                             <div  className={`${styles.legendColor} ${styles.legendLevel1}`}></div>
                            <div className={styles.legendFont}>Very Busy</div>
                        </div>
                        <div className={styles.legendItem}>
                             <div  className={`${styles.legendColor} ${styles.legendLevel2}`}></div>
                            <div className={styles.legendFont}>Quiet Busy</div>
                        </div>
                        <div className={styles.legendItem}>
                             <div  className={`${styles.legendColor} ${styles.legendLevel3}`}></div>
                            <div className={styles.legendFont}>Moderately Busy</div>
                        </div>
                        <div className={styles.legendItem}>
                            <div  className={`${styles.legendColor} ${styles.legendLevel4}`}></div>
                            <div className={styles.legendFont}>Somewhat Busy</div>
                        </div>
                        <div className={styles.legendItem}>
                             <div  className={`${styles.legendColor} ${styles.legendLevel5}`}></div>
                            <div className={styles.legendFont}>Not Busy</div>
                        </div>
                    </div>
                    {isShowPredictPane &&
                    <div className={styles.playbackContainer}>
                        <PredictBusyness setHour={setSelectedHour}/>
                    </div>}
                    <div className={styles.showAllPlacesContainer}>
                        <button className={styles.showAllPlaces} onClick={handleShowAllPlaces}>{isShowAllPlaces ? 'See Best' : 'See All'} </button>
                    </div>

                    <div className={styles.showPredictPaneContainer}>
                        <button className={styles.showPredictPane} onClick={handleShowPredictPane}>{!isShowPredictPane ? 'See predict' : 'Hide predict'} </button>
                    </div>

                    <div ref={mapRef} className={styles.map}></div>
                </div>
                {/*Floating buttons*/}
                <div className={styles.iconButtonContainer}>
                    {isAuthenticated ? (<a href="/community" title="Community">
                                <img src="./images/communityIcon.png" className={styles.iconButton}  alt={"community link"}/>
                            </a>): ""}
                        <a href="/" title="Home">
                            <img src="./images/homeIcon.png" className={styles.iconButton} alt={"home link"}/>
                        </a>
                </div>
            </div>
            <StreetDataFetcher onDataFetch={handleStreetDataFetch}/>
        </div>
    );
}

export default MapComponent;