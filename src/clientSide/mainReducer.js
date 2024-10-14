import { isEmpty } from "lodash";

import FIELDS from "@/lib/fields";

const ACTION_TYPES = {
  INIT: 'INIT',
  SELECT_ENTRY: 'SELECT_ENTRY',
  EDIT_ENTRY: 'EDIT_ENTRY',
  DELETE_ENTRY: 'DELETE_ENTRY',
};

const actions = {
  INIT: (state, action) => {
    Object.assign(state, action.payload);
    state.isLoaded = true;
  },
  SELECT_ENTRY: (state, action) => {
    state.selectedEntryId = action.payload.entryId;
  },
  EDIT_ENTRY: (state, action) => {
    state.entries[action.payload.entry.id] = action.payload.entry;

    for (const field of FIELDS.filter(e => e.type === 'hinted')) {
      if (isEmpty(action.payload.entry[field.name])) continue;

      if (state.optionHints[field.name] === undefined)
        state.optionHints[field.name] = [];
      if (!state.optionHints[field.name].includes(action.payload.entry[field.name]))
        state.optionHints[field.name].push(action.payload.entry[field.name]);
    }

    state.selectedEntryId = action.payload.entry.id;
  },
  DELETE_ENTRY: (state, action) => {
    delete state.entries[action.payload.entryId];
    state.selectedEntryId = -1;
  }
};

export default function mainReducer(state, action) {
  if (actions[action.type] === undefined) {
    console.error(`unknown action type: ${action.type}`);
    return;
  }

  console.log(action.type, action.payload);
  actions[action.type](state, action);
}

export { ACTION_TYPES };
