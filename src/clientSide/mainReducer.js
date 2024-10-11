const ACTION_TYPES = {
  INIT: 'INIT',
};

const actions = {
  INIT: (state, action) => {
    Object.assign(state, action.data);
    state.isLoaded = true;
  },
};

export default function mainReducer(state, action) {
  if (actions[action.type] === undefined) {
    console.error(`unknown action type: ${action.type}`);
    return;
  }

  console.log(action.type, action.data);
  actions[action.type](state, action);
}

export { ACTION_TYPES };
