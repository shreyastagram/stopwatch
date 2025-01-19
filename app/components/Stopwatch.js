'use client'; // Ensures the component is client-side rendered

import { useState, useEffect, useRef } from 'react';
import Button from './Button';  // If you have a separate Button component
import LapList from './LapList'; // Import the new LapList component
import styles from '../styles/Stopwatch.module.css';

export default function Stopwatch() {
  const [time, setTime] = useState({ seconds: 0, microseconds: 0 }); // Combine time and microseconds in one state
  const [isLapDisabled, setIsLapDisabled] = useState(false);
  const [isLapRecording, setIsLapRecording] = useState(false); // Track lap recording state
  const [isRunning, setIsRunning] = useState(false); // Whether the stopwatch is running
  const [laps, setLaps] = useState([]); // Array to store lap times
  const intervalRef = useRef(null); // Reference to the interval ID for stopping the stopwatch
  const MAX_TIME = 86400; // Maximum time limit in seconds (24 hours)

  
  // Load state from localStorage if available
  useEffect(() => {
    const savedTime = localStorage.getItem('time');
    const savedLaps = localStorage.getItem('laps');
    
    if (savedTime) {
      setTime(JSON.parse(savedTime));
    }
    
    if (savedLaps) {
      setLaps(JSON.parse(savedLaps));
    }
  }, []);

  // Set up the interval for updating the time
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const updatedMicroseconds = prevTime.microseconds + 1;

          // If microseconds reach 100, increment seconds and reset microseconds
          if (updatedMicroseconds >= 100) {
            const newSeconds = prevTime.seconds + 1;
            // If seconds exceed the maximum limit, stop the stopwatch
            if (newSeconds >= MAX_TIME) {
              clearInterval(intervalRef.current); // Stop the stopwatch
              alert('Time limit reached!'); // Show an alert
              return { seconds: MAX_TIME, microseconds: 0 }; // Set time to the max limit
            }
            return { 
              seconds: newSeconds, // Increment seconds
              microseconds: 0 // Reset microseconds
            };
          }
          return {
            seconds: prevTime.seconds, // Keep seconds the same
            microseconds: updatedMicroseconds // Update microseconds
          };
        });
      }, 10); // Update every 10ms (for 100 microseconds per second)
    } else {
      clearInterval(intervalRef.current); // Clear the interval if stopped
    }

    return () => clearInterval(intervalRef.current); // Cleanup on component unmount
  }, [isRunning]);

  // Save state to localStorage whenever time or laps change
  useEffect(() => {
    localStorage.setItem('time', JSON.stringify(time));
    localStorage.setItem('laps', JSON.stringify(laps));
  }, [time, laps]);

  // Start the stopwatch
  const startStopwatch = () => setIsRunning(true);
  // Pause the stopwatch
  const pauseStopwatch = () => setIsRunning(false);
  // Reset the stopwatch
  const resetStopwatch = () => {
    setTime({ seconds: 0, microseconds: 0 }); // Reset time to 0
    setLaps([]); // Clear laps
    setIsRunning(false); // Stop the stopwatch
  };

  // Record a lap time with both seconds and microseconds
  const recordLap = () => {
    if (isLapDisabled || isLapRecording) return; // Prevent further clicks if lap button is temporarily disabled or lap is being recorded
    setIsLapRecording(true); // Set lap as being recorded

    // Ensure the stopwatch is running and time has changed
    setLaps((prevLaps) => [...prevLaps, { seconds: time.seconds, microseconds: time.microseconds }]);
  
    // Re-enable the lap button and lap recording state after a short delay (e.g., after 1 second)
    setTimeout(() => {
      setIsLapDisabled(false); // Re-enable lap button
      setIsLapRecording(false); // Stop recording lap
    }, 1000); // Adjust time as per requirement
  };

  return (
    <div className={styles.stopwatch}>
      <p>
        {time.seconds}.{time.microseconds < 10 ? '0' + time.microseconds : time.microseconds}s
      </p>
      <div>
      <Button 
  label={isRunning ? "Pause" : "Start"} 
  onClick={isRunning ? pauseStopwatch : startStopwatch} 
  disabled={false} 
  className={styles.button}
/>

<Button 
  label="Reset" 
  onClick={resetStopwatch} 
  disabled={time.seconds === 0 && !isRunning} 
  className={styles.button}
/>

<Button 
  label="Lap" 
  onClick={recordLap} 
  disabled={!isRunning || isLapRecording} 
  className={styles.button}
/>

      </div>

      {/* Use the LapList component to display lap times */}
      <LapList laps={laps} disabled={isLapRecording} /> {/* Pass disabled prop to LapList */}
    </div>
  );
}
