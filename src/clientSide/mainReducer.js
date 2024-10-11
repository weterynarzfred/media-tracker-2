const ACTION_TYPES = {
  INIT: 'INIT',
  SELECT_ENTRY: 'SELECT_ENTRY',
  EDIT_ENTRY: 'EDIT_ENTRY',
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
  },
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
