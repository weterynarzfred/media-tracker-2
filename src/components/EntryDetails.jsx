import TextareaAutosize from "react-textarea-autosize";

import { useDispatch, useTrackedState } from "@/components/StateProvider";
import { ACTION_TYPES } from "@/clientSide/mainReducer";
import editEntry from "@/clientSide/editEntry";
import FIELDS from "@/lib/fields";

function getDetails(entry) {
  const inputRows = FIELDS.map(field => {
    let input = null;
    if (field.type === 'text') {
      input = <input
        key={entry?.id}
        type="text"
        name={field.name}
        placeholder={field.name}
        defaultValue={entry?.[field.name]}
      />;
    } else if (field.type === 'textarea') {
      input = <TextareaAutosize
        key={entry?.id}
        name={field.name}
        placeholder={field.name}
        autoComplete="off"
        defaultValue={entry?.[field.name]}
      />;
    }

    return <tr key={field.name}>
      <td>{field.name}</td>
      <td>{input}</td>
    </tr>;
  });

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
        {inputRows}
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
