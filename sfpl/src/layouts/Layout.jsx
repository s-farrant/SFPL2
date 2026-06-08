import { Outlet, Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import clsx from "clsx";
import styles from "./Layout.module.css";

import { Team } from "../components/icons/Team";
import { Home } from "../components/icons/Home";
import { Leagues } from "../components/icons/Leagues";
import { Players } from "../components/icons/Players";
import { Fixtures } from "../components/icons/Fixtures";
import { PageBack } from "../components/icons/PageBack";
import { PageForward } from "../components/icons/PageForward";

export default function Layout() {

    const location = useLocation();
    const navigate = useNavigate();

    const hideBack = ["/", "/team", "/leagues", "/players", "/fixtures"].includes(location.pathname);

    const navClass = (isActive) => {
        return clsx(
            "col d-flex flex-column align-items-center justify-content-center text-decoration-none text-reset",
            styles.menuText,
            isActive ? styles.activeIndicator : ""
        )
    }

    return (
        <div className={clsx(styles.layoutWrapper, !hideBack ? styles.layoutWrapperTopNav : null)}>
            {
                !hideBack ? 
                    <div className={clsx("row d-flex align-items-center", styles.topNav)}>
                        <button className={clsx("col d-flex justify-content-center", styles.navigationButton)} onClick={() => navigate(-1)}><PageBack width={25} height={25} /></button>
                        <div className="col d-flex justify-content-center">
                            <div className={clsx(styles.sfpl)}>SFPL</div>
                        </div>
                        <button className={clsx("col d-flex justify-content-center", styles.navigationButton)} onClick={() => navigate(1)}><PageForward width={25} height={25} /></button>
                    </div> : null
            }
            <div className={styles.content}>
                <Outlet />
            </div>
            <nav className={clsx("row m-0 w-100", styles.bottomNav)}>
                <NavLink className={({ isActive }) => navClass(isActive)} to="/">
                    <Home width={25} height={25} />
                    Home
                </NavLink>
                <NavLink className={({ isActive }) => navClass(isActive)} to="/team">
                    <Team height={25} width={25} />
                    Team
                </NavLink>
                <NavLink className={({ isActive }) => navClass(isActive)} to="/leagues">
                    <Leagues height={25} width={25} />
                    Leagues
                </NavLink>
                <NavLink className={({ isActive }) => navClass(isActive)} to="/players">
                    <Players height={25} width={25} />
                    Players
                </NavLink>
                <NavLink className={({ isActive }) => navClass(isActive)} to="/fixtures">
                    <Fixtures height={25} width={25} />
                    Fixtures
                </NavLink>
            </nav>
        </div>
    );
}