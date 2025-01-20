import { MeshBasicMaterial } from "three";
import bookSource from "../../BookSource";
import Page from "./Page";
import { useRecoilState } from "recoil";
import pageState from "../../recoil/pageState";
import { useEffect, useState } from "react";
import pageImage from "&/page.png";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import FrontCover from "./FrontCover";
import BackCover from "./BackCover";

const Book = ({ ...props }) => {
  const [page] = useRecoilState(pageState);
  const [delayedPage, setDelayedPage] = useState(page);

  const pageTexture = useTexture(pageImage);
  pageTexture.colorSpace = THREE.SRGBColorSpace;
  pageTexture.minFilter = THREE.LinearFilter;
  pageTexture.magFilter = THREE.NearestFilter;

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
    <group scale={1.5} {...props} rotation-y={-Math.PI / 2}>
      <FrontCover page={delayedPage} opened={page !== 0} />
      {bookSource.map((data, index) => {
        return (
          <Page
            key={index}
            page={delayedPage}
            opened={delayedPage > index}
            number={index}
            bookClosed={delayedPage === 0 || delayedPage === bookSource.length}
            data={data}
            pageTexture={pageTexture}
          />
        );
      })}
      <BackCover
        page={delayedPage}
        bookClosed={delayedPage === 0 || delayedPage === bookSource.length}
        opened={delayedPage > 100}
        number={100}
      />
    </group>
  );
};

export default Book;
