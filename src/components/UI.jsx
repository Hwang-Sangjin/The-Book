import { useRecoilState } from "recoil";
import pageState from "../recoil/pageState";
import bookSource from "../BookSource";
import { useEffect, useRef, useState } from "react";
import AudioSource from "../AudioSource";
import openState from "../recoil/openState";

const UI = () => {
  const bookSrc = bookSource;
  const audioSrc = AudioSource;
  const audioRef = useRef();
  const [page, setPage] = useRecoilState(pageState);
  const [audioIndex, setAudioIndex] = useState(-1);
  const [audioState, setAudioState] = useState(true);
  const [pageOpen, setPageOpen] = useRecoilState(openState);

  const changePage = () => {
    const temp = Math.floor(Math.random() * bookSrc.length);
    setPage(temp);

    const randomIndex = Math.floor(Math.random() * audioSrc.length);
    setAudioIndex(randomIndex);
    setAudioState((prev) => !prev);

    setPageOpen(true);
  };

  useEffect(() => {
    if (audioIndex !== -1) {
      audioRef.current.play();
    }
  }, [audioState]);

  return (
    <div className="absolute flex bottom-40 w-full justify-center">
      <button
        className="m-auto font-Danjo text-gray-300 text-3xl bg-black p-5 rounded-3xl"
        onClick={changePage}
      >
        책님!
      </button>
      <audio ref={audioRef} src={audioSrc[audioIndex]} />
    </div>
  );
};

export default UI;
