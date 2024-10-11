import { isEmpty } from "lodash";

import { useState } from "@/components/StateProvider";

export default function EntryDetails() {
  const state = useState();

  const details = <>details go here</>;

  return <div className="EntryDetails">
    <h2>entry details</h2>
    {isEmpty(state.selectedEntry) ? <div className="placeholder">no entry selected</div> : details}
  </div>;
}
