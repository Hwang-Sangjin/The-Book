import { RecoilRoot } from "recoil";
import "./App.css";
import Experience from "./components/Experience";
import UI from "./components/UI";
import Footer from "./components/Footer";
import { Loader } from "./components/Loader/Loader";

function App() {
  return (
    <RecoilRoot>
      <Loader />
      <Experience />
      <UI />
      <Footer />
    </RecoilRoot>
  );
}

export default App;
