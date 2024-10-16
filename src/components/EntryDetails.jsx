import TextareaAutosize from "react-textarea-autosize";
import CreatableSelect from 'react-select/creatable';
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";

import { useDispatch, useTrackedState } from "@/components/StateProvider";
import { ACTION_TYPES } from "@/clientSide/mainReducer";
import editEntry from "@/clientSide/editEntry";
import FIELDS from "@/lib/fields";
import selectStyles from "@/clientSide/selectStyles";
import deleteEntry from "@/clientSide/deleteEntry";

function getDetails({
  entry,
  optionHints,
  dispatch,
  isDeleteOpen,
  setIsDeleteOpen,
}) {
  const inputRows = FIELDS.map(field => {
    let input = null;
    if (field.type === 'text') {
      input = <input
        key={entry?.id}
        type="text"
        name={field.name}
        placeholder={field.name}
        autoComplete="off"
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
    } else if (field.type === 'hinted') {
      const options = optionHints[field.name]?.map(value => ({ value, label: value })) ?? [];
      const option = isEmpty(entry?.[field.name]) ? undefined : { value: entry[field.name], label: entry[field.name] };
      input = <CreatableSelect
        key={entry?.id}
        name={field.name}
        placeholder=""
        options={options}
        defaultValue={option}
        isClearable={true}
        isSearchable={true}
        className='select'
        classNamePrefix='select'
        styles={selectStyles}
        noOptionsMessage={() => `start typing to create new ${field.name}`}
      />;
    }

    return <tr key={field.name}>
      <td>{field.name}</td>
      <td>{input}</td>
    </tr>;
  });

  return <>
    <table className="EntryDetails__table">
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

    <div className="EntryDetails__buttons">
      {entry === undefined ?
        null :
        <button
          className="button button--delete-entry button--danger"
          onClick={event => {
            event.preventDefault();
            setIsDeleteOpen(true);
          }}
          disabled={isDeleteOpen}
        >
          delete
        </button>
      }
      <button type="submit" className="button button--edit-entry">
        {entry === undefined ? "add" : "save"}
      </button>
    </div>

    {isDeleteOpen ? <div className="EntryDetails__delete">
      are you sure you want to delete?
      <div className="EntryDetails__delete-buttons">
        <button
          className="button button--delete-entry-confirm button--danger"
          onClick={handleDelete.bind(null, dispatch, entry)}
        >delete</button>
        <button
          className="button button--delete-entry-cancel"
          onClick={() => setIsDeleteOpen(false)}
        >cancel</button>
      </div>
    </div> : null}
  </>;
}

function handleDelete(dispatch, entry, event) {
  event.preventDefault();

  deleteEntry({
    entry,
    callback: data => {
      dispatch({
        type: ACTION_TYPES.DELETE_ENTRY,
        payload: { entryId: entry.id },
      });
    },
  });
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const entry = state.entries[state.selectedEntryId];
  useEffect(() => setIsDeleteOpen(false), [entry]);

  return <div className="EntryDetails">
    <form onSubmit={handleSubmit.bind(null, dispatch, entry)}>
      {getDetails({
        entry,
        optionHints: state.optionHints,
        dispatch,
        isDeleteOpen,
        setIsDeleteOpen,
      })}
    </form>
  </div>;
}
