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
import Cover from "./Cover";

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
      <FrontCover
        page={delayedPage}
        number={0}
        opened={page !== 0}
        bookClosed={delayedPage === 0 || delayedPage === bookSource.length}
      />
      <BackCover
        page={delayedPage}
        opened={delayedPage > 98}
        number={98}
        bookClosed={delayedPage === 0 || delayedPage === bookSource.length}
      />
      <Cover
        page={delayedPage}
        opened={delayedPage > 0}
        number={50}
        bookClosed={delayedPage === 0 || delayedPage === bookSource.length}
      />
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
    </group>
  );
};

export default Book;
