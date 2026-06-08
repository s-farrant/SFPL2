import { useState, useEffect } from "react";

import { apiFetch } from "../api.js";

export function useFetch(path, deps=null) {    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const result = await apiFetch(path);
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [path, deps]);

    return { data, loading, error };
}