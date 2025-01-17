import { AmbientLight } from "three";
import Book from "./Book/Book";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const Experience = () => {
  return (
    <Canvas>
      <ambientLight intensity={3} />
      <OrbitControls />
      <Book />
    </Canvas>
  );
};

export default Experience;
