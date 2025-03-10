import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useMemo, useRef } from "react";
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import frontImage from "&/front.png";
import * as THREE from "three";

const PAGE_WIDTH = 1.3;
const PAGE_HEIGHT = 1.8; // 4:3 aspect ratio
const PAGE_DEPTH = 0.05;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;
const easingFactor = 0.5;
const insideCurveStrength = 0.17;
const outsideCurveStrength = 0.03;
const turningCurveStrength = 0.09;
const easingFactorFold = 0.3;

const lerpFactor = 0.014;
const lerpFactorOpen = 0.023;

const redColor = new Color("#74271a");
const standardColor = new Color("#efcec1");
const pageMaterials = [
  new MeshStandardMaterial({
    color: redColor,
  }),
  new MeshStandardMaterial({
    color: "#111",
  }),
  new MeshStandardMaterial({
    color: redColor,
  }),
  new MeshStandardMaterial({
    color: redColor,
  }),
];

const coverGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);
coverGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const position = coverGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i);
  const x = vertex.x;
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
  let skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0); // set the skin weights
}

coverGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4)
);
coverGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4)
);

const FrontCover = ({ page, opened, number, bookClosed }) => {
  const group = useRef();
  const turnedAt = useRef(0);
  const skinnedMeshRef = useRef();

  const FrontCover = useTexture(frontImage);
  FrontCover.colorSpace = THREE.SRGBColorSpace;
  FrontCover.minFilter = THREE.LinearFilter;
  FrontCover.magFilter = THREE.NearestFilter;

  const manualSkinnedMesh = useMemo(() => {
    const bones = [];

    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      let bone = new Bone();
      bones.push(bone);

      if (i === 0) {
        bone.position.x = 0;
      } else {
        bone.position.x = SEGMENT_WIDTH;
      }
      if (i > 0) {
        bones[i - 1].add(bone);
      }
    }

    const skeleton = new Skeleton(bones);

    const materials = [
      ...pageMaterials,
      new MeshStandardMaterial({
        color: standardColor,
        map: FrontCover,
      }),
      new MeshStandardMaterial({
        color: redColor,
      }),
    ];
    const mesh = new SkinnedMesh(coverGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, []);

  useFrame(() => {
    if (!skinnedMeshRef.current) return;

    let targetRotation = opened ? (-Math.PI * 29) / 70 : Math.PI / 2;

    const bones = skinnedMeshRef.current.skeleton.bones;
    bones[0].rotation.y = MathUtils.lerp(
      bones[0].rotation.y,
      targetRotation,
      opened ? lerpFactorOpen : lerpFactor
    );
  });

  return (
    <group ref={group}>
      <primitive
        position-z={(page - number) * 0.003}
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
      />
    </group>
  );
};

export default FrontCover;
