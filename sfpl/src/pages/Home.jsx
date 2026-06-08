import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useFetch } from "../hooks/useFetch.js"
import { useGameweek } from "../contexts/GameweekProvider"

import PointsCard from "../components/home/PointsCard"
import ChipStrip from "../components/home/ChipStrip"
import Loading from "../components/Loading.jsx"
import ChangeManager from "../components/home/ChangeManager.jsx"

import { Switch } from "../components/icons/Switch.jsx"

import clsx from "clsx";
import styles from "./Home.module.css";

export default function Home() {

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    const gameweekId = useGameweek().gameweekId

    const managerId = JSON.parse(localStorage.getItem("managerId"), null);

    const { data, loading, error } = useFetch(`/manager/${managerId}`);
    
    if (loading) return <Loading loading={true} />
    if (error) {
        return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <div>Error loading data</div>
        </div>
        )
    }

    return (
        <>
            <ChangeManager showModalTrueFalse={showModal} setShowModalFunction={setShowModal}/>
            <div className={clsx("d-flex flex-column align-items-center mb-4", styles.homepageWrapper)}>
                <div className={clsx("w-100 d-flex flex-column align-items-center justify-content-center", styles.titleContainer)}>
                    <div className={styles.sfpl}>SFPL</div>
                    <div className={styles.gameweekHeading}>Gameweek {gameweekId}</div>
                    <div className={clsx("m-2 d-flex align-items-center justify-content-center", styles.teamName)}>
                        {data.info.teamName}
                        <span className={clsx("ps-2", styles.switchManagerId)} onClick={() => setShowModal(true)}><Switch width={20} height={20} /></span>
                    </div>
                </div>
                <div className={clsx("w-100 d-flex flex-column align-items-center justify-content-center", styles.pointsChipsContainer)}>
                    <PointsCard managerInfo={data.info} />
                    <ChipStrip chipInfo={data.chips} gameweek={gameweekId}/>
                </div>
                <div className={clsx(
                    "d-flex flex-row align-items-center gap-3",
                    styles.dreamteamContainer)}>
                    <button className={clsx("w-100 h-100 d-flex align-items-center justify-content-center", styles.gameweekDreamteam)} onClick={() => navigate(`/dreamteam/${gameweekId}`)}>
                        GW{gameweekId} Dreamteam
                    </button>
                    <button className={clsx("w-100 h-100 d-flex align-items-center justify-content-center", styles.seasonDreamteam)} onClick={() => navigate("/dreamteam/season")}>
                        Season Dreamteam
                    </button>
                </div>
                <div className={clsx("h-100 w-100 d-flex align-items-center justify-content-center", styles.leagueSnippetContainer)}>
                    Mini league snippet coming soon...
                </div>
            </div>
        </>
    )
};