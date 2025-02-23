// components/BearAvatar.tsx
import { memo } from 'react';
import '../styles/BearAvatar.css';

interface BearAvatarProps {
  currentImage: string;
  size?: number;
}

const BearAvatar = memo(function BearAvatar({ currentImage, size = 220 }: BearAvatarProps) {
  return (
    <img 
      src={currentImage} 
      className="bear-avatar"
      width={size}
      height={size}
      alt="Animated bear avatar"
    />
  );
});


export default BearAvatar;
