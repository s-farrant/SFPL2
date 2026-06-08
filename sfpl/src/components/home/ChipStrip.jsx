import Chip from "./Chip";
import { TripleCaptain } from "../icons/TripleCaptain";
import { BenchBoost } from "../icons/BenchBoost";
import { FreeHit } from "../icons/FreeHit";
import { Wildcard } from "../icons/Wildcard";

import clsx from "clsx";
import styles from "./ChipStrip.module.css";
import styles2 from "./Chip.module.css";

export default function ChipStrip({ chipInfo, gameweek }) {

    const chipData = gameweek <= 19 ? chipInfo.first : chipInfo.second;

    const statusLookup = {
        active: styles2.activeChipText,
        played: styles2.playedChip,
        available: styles2.availableChip
    };

    return (
        <div className={clsx(
            "d-flex flex-column mb-4 align-items-center justify-content-center",
            styles.chipStripDiv
            )}>
            <div className={clsx(
                "row m-0 gx-2 w-100",
                styles.chipStripRow
            )}>
                <Chip icon={TripleCaptain} label="Triple Captain" status={chipData["3xc"].status} />
                <Chip icon={BenchBoost} label="Bench Boost" status={chipData.bboost.status} />
                <Chip icon={Wildcard} label="Wildcard" status={chipData.wildcard.status} />
                <Chip icon={FreeHit} label="Free Hit" status={chipData.freehit.status} />
            </div>
            <div className="row w-100 m-0 gx-2">
                <div className="col d-flex flex-column justify-content-center align-items-center text-center">
                    <span className={clsx(styles.chipStatus, statusLookup[chipData["3xc"].status])}>{chipData["3xc"].status.toUpperCase()}</span>
                </div>
                <div className="col d-flex flex-column justify-content-center align-items-center text-center">
                    <span className={clsx(styles.chipStatus, statusLookup[chipData.bboost.status])}>{chipData.bboost.status.toUpperCase()}</span>
                </div>
                <div className="col d-flex flex-column justify-content-center align-items-center text-center">
                    <span className={clsx(styles.chipStatus, statusLookup[chipData.wildcard.status])}>{chipData.wildcard.status.toUpperCase()}</span>
                </div>
                <div className="col d-flex flex-column justify-content-center align-items-center text-center">
                    <span className={clsx(styles.chipStatus, statusLookup[chipData.freehit.status])}>{chipData.freehit.status.toUpperCase()}</span>
                </div>
            </div>
        </div>
    )
}