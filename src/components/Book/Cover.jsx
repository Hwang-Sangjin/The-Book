import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils } from "three";

const Cover = ({ page, opened, number, bookClosed }) => {
  const coverRef = useRef();
  useFrame(() => {
    if (!coverRef.current) return;

    if (opened) {
      coverRef.current.rotation.y = MathUtils.lerp(
        coverRef.current.rotation.y,
        0,
        0.015
      );
      coverRef.current.position.x = MathUtils.lerp(
        coverRef.current.position.x,
        0,
        0.015
      );
    } else {
      coverRef.current.position.x = MathUtils.lerp(
        coverRef.current.position.x,
        -0.15,
        0.015
      );
      coverRef.current.position.z = MathUtils.lerp(
        coverRef.current.position.z,
        0.01,
        0.015
      );
    }
  });

  return (
    <mesh
      rotation={[0, Math.PI / 2, 0]}
      ref={coverRef}
      position-z={(page - number) * 0.003}
    >
      <boxGeometry args={[0.05, 1.8, 0.34]} />
      <meshStandardMaterial color={"black"} />
    </mesh>
  );
};

export default Cover;
