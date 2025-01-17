import { MeshBasicMaterial } from "three";
import bookSource from "../../BookSource";
import Page from "./Page";
import { useRecoilState } from "recoil";
import pageState from "../../recoil/pageState";
import { useEffect, useState } from "react";

const Book = ({ ...props }) => {
  const [page] = useRecoilState(pageState);
  const [delayedPage, setDelayedPage] = useState(page);

  useEffect(() => {
    let timeout;
    const goToPage = () => {
      setDelayedPage((delayedPage) => {
        if (page === delayedPage) {
          return delayedPage;
        } else {
          timeout = setTimeout(
            () => {
              goToPage();
            },
            Math.abs(page - delayedPage) > 2 ? 35 : 150
          );
          if (page > delayedPage) {
            return delayedPage + 1;
          }
          if (page < delayedPage) {
            return delayedPage - 1;
          }
        }
      });
    };
    goToPage();
    return () => {
      clearTimeout(timeout);
    };
  }, [page]);

  return (
    <group {...props} rotation-y={-Math.PI / 2}>
      {bookSource.map((data, index) => {
        return (
          <Page
            key={index}
            page={delayedPage}
            opened={delayedPage > index}
            number={index}
            bookClosed={delayedPage === 0 || delayedPage === bookSource.length}
            data={data}
          />
        );
      })}
    </group>
  );
};

export default Book;
