import styles from "./StatDropdown.module.css";

const VIEWS = [
    { id: "points", label: "Points" },
    { id: "fixture", label: "Fixture" },
    { id: "form", label: "Form" },
    { id: "priceChange", label: "Price Δ" },
    { id: "ict", label: "ICT" },
    { id: "selected", label: "Selected %" },
];

export default function StatDropdown({ value, onChange }) {
    return (
        <select className={styles.dropdown} value={value} onChange={(e) => onChange(e.target.value)}>
            {VIEWS.map(view => (
                <option key={view.id} value={view.id}>{view.label}</option>
            ))}
        </select>
    )
}
