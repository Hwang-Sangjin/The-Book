import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Helper, useGLTF, useHelper } from "@react-three/drei";

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

function FrontGlb({ page, opened, number, bookClosed }) {
  const meshRef = useRef();
  const skeletonRef = useRef();
  const [geometry, setGeometry] = useState();
  const { nodes, materials } = useGLTF("/cover4.glb");
  const groupRef = useRef();

  useEffect(() => {
    // Create bone

    const bones = [];

    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      let bone = new THREE.Bone();
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

    // Create a skeleton
    const skeleton = new THREE.Skeleton(bones);

    // Attach skeleton to the SkinnedMesh
    const skinnedMesh = meshRef.current;
    skinnedMesh.add(bones[0]);
    skinnedMesh.bind(skeleton);

    // Store skeleton reference for animation
    skeletonRef.current = { bones };
  }, []);

  useEffect(() => {
    let temp = nodes.Cube001_2.geometry;
    temp.translate(PAGE_WIDTH / 2, 0, 0);

    const position = temp.attributes.position;
    const vertex = new THREE.Vector3();
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

    temp.setAttribute(
      "skinIndex",
      new THREE.Uint16BufferAttribute(skinIndexes, 4)
    );
    temp.setAttribute(
      "skinWeight",
      new THREE.Float32BufferAttribute(skinWeights, 4)
    );

    setGeometry(temp);
  }, [nodes]);

  useFrame(() => {
    if (!skeletonRef.current || !meshRef.current) return;

    const bones = skeletonRef.current.bones;
    const rootBone = bones[0]; // Assuming the root bone influences the main position and rotation

    // Animate the bones
    const targetRotation = opened ? (-Math.PI * 29) / 70 : Math.PI / 2;
    rootBone.rotation.y = THREE.MathUtils.lerp(
      rootBone.rotation.y,
      targetRotation,
      opened ? lerpFactorOpen : lerpFactor
    );

    // Calculate world transformations
    rootBone.updateMatrixWorld(true);
    const worldPosition = new THREE.Vector3();
    const worldQuaternion = new THREE.Quaternion();
    const correctionQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, Math.PI / 2, 0) // Adjust as needed
    );

    rootBone.getWorldPosition(worldPosition);
    rootBone.getWorldQuaternion(worldQuaternion);

    // Apply correction offset to align rotations properly
    worldQuaternion.multiply(correctionQuaternion);

    // Update groupRef
    if (groupRef.current) {
      groupRef.current.position.copy(worldPosition);
      groupRef.current.quaternion.copy(worldQuaternion);
    }
  });

  return (
    <group>
      <skinnedMesh
        ref={meshRef}
        position-z={(page - number) * 0.003}
        geometry={geometry} // Use geometry from your model
        material={materials.Material} // Use material from your model
      />
      <group ref={groupRef}>
        {/* Regular Mesh (Second Part) */}
        <mesh
          geometry={nodes.Cube001_1.geometry}
          material={materials["Material.001"]}
          position={[PAGE_WIDTH / 2, 0, 0]} // Adjust position to align
        />
      </group>
    </group>
  );
}

export default FrontGlb;
