import clsx from "clsx";
import styles from "./PointsCard.module.css"

export default function PointsCard({ managerInfo }) {

    return (
        <div className={styles.currentPoints}>
            <img src="src/assets/wavy_pattern.jpg" />
            <div className={clsx(
                "d-flex align-items-center justify-content-center h-100", 
                styles.content
                )}>
                <div className="col-6 d-flex flex-column align-items-center">
                    <div className="row">
                        <span className={styles.pointsHeading}>Gameweek</span>
                    </div>
                    <div className="row">
                        <span className={styles.pointsFigure}>{managerInfo.gameweekPoints}</span>
                    </div>
                    <div className="row">
                        <span className={styles.pointsAverage}>Avg {managerInfo.gameweekAveragePoints}</span>
                    </div>
                </div>
                <div className="col-6 d-flex flex-column align-items-center">
                    <div className="row">
                        <span className={styles.pointsHeading}>Total</span>
                    </div>
                    <div className="row">
                        <span className={styles.pointsFigure}>{managerInfo.overallPoints.toLocaleString()}</span>
                    </div>
                    <div className="row">
                        <span className={styles.pointsAverage}>Avg {managerInfo.overallAveragePoints.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}