import clsx from "clsx";
import styles from "./PlayerCard.module.css";
import { Substitute } from "./icons/Substitute";

export default function PlayerCard(props) {

    const outfieldJerseys = import.meta.glob(
        "../assets/outfield_jerseys/*.webp",
        { eager: true, import: "default" }
    );

    const goalkeeperJerseys = import.meta.glob(
        "../assets/goalkeeper_jerseys/*.webp",
        { eager: true, import: "default" }
    );

    function getOutfieldJersey(filename) {
        return outfieldJerseys[`../assets/outfield_jerseys/${filename}`];
    }

    function getGoalkeeperJersey(filename) {
        return goalkeeperJerseys[`../assets/goalkeeper_jerseys/${filename}`];
    }

    const pointsStyle = {
        ...(props.player?.badgeColor ? { backgroundColor: props.player.badgeColor } : {}),
        ...(props.player?.textColor ? { color: props.player.textColor } : {}),
    };

    return (
        <div className={clsx(styles.playerCardContainer, props.variant === "bench" && styles.playerCardBench, "p-0 d-flex flex-column justify-content-between align-items-stretch")} onClick={(e) => { e.stopPropagation(); props.onClick(props.playerId)}}>
            <div className={styles.shirtContainer}>
                <img src={props.player?.position == 1 ? getGoalkeeperJersey(`${props.player?.team}.webp`) : getOutfieldJersey(`${props.player?.team}.webp`)} />
            </div>
            {props.player?.armband ? <span className={styles.armbandBadge}>{props.player.armband}</span> : null}
            {props.player?.isAutoSub ? <Substitute className={styles.autoSubIcon} width={10} height={10} title="Auto-substituted" /> : null}
            <div className={clsx(styles.playerInfo)}>
                <div className={clsx(styles.playerName, "d-flex align-items-center justify-content-center")}><span className={styles.playerNameText}>{props.player?.name}</span></div>
                <div
                    className={clsx(styles.playerPoints, props.player?.compactText && styles.playerPointsCompact, "d-flex align-items-center justify-content-center")}
                    style={pointsStyle}
                >
                    {props.player?.points}
                </div>
            </div>
        </div>
    )
}