import styles from "./Loading.module.css";

export default function Loading({ isLoading }) {
    return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <div className={styles.spinner}></div>
        </div>
    )
}