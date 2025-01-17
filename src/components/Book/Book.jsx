import { MeshBasicMaterial } from "three";
import bookSource from "../../BookSource";
import Page from "./Page";

const Book = ({ ...props }) => {
  return (
    <group {...props}>
      {bookSource.map((data, index) => {
        return index === 0 ? (
          <Page key={index} number={index} data={data} />
        ) : null;
      })}
    </group>
  );
};

export default Book;
