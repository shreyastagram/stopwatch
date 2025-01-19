import styles from '../styles/LapList.module.css'

export default function LapList({ laps }) {
  return (
    <div className={styles.laps}>
      <h3>Lap Times</h3>
      <ul>
        {laps.map((lap, index) => (
          <li key={index}>
            <span className={styles.lapNumber}>{`Lap ${index + 1} `}:</span>
            <span className={styles.lapTime}>
              {lap.seconds}.{lap.microseconds < 10 ? '0' + lap.microseconds : lap.microseconds}s
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
