import { useState } from "@/components/StateProvider";

export default function EntryListItem({ entryId }) {
  const state = useState();
  const entry = state.entries[entryId];
  if (entry === undefined) return null;

  return <div className="EntryListItem">
    <div className="cell EntryListItem__id">{entry.id}</div>
    <div className="cell EntryListItem__name">{entry.name}</div>
  </div>;
}
