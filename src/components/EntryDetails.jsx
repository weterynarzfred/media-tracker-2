import TextareaAutosize from "react-textarea-autosize";

import { useDispatch, useState } from "@/components/StateProvider";
import { ACTION_TYPES } from "@/clientSide/mainReducer";
import editEntry from "@/clientSide/editEntry";

function getDetails(entry) {
  if (entry === undefined) return <div className="placeholder">no entry selected</div>;

  return <>
    <table>
      <tbody>
        <tr>
          <td>id</td>
          <td><input
            type="text"
            name="id"
            value={entry.id}
            readOnly={true}
          /></td>
        </tr>
        <tr>
          <td>name</td>
          <td><TextareaAutosize
            key={entry.id}
            name="name"
            placeholder="name"
            autoComplete="off"
            defaultValue={entry.name}
          /></td>
        </tr>
      </tbody>
    </table>
    <button type="submit">submit</button>
  </>;
}

function handleSubmit(dispatch, entry, event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  editEntry({
    form: formData,
    isNew: entry === undefined, //TODO: adding new entries
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
  const state = useState();
  const entry = state.entries[state.selectedEntryId];

  return <div className="EntryDetails">
    <h2>entry details</h2>
    <form onSubmit={handleSubmit.bind(null, dispatch, entry)}>
      {getDetails(entry)}
    </form>
  </div>;
}
