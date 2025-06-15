import React from 'react';
import EventTable from './EventTable';

export default function FullEventTable({data, selectedIds, onToggleVote}) {
    return <EventTable data={data} selectedIds={selectedIds} onToggleVote={onToggleVote} showButton={false} />;
}
