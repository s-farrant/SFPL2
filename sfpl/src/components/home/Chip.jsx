import clsx from "clsx";
import styles from "./Chip.module.css";

export default function Chip({ label, icon: Icon, status }) {

    const statusLookup = {
        active: styles.activeChip,
        played: styles.playedChip,
        available: styles.availableChip
    };

    return (
        <div className="col d-flex flex-column justify-content-center align-items-center text-center">
            <div className={clsx(
                "w-100 py-2 gap-2 d-flex flex-column justify-content-center align-items-center text-center",
                styles.chipContainer,
                statusLookup[status]
            )}>
                <Icon width={25} height={25} />
                <span className={styles.chipLabel}>{label}</span>
            </div>
        </div>
    )
}