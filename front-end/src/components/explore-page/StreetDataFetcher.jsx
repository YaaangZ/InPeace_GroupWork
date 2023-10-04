import React, {useEffect} from 'react';

export function StreetDataFetcher({onDataFetch}) {
    useEffect(() => {
        const fetchStreetData = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/map/streets');
                const jsonData = await response.json();

                // Pass the processed data to the parent component
                onDataFetch(jsonData.features);
            } catch (error) {
                console.error('Error fetching and processing street data:', error);
            }
        };

        fetchStreetData();
    }, []);

    return null;
}

