import { AmbientLight } from "three";
import Book from "./Book/Book";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";

const Experience = () => {
  return (
    <Canvas>
      <ambientLight intensity={1} />
      <Environment preset="studio"></Environment>
      <directionalLight
        position={[2, 5, 2]}
        intensity={0.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <OrbitControls />
      <Book />
    </Canvas>
  );
};

export default Experience;
