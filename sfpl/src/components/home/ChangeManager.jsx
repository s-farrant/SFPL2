import { useState } from "react";

import { apiFetch } from "../../api";

import { Enter } from "../../components/icons/Enter";

import clsx from "clsx";
import styles from "./ChangeManager.module.css";

export default function ChangeManager({ showModalTrueFalse, setShowModalFunction }) {

    const [managerIdOnChange, setManagerIdOnChange] = useState("");
    const [managerId, setManagerId] = useState(JSON.parse(localStorage.getItem("managerId")));
    const [validId, setValidId] = useState(true);

    const handleSubmit = async () => {
        const valid = await apiFetch(`/manager/${managerIdOnChange}/valid`);
        if (valid.valid) {
            console.log("yep")
            localStorage.setItem("managerId", JSON.stringify(managerIdOnChange));
            setManagerId(managerIdOnChange);
            setShowModalFunction(false);

        } else {
            setValidId(false)
        }
    }

    return (
        <>
            <div className={`modal fade ${showModalTrueFalse ? 'show d-block' : ''}`} tabIndex="-1">
                <div className={clsx("modal-dialog d-flex align-items-center justify-content-center modal-dialog-centered", styles.modalDialogue)}>
                    <div className={clsx("modal-content ps-2 pe-2 pb-2", styles.modalContent)}>
                        <div className={clsx("modal-header", styles.modalHeader)}>
                            <h5 className={clsx("modal-title", styles.modalTitle)}>Change Manager ID</h5>
                            <button type="button" className={clsx("btn-close", styles.closeButton)} data-bs-dismiss="modal" aria-label="Close" onClick={() => { setShowModalFunction(false); setValidId(true); }}></button>
                        </div>
                        <div className="modal-body d-flex justify-content-center">
                            <input value={managerIdOnChange} placeholder="Manager ID" onChange={(e) => setManagerIdOnChange(e.target.value)}></input>
                            <button className={clsx("ms-2", styles.enterButton)} onClick={handleSubmit}>
                                <Enter width={25} height={25}/>
                            </button>
                        </div>
                        {validId ? null : (
                            <div className={clsx("d-flex align-items-center justify-content-center mb-2", styles.validId)}>Invalid Manager ID</div>
                        )}
                    </div>
                </div>
            </div>
            {showModalTrueFalse ? <div className="modal-backdrop fade show" /> : null}
        </>
    )
}