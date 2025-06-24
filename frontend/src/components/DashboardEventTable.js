import React from 'react';
import EventTable from './EventTable';

export default function DashboardEventTable({data, selectedIds, onToggleVote}) {
    return <EventTable data={data} selectedIds={selectedIds} onToggleVote={onToggleVote} showButton={true} title="Latest Events" />;
}
