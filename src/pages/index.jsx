import MainView from "@/components/MainView";
import StateProvider from "@/components/StateProvider";

export default function Home() {
  return (
    <main className="main">
      <StateProvider >
        <MainView />
      </StateProvider>
    </main>
  );
}
