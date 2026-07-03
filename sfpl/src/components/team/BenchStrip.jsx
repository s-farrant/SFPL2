import clsx from "clsx";
import styles from "./BenchStrip.module.css";
import PlayerCard from "../PlayerCard";

export default function BenchStrip(props) {
    return (
        <div className={clsx(styles.benchContainer, "d-flex flex-column")} onClick={() => props.onClickDismiss(null)}>
            <div className={clsx(styles.benchRow, "row m-0 d-flex align-items-center justify-content-center gap-3")}>
                {props.players.map(player => {
                    return <PlayerCard onClick={props.onClick} key={player.id} playerId={player.id} player={player} variant="bench" />
                })}
            </div>
        </div>
    )
}
