import { RecoilRoot } from "recoil";
import "./App.css";
import Experience from "./components/Experience";
import UI from "./components/UI";

function App() {
  return (
    <RecoilRoot>
      <Experience />
      <UI />
    </RecoilRoot>
  );
}

export default App;
