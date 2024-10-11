import EntryListItem from "@/components/EntryListItem";
import { useState } from "@/components/StateProvider";

export default function EntryList() {
  const state = useState();

  const entryElements = [];
  for (const entryId in state.entries) {
    entryElements.push(<EntryListItem key={entryId} entryId={entryId} />);
  }

  return <div className="EntryList">
    <h2>entry list</h2>
    <div className="EntryList__table">{entryElements}</div>
  </div>;
}
