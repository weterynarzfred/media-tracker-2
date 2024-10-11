import EntryDetails from "@/components/EntryDetails";
import EntryList from "@/components/EntryList";
import { useTrackedState } from "@/components/StateProvider";

export default function MainView() {
  const state = useTrackedState();

  if (!state.isLoaded) return <div className="loader">loading</div>;

  return <div className="MainView">
    <EntryList />
    <EntryDetails />
  </div>;
}
