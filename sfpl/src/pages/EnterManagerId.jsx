import { useState } from "react";

import { apiFetch } from "../api.js";

import clsx from "clsx"
import styles from "./EnterManagerId.module.css";
import { Enter } from "../components/icons/Enter";

export default function EnterManagerId({ setManagerId }) {

    const [managerId, setManagerIdOnChange] = useState("");
    const [validId, setValidId] = useState(true);

    const handleSubmit = async () => {
        const valid = await apiFetch(`/manager/${managerId}/valid`);

        if (valid.valid) {
            localStorage.setItem("managerId", JSON.stringify(managerId));
            setManagerId(managerId);
        } else {
            setValidId(false)
        }
    }

    return (
        <div className={clsx("h-100 w-100 d-flex flex-column align-items-center justify-content-center", styles.main)}>
            <div className={styles.sfpl}>SFPL</div>
            <div className="pb-4 d-flex flex-column align-items-center justify-content-center">
                Enter your manager ID:
                <span class={styles.example}>(Example 1123217)</span>
            </div>
            <div>
                <input value={managerId} onChange={(e) => setManagerIdOnChange(e.target.value)}></input>
                <button className={clsx("ms-2", styles.enterButton)} onClick={handleSubmit}>
                    <Enter width={25} height={25}/>
                </button>
            </div>
            <div className={clsx("mt-3", styles.validId)}>{validId ? null : "Invalid Manager ID"}</div>
        </div>
    )
}