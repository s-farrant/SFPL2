import clsx from "clsx";
import styles from "./Pitch.module.css";
import PlayerCard from "./PlayerCard";

export default function Pitch(props) {
    return (
        <div className={clsx(styles.pitchContainer, "pt-3 pb-3")} onClick={() => props.onClickDismiss(null)}>
            <div className={clsx(styles.positionRow, "row m-0 d-flex align-items-center justify-content-center gap-3")}>
                {props.players.gkp.map(player => {
                    return <PlayerCard onClick={props.onClick} key={player.id} playerId={player.id} player={player} />
                })}
            </div>
            <div className={clsx(styles.positionRow, "row m-0 d-flex align-items-center justify-content-center gap-3")}>
                {props.players.def.map(player => {
                    return <PlayerCard onClick={props.onClick} key={player.id} playerId={player.id} player={player} />
                })}
            </div>
            <div className={clsx(styles.positionRow, "row m-0 d-flex align-items-center justify-content-center gap-3")}>
                {props.players.mid.map(player => {
                    return <PlayerCard onClick={props.onClick} key={player.id} playerId={player.id} player={player} />
                })}
            </div>
            <div className={clsx(styles.positionRow, "row m-0 d-flex align-items-center justify-content-center gap-3")}>
                {props.players.fwd.map(player => {
                    return <PlayerCard onClick={props.onClick} key={player.id} playerId={player.id} player={player} />
                })}
            </div>
        </div>
    )
}