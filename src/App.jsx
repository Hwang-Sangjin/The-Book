import { RecoilRoot } from "recoil";
import "./App.css";
import Experience from "./components/Experience";
import UI from "./components/UI";
import Footer from "./components/Footer";

function App() {
  return (
    <RecoilRoot>
      <Experience />
      <UI />
      <Footer />
    </RecoilRoot>
  );
}

export default App;
