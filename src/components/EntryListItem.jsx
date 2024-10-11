import { ACTION_TYPES } from "@/clientSide/mainReducer";
import { useDispatch, useTrackedState } from "@/components/StateProvider";

export default function EntryListItem({ entryId }) {
  const dispatch = useDispatch();
  const state = useTrackedState();
  const entry = state.entries[entryId];
  if (entry === undefined) return null;

  function handleClick() {
    dispatch({ type: ACTION_TYPES.SELECT_ENTRY, payload: { entryId } });
  }

  return <div className="EntryListItem" onClick={handleClick}>
    <div className="cell EntryListItem__id">{entry.id}</div>
    <div className="cell EntryListItem__name">{entry.name}</div>
  </div>;
}
