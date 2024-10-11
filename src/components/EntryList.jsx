import { ACTION_TYPES } from "@/clientSide/mainReducer";
import EntryListItem from "@/components/EntryListItem";
import { useDispatch, useState } from "@/components/StateProvider";

export default function EntryList() {
  const dispatch = useDispatch();
  const state = useState();

  function handleAddNewButton() {
    dispatch({
      type: ACTION_TYPES.SELECT_ENTRY,
      payload: { entryId: null },
    });
  }

  const entryElements = [];
  for (const entryId in state.entries) {
    entryElements.push(<EntryListItem key={entryId} entryId={entryId} />);
  }

  return <div className="EntryList">
    <h2>entry list</h2>
    <div className="EntryList__table">{entryElements}</div>
    <button
      className="button button--add-entry"
      onClick={handleAddNewButton}
    >add new</button>
  </div>;
}
