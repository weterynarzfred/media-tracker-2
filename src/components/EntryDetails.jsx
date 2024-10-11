import { useState } from "@/components/StateProvider";

function getDetails(entry) {
  if (entry === undefined) return <div className="placeholder">no entry selected</div>;

  return <>
    <table>
      <tbody>
        <tr>
          <td>id</td>
          <td>{entry.id}</td>
        </tr>
        <tr>
          <td>name</td>
          <td>{entry.name}</td>
        </tr>
      </tbody>
    </table>
  </>;
}

export default function EntryDetails() {
  const state = useState();
  const entry = state.entries[state.selectedEntryId];

  return <div className="EntryDetails">
    <h2>entry details</h2>
    {getDetails(entry)}
  </div>;
}
