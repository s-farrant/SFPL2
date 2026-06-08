import { useState, useEffect, useContext, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useGameweek } from "../../contexts/GameweekProvider"

import { useFetch } from '../../hooks/useFetch.js';
import { apiFetch } from '../../api.js';

import Loading from '../../components/Loading';
import Pitch from '../../components/Pitch';
import { ArrowLeft } from '../../components/icons/ArrowLeft';
import { ArrowRight } from '../../components/icons/ArrowRight';

import clsx from 'clsx';
import styles from "./Dreamteam.module.css";

export default function Dreamteam() {

    const [playerInfo, setPlayerInfo] = useState(null);

    const navigate = useNavigate();

    const { gameweekId } = useParams();
    const gameweek = useGameweek().gameweekId

    const { data, loading, error } = useFetch(`/dreamteam/${gameweekId}`, gameweekId);

    useEffect(() => {
        setPlayerInfo(null);
    }, [gameweekId]);

    if (loading) return <Loading loading={true} />
    if (error) {
        return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <div>Error loading data</div>
        </div>
        )
    }

    const fetchPlayerInfo = async (playerId) => {
        setPlayerInfo({ loading: true });
        if (gameweekId == "season") {
            const selectedPlayerData = await apiFetch(`/dreamteam/playerInfo/${playerId}/season`);
            setPlayerInfo(selectedPlayerData);
        } else {
            const selectedPlayerData = await apiFetch(`/dreamteam/playerInfo/${playerId}?gameweek=${gameweekId}`);
            setPlayerInfo(selectedPlayerData);
        }
    };

    return (
        <div className="d-flex flex-column align-items-center h-100">
            <div className={clsx("d-flex flex-column align-items-center justify-content-center w-100", styles.headingContainer)}>
                <div className={clsx(styles.dreamteamHeading, "pb-2")}>Dreamteam</div>
                <div className="row w-100">
                    {gameweekId == "season" ? null : <div className="col-3 d-flex align-items-center justify-content-center"><button className={styles.gameweekForwardBack} onClick={() => navigate(`/dreamteam/${Number(gameweekId) - 1}`)} disabled={Number(gameweekId) <= 1}><ArrowLeft width={25} height={25} /></button></div>}
                    <div className={clsx("d-flex align-items-center justify-content-center", styles.gameweekText, gameweekId == "season" ? null : "col-6")}>{gameweekId == "season" ? "Season" : `Gameweek ${gameweekId}`}</div>
                    {gameweekId == "season" ? null :<div className="col-3 d-flex align-items-center justify-content-center"><button className={styles.gameweekForwardBack} onClick={() => navigate(`/dreamteam/${Number(gameweekId) + 1}`)} disabled={Number(gameweekId) >= gameweek}><ArrowRight width={25} height={25} /></button></div>}
                </div>
            </div>
            <div className={styles.pitchContainer}><Pitch onClick={fetchPlayerInfo} onClickDismiss={setPlayerInfo} players={data}/></div>
            <div className={clsx(styles.totalPointsContainer, "w-100 d-flex align-items-center justify-content-center")}><span className={styles.totalPoints}>{data.totalPoints.toLocaleString()}pts</span><span className="ps-1"></span></div>
            <div className={clsx(styles.playerInfo, "w-100 d-flex align-items-center justify-content-center")}>
                <div className={clsx(styles.playerInfoName, "d-flex align-items-center justify-content-center")}>
                    {playerInfo ? (
                        playerInfo.loading ? (
                            "Loading..."
                        ) :
                        <>
                                {playerInfo.name}:<span className="pe-1"></span>
                                {playerInfo.stats.map((stat, index) => (
                                    <Fragment key={index}>
                                        {stat.value ? `${stat.statName} (${stat.value})` : stat.statName}
                                        {index < playerInfo.stats.length - 1 ? (
                                            <span className={clsx("ps-1 pe-1", styles.divider)}>|</span>
                                        ) : null}
                                    </Fragment>
                                ))}
                            </>

                    ) : "No Player Selected"}
                </div>
            </div>
            <div className={clsx(styles.topPlayerContainer, "w-100 d-flex align-items-center ps-4")}>
                <div className={clsx("d-flex align-items-center justify-content-center", styles.imageContainer)}>
                    <img className={clsx(styles.playerImage, "pt-1")} src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${data.topPlayer.image}.png`} />
                </div>
                <div className={clsx("ps-4", styles.playerText)}>
                    <div className={clsx(styles.starPlayer, "ps-2 pe-2 mb-1")}>STAR PLAYER</div>
                    <div className={styles.starPlayerName}>{data.topPlayer.webName} — {data.topPlayer.points}pts</div>
                    <div className={styles.teamName}>{data.topPlayer.teamName}</div>
                </div>
            </div>
        </div>
    )
}