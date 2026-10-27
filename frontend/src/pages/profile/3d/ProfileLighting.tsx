import React from 'react';

interface ProfileLightingProps {
  careerName?: string;
}

export const ProfileLighting: React.FC<ProfileLightingProps> = ({ careerName }) => {
  return (
    <>
      {/* Deep atmospheric ambient fill */}
      <ambientLight intensity={0.65} color="#1E1B4B" />

      {/* Main Key Light (Front-Right) with Soft Shadow */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.4}
        color="#F8FAFC"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-1}
        shadow-bias={-0.0005}
      />

      {/* Electric Cyan Rim Light (Back-Left) for Character Silhouetting */}
      <spotLight
        position={[-3.5, 4, -2.5]}
        intensity={2.8}
        color="#38BDF8"
        angle={0.6}
        penumbra={0.8}
      />

      {/* Purple Accent Light (Back-Right) */}
      <spotLight
        position={[3.5, 3.5, -2]}
        intensity={2.2}
        color="#A855F7"
        angle={0.6}
        penumbra={0.9}
      />

      {/* Warm Floor Bounce / Fill Light for Footwear & Shadow Detail */}
      <pointLight position={[0, 0.4, 1.8]} intensity={0.5} color="#F59E0B" distance={4} />

      {/* Soft Top Down Neon Gantry Overhead Light */}
      <pointLight position={[0, 4.2, 0]} intensity={1.0} color="#818CF8" distance={6} />
    </>
  );
};
