import TextareaAutosize from "react-textarea-autosize";

import { useDispatch, useTrackedState } from "@/components/StateProvider";
import { ACTION_TYPES } from "@/clientSide/mainReducer";
import editEntry from "@/clientSide/editEntry";

function getDetails(entry) {
  return <>
    <table>
      <tbody>
        <tr>
          <td>id</td>
          <td><input
            type="text"
            name="id"
            value={entry?.id ?? -1}
            readOnly={true}
          /></td>
        </tr>
        <tr>
          <td>name</td>
          <td><TextareaAutosize
            key={entry?.id}
            name="name"
            placeholder="name"
            autoComplete="off"
            defaultValue={entry?.name}
          /></td>
        </tr>
      </tbody>
    </table>
    <button type="submit" className="button button--edit-entry">
      {entry === undefined ? "add" : "save"}
    </button>
  </>;
}

function handleSubmit(dispatch, entry, event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  editEntry({
    form: formData,
    isNew: entry === undefined,
    callback: data => {
      dispatch({
        type: ACTION_TYPES.EDIT_ENTRY,
        payload: { entry: data.entry },
      });
    },
  });
}

export default function EntryDetails() {
  const dispatch = useDispatch();
  const state = useTrackedState();
  const entry = state.entries[state.selectedEntryId];

  return <div className="EntryDetails">
    <form onSubmit={handleSubmit.bind(null, dispatch, entry)}>
      {getDetails(entry)}
    </form>
  </div>;
}
