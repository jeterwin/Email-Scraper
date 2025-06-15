import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const VoteCtx = createContext();

export function VoteProvider({ children }) {
    const [selectedIds, setSelectedIds] = useState([]);   // array of voted event IDs
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get("http://localhost/email_scraper/Backend/Events/get_user_votes.php",
                    { withCredentials: true }
                );
                const ids = Object.entries(res.data).filter(([_, interested]) => interested).map(([id]) => id);
                setSelectedIds(ids);
            } catch (err) {
                console.error("Failed to load votes", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const toggleVote = useCallback(async (eventId, interested) => {
        const body = new URLSearchParams({
            event_id: eventId,
            interested: interested ? "1" : "0",
        });
        try {
            await axios.post("http://localhost/email_scraper/Backend/Events/vote_event.php",
                body.toString(),
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }
            );
            setSelectedIds((prev) =>
                interested
                    ? [...prev, eventId]
                    : prev.filter((id) => id !== eventId)
            );
        } catch (err) {
            console.error("Vote failed", err);
        }
    }, []);

    return (
        <VoteCtx.Provider value={{ selectedIds, toggleVote, loading }}>
            {children}
        </VoteCtx.Provider>
    );
}

export const useVotes = () => useContext(VoteCtx);
