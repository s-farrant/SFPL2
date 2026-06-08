import { Outlet, Link } from "react-router-dom";

import styles from "./GlobalLayout.module.css";

export default function GlobalLayout() {
    return (
        <div className={styles.globalLayout}>
                <Outlet />
        </div>
    );
}