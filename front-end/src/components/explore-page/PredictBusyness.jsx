import React, { useState, useEffect, useRef } from 'react';
import { Slider, Button } from 'antd';
import styles from './PredictBusyness.module.css';
import { useNavigate } from 'react-router-dom';

const PredictBusyness = ({ setHour }) => {
    const [selectedHour, setSelectedHour] = useState(0);
    const navigate = useNavigate();

    const handleSubmit = () => {
        // console.log(`Selected time point: ${formatTime(selectedHour)}`);
        navigate('/map/predict', { state: { selectedHour } });
    };

    useEffect(() => {
        setHour(selectedHour);
    }, [selectedHour, setHour]);

    const formatTime = (hour) => {
        return `${hour.toString().padStart(2, '0')}:00`; // Format to "00:00" (e.g., "08:00")
    };

    const debounceTimeoutRef = useRef(null); // Ref to hold the timeout ID

    const onChange = value => {
        // Clear any existing timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Set a new timeout to call setSelectedHour after a delay of 100ms
        debounceTimeoutRef.current = setTimeout(() => {
            setSelectedHour(value);
        }, 100);
    };
    return (
          <div className={styles.playbackControl}>
             <h3 className={styles.playbackTitle}>Busyness Forecast</h3>
             <Slider
                 min={0}
                 max={23}
                 defaultValue={selectedHour}
                 onChange={onChange}
                //  tipFormatter={value => formatTime(value)} // Format tooltip to "00:00"
                 // tooltip.formatter = {value => formatTime(value)}
                 tooltip={{ formatter: value => `${value}` }}
                 marks={{
                     0: { style: { fontSize: '14px', fontWeight: 'bold', color:'white'}, label: formatTime(0) },
                     24: { style: { fontSize: '14px', fontWeight: 'bold', color:'white' }, label: formatTime(24) },
                 }}
             />
             <br />
             <div className={styles.playbackContent}>
                 Selected time point: {formatTime(selectedHour)}
             </div>
             <br />
             <Button type="primary" className={styles.playbackBtn} onClick={handleSubmit}>
                 Predict
             </Button>
         </div>
    );
};

export default PredictBusyness;
