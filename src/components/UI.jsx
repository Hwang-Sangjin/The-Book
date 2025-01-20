import { useRecoilState } from "recoil";
import pageState from "../recoil/pageState";
import bookSource from "../BookSource";

const UI = () => {
  const bookSrc = bookSource;
  const [page, setPage] = useRecoilState(pageState);

  const changePage = () => {
    const temp = Math.floor(Math.random() * bookSrc.length);
    setPage(temp);
  };

  return (
    <div className="absolute flex bottom-56 w-full justify-center">
      <button className="m-auto" onClick={changePage}>
        Button
      </button>
    </div>
  );
};

export default UI;
