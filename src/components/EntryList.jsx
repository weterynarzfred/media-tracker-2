import { useState } from "@/components/StateProvider";

export default function EntryList() {
  const state = useState();

  if (!state.isLoaded) return <div className="loader">loading</div>;

  const entryElements = [];
  for (const entryId in state.entries) {
    const entry = state.entries[entryId];
    entryElements.push(<div className="entry" key={entryId}>
      <div className="entry__name">{entry.name}</div>
    </div>);
  }

  return <div className="EntryList">
    <h1>entry list</h1>
    {entryElements}
  </div>;
}
