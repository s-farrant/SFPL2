import { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useGameweek } from "../../contexts/GameweekProvider"

import { useFetch } from '../../hooks/useFetch.js';
import { apiFetch } from '../../api.js';

import Loading from '../../components/Loading';
import Pitch from '../../components/Pitch';
import BenchStrip from '../../components/team/BenchStrip';
import StatDropdown from '../../components/team/StatDropdown';
import { ArrowLeft } from '../../components/icons/ArrowLeft';
import { ArrowRight } from '../../components/icons/ArrowRight';
import { TripleCaptain } from '../../components/icons/TripleCaptain';
import { BenchBoost } from '../../components/icons/BenchBoost';
import { Wildcard } from '../../components/icons/Wildcard';
import { FreeHit } from '../../components/icons/FreeHit';

import clsx from 'clsx';
import styles from "./Team.module.css";

const FDR_COLORS = { 1: "#4caf50", 2: "#7cb342", 3: "#e7e7e7", 4: "#c0392b", 5: "#7a1414" };
const FDR_NEUTRAL_TEXT_COLOR = "var(--default-black)";

const CHIP_LABELS = {
    "3xc": "Triple Captain",
    bboost: "Bench Boost",
    wildcard: "Wildcard",
    freehit: "Free Hit",
};

const CHIP_ICONS = {
    "3xc": TripleCaptain,
    bboost: BenchBoost,
    wildcard: Wildcard,
    freehit: FreeHit,
};

const formatPriceChange = (priceChange) => {
    const sign = priceChange > 0 ? "+" : priceChange < 0 ? "-" : "";
    return `${sign}£${Math.abs(priceChange / 10).toFixed(1)}m`;
};

const decoratePlayer = (player, statView) => {
    let points;
    let badgeColor;
    let textColor;
    let compactText;

    switch (statView) {
        case "fixture":
            points = player.fixture;
            compactText = player.fixtureDifficulty.length > 1;
            if (player.fixtureDifficulty.length > 0) {
                const maxDifficulty = Math.max(...player.fixtureDifficulty);
                badgeColor = FDR_COLORS[maxDifficulty];
                if (maxDifficulty === 3) textColor = FDR_NEUTRAL_TEXT_COLOR;
            }
            break;
        case "form":
            points = player.form;
            break;
        case "priceChange":
            points = formatPriceChange(player.priceChange);
            break;
        case "ict":
            points = player.ictIndex;
            break;
        case "selected":
            points = `${player.selectedByPercent}%`;
            break;
        case "points":
        default:
            points = player.fixtureStarted ? player.points : player.fixture;
            break;
    }

    return { ...player, points, badgeColor, textColor, compactText };
};

export default function Team() {

    const [playerInfo, setPlayerInfo] = useState(null);
    const [statView, setStatView] = useState("points");

    const navigate = useNavigate();

    const { gameweekId } = useParams();
    const currentGameweek = useGameweek().gameweekId;

    const managerId = JSON.parse(localStorage.getItem("managerId"), null);

    const { data, loading, error } = useFetch(`/team/${managerId}/${gameweekId}`, gameweekId);
    const { data: managerData, loading: managerLoading, error: managerError } = useFetch(`/manager/${managerId}`);

    useEffect(() => {
        setPlayerInfo(null);
        setStatView("points");
    }, [gameweekId]);

    if (loading || managerLoading) return <Loading loading={true} />
    if (error || managerError) {
        return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <div>Error loading data</div>
        </div>
        )
    }

    const fetchPlayerInfo = async (playerId) => {
        setPlayerInfo({ loading: true });
        const selectedPlayerData = await apiFetch(`/players/${playerId}?gameweek=${gameweekId}`);
        setPlayerInfo(selectedPlayerData);
    };

    const startingPlayers = {
        gkp: data.gkp.map(player => decoratePlayer(player, statView)),
        def: data.def.map(player => decoratePlayer(player, statView)),
        mid: data.mid.map(player => decoratePlayer(player, statView)),
        fwd: data.fwd.map(player => decoratePlayer(player, statView)),
    };
    const benchPlayers = data.bench.map(player => decoratePlayer(player, statView));

    const ChipIcon = data.activeChip ? CHIP_ICONS[data.activeChip] : null;

    return (
        <div className="d-flex flex-column align-items-center h-100">
            <div className={clsx("d-flex flex-column align-items-center justify-content-center w-100", styles.headingContainer)}>
                <div className={clsx(styles.teamHeading, "pb-2")}>{managerData.info.teamName}</div>
                <div className="row w-100">
                    <div className="col-3 d-flex align-items-center justify-content-center"><button className={styles.gameweekForwardBack} onClick={() => navigate(`/team/${Number(gameweekId) - 1}`)} disabled={Number(gameweekId) <= 1}><ArrowLeft width={25} height={25} /></button></div>
                    <div className={clsx("d-flex align-items-center justify-content-center col-6", styles.gameweekText)}>Gameweek {gameweekId}</div>
                    <div className="col-3 d-flex align-items-center justify-content-center"><button className={styles.gameweekForwardBack} onClick={() => navigate(`/team/${Number(gameweekId) + 1}`)} disabled={Number(gameweekId) >= currentGameweek}><ArrowRight width={25} height={25} /></button></div>
                </div>
            </div>
            <div className={styles.pitchSection}>
                {data.activeChip ? (
                    <div className={clsx("w-100 d-flex align-items-center justify-content-center gap-2", styles.chipBanner)}>
                        <ChipIcon width={18} height={18} />
                        <span>{CHIP_LABELS[data.activeChip]} Active</span>
                        <ChipIcon width={18} height={18} />
                    </div>
                ) : null}
                <div className={styles.pitchContainer}>
                    <div className={styles.statDropdownWrapper}>
                        <StatDropdown value={statView} onChange={setStatView} />
                    </div>
                    <Pitch onClick={fetchPlayerInfo} onClickDismiss={setPlayerInfo} players={startingPlayers} />
                </div>
            </div>
            <div className={clsx(styles.totalPointsContainer, "w-100 d-flex align-items-center justify-content-center")}><span className={styles.totalPoints}>{data.totalPoints.toLocaleString()}pts</span></div>
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
            <div className={styles.benchContainer}><BenchStrip onClick={fetchPlayerInfo} onClickDismiss={setPlayerInfo} players={benchPlayers} /></div>
        </div>
    )
}
