import React from 'react';

interface ProfileLightingProps {
  careerName?: string;
}

export const ProfileLighting: React.FC<ProfileLightingProps> = ({ careerName }) => {
  return (
    <>
      {/* 1. Balanced Ambient Fill - Keeps Face, Eyes, Skin & Clothing Clearly Visible */}
      <ambientLight intensity={0.8} color="#F1F5F9" />

      {/* 2. Main Key Light (Front-Right Sunlight) with Crisp Soft Shadows */}
      <directionalLight
        position={[3, 6, 4]}
        intensity={1.8}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-0.5}
        shadow-bias={-0.0004}
      />

      {/* 3. Warm Fill Light (Front-Left) for Natural Human Skin Undertones */}
      <directionalLight
        position={[-3, 4, 3]}
        intensity={0.65}
        color="#FEF08A"
      />

      {/* 4. Electric Cyan Rim Light (Back-Left) - Signature BGMI Silhouette Separation */}
      <spotLight
        position={[-4, 5, -3]}
        intensity={3.5}
        color="#38BDF8"
        angle={0.65}
        penumbra={0.7}
        distance={14}
      />

      {/* 5. Neon Purple Accent Light (Back-Right) */}
      <spotLight
        position={[4, 4.5, -2.5]}
        intensity={2.8}
        color="#A855F7"
        angle={0.65}
        penumbra={0.8}
        distance={14}
      />

      {/* 6. Ground Bounce Light - Illuminates Boots, Cargo Trousers & Floor Contact */}
      <pointLight position={[0, 0.35, 1.8]} intensity={0.7} color="#FBBF24" distance={4.5} />

      {/* 7. Overhead Gantry Spotlight - Accents Safety Hard Hat & Shoulders */}
      <pointLight position={[0, 4.8, 0]} intensity={1.2} color="#C7D2FE" distance={7} />
    </>
  );
};
