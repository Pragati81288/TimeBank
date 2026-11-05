type HairStyle = 'short' | 'side' | 'long' | 'bob' | 'bun' | 'curly' | 'afro' | 'ponytail' | 'buzz';
type Accessory = 'none' | 'glasses' | 'earrings' | 'bow' | 'flower' | 'headphones' | 'beard' | 'beanie' | 'headband' | 'freckles';

interface AvatarSpec {
  bg: string;
  skin: string;
  hair: string;
  style: HairStyle;
  shirt: string;
  accessory: Accessory;
}

const INK = '#3b2f33';
const CHEEK = '#f29bb0';

const SPECS: AvatarSpec[] = [
  { bg: '#fde2e4', skin: '#f6d5b8', hair: '#2d2226', style: 'short', shirt: '#a7c7e7', accessory: 'none' },
  { bg: '#dbeafe', skin: '#e8b48f', hair: '#6b4226', style: 'long', shirt: '#f7a8b8', accessory: 'glasses' },
  { bg: '#fee2c8', skin: '#c68a5e', hair: '#2d2226', style: 'bun', shirt: '#9ed9b5', accessory: 'earrings' },
  { bg: '#d6f5e3', skin: '#8d5a3b', hair: '#2d2226', style: 'curly', shirt: '#f9c893', accessory: 'none' },
  { bg: '#fdf6e3', skin: '#f1c9a5', hair: '#e8b86d', style: 'bob', shirt: '#8fc1c4', accessory: 'bow' },
  { bg: '#fff3c4', skin: '#ffdcc2', hair: '#8f3d2b', style: 'side', shirt: '#f7a8b8', accessory: 'flower' },
  { bg: '#cfeefd', skin: '#c68a5e', hair: '#2d2226', style: 'buzz', shirt: '#f9c893', accessory: 'beanie' },
  { bg: '#fbd3d9', skin: '#e8b48f', hair: '#e8b86d', style: 'ponytail', shirt: '#a7c7e7', accessory: 'earrings' },
  { bg: '#d6f5e3', skin: '#8d5a3b', hair: '#2d2226', style: 'afro', shirt: '#f9c893', accessory: 'glasses' },
  { bg: '#fee2c8', skin: '#f6d5b8', hair: '#6b4226', style: 'short', shirt: '#8fc1c4', accessory: 'beard' },
  { bg: '#dbeafe', skin: '#c68a5e', hair: '#2d2226', style: 'long', shirt: '#f2a093', accessory: 'flower' },
  { bg: '#fdf6e3', skin: '#ffdcc2', hair: '#8f3d2b', style: 'curly', shirt: '#a7c7e7', accessory: 'headphones' },
  { bg: '#fff3c4', skin: '#c68a5e', hair: '#6b4226', style: 'side', shirt: '#9ed9b5', accessory: 'bow' },
  { bg: '#cfeefd', skin: '#8d5a3b', hair: '#2d2226', style: 'bun', shirt: '#f7a8b8', accessory: 'glasses' },
  { bg: '#fde2e4', skin: '#e8b48f', hair: '#e8b86d', style: 'bob', shirt: '#8fc1c4', accessory: 'beanie' },
  { bg: '#fdf6e3', skin: '#f6d5b8', hair: '#2d2226', style: 'ponytail', shirt: '#f9c893', accessory: 'freckles' },
];

export const AVATAR_IDS = Array.from({ length: SPECS.length }, (_, i) => `avatar-${String(i + 1).padStart(2, '0')}`);

function HairBack({ style, color }: { style: HairStyle; color: string }) {
  switch (style) {
    case 'long':
      return <path d="M32 52 Q32 20 60 20 Q88 20 88 52 L92 100 Q60 108 28 100 Z" fill={color} />;
    case 'bob':
      return <path d="M34 50 Q34 24 60 24 Q86 24 86 50 L88 76 Q60 82 32 76 Z" fill={color} />;
    case 'curly':
      return (
        <g fill={color}>
          <circle cx="36" cy="46" r="13" />
          <circle cx="84" cy="46" r="13" />
          <circle cx="60" cy="26" r="16" />
          <circle cx="42" cy="30" r="12" />
          <circle cx="78" cy="30" r="12" />
        </g>
      );
    case 'afro':
      return <circle cx="60" cy="46" r="36" fill={color} />;
    case 'ponytail':
      return <ellipse cx="88" cy="58" rx="9" ry="20" fill={color} />;
    case 'bun':
      return <circle cx="60" cy="18" r="10" fill={color} />;
    default:
      return null;
  }
}

function HairFront({ style, color }: { style: HairStyle; color: string }) {
  switch (style) {
    case 'buzz':
      return <path d="M38 46 Q40 34 60 33 Q80 34 82 46 Q70 39 60 39 Q50 39 38 46 Z" fill={color} />;
    case 'side':
      return <path d="M34 54 Q32 26 62 26 Q86 28 86 54 Q76 38 52 42 Q40 46 34 54 Z" fill={color} />;
    case 'long':
    case 'bob':
      return <path d="M34 50 Q36 28 60 28 Q84 28 86 50 Q74 38 60 38 Q46 38 34 50 Z" fill={color} />;
    case 'afro':
      return null;
    default:
      return <path d="M36 52 Q36 28 60 28 Q84 28 84 52 Q76 40 60 40 Q44 40 36 52 Z" fill={color} />;
  }
}

function Beard({ color }: { color: string }) {
  return <path d="M42 66 Q44 84 60 86 Q76 84 78 66 Q72 76 60 77 Q48 76 42 66 Z" fill={color} />;
}

function Accessories({ kind }: { kind: Accessory }) {
  switch (kind) {
    case 'glasses':
      return (
        <g fill="none" stroke={INK} strokeWidth="2">
          <circle cx="50" cy="56" r="7.5" />
          <circle cx="70" cy="56" r="7.5" />
          <path d="M57.5 56 H62.5" />
        </g>
      );
    case 'earrings':
      return (
        <g fill="#f5c76b">
          <circle cx="36" cy="66" r="2.6" />
          <circle cx="84" cy="66" r="2.6" />
        </g>
      );
    case 'bow':
      return (
        <g fill="#f08aa0">
          <path d="M70 28 L80 22 L80 34 Z" />
          <path d="M90 28 L80 22 L80 34 Z" />
          <circle cx="80" cy="28" r="2.5" fill="#e2708a" />
        </g>
      );
    case 'flower':
      return (
        <g>
          <circle cx="84" cy="28" r="4" fill="#fbd3e0" />
          <circle cx="90" cy="34" r="4" fill="#fbd3e0" />
          <circle cx="84" cy="40" r="4" fill="#fbd3e0" />
          <circle cx="78" cy="34" r="4" fill="#fbd3e0" />
          <circle cx="84" cy="34" r="3" fill="#ffd166" />
        </g>
      );
    case 'headphones':
      return (
        <g fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round">
          <path d="M34 58 Q34 26 60 26 Q86 26 86 58" />
          <rect x="30" y="54" width="8" height="14" rx="4" fill={INK} stroke="none" />
          <rect x="82" y="54" width="8" height="14" rx="4" fill={INK} stroke="none" />
        </g>
      );
    case 'beanie':
      return (
        <g>
          <path d="M33 46 Q33 20 60 20 Q87 20 87 46 Z" fill="#f08a9a" />
          <rect x="31" y="42" width="58" height="8" rx="4" fill="#e0707f" />
        </g>
      );
    case 'headband':
      return <path d="M36 42 Q60 30 84 42" fill="none" stroke="#7fb7be" strokeWidth="4" strokeLinecap="round" />;
    case 'freckles':
      return (
        <g fill="#b9733f" opacity="0.5">
          <circle cx="50" cy="63" r="1.2" />
          <circle cx="55" cy="65" r="1.2" />
          <circle cx="65" cy="65" r="1.2" />
          <circle cx="70" cy="63" r="1.2" />
        </g>
      );
    default:
      return null;
  }
}

interface AvatarProps {
  avatarId?: string | null;
  size?: number;
  className?: string;
}

export function Avatar({ avatarId, size = 48, className = '' }: AvatarProps) {
  const index = AVATAR_IDS.indexOf(avatarId ?? '');
  const spec = SPECS[index >= 0 ? index : 0];

  return (
    <div
      role="img"
      aria-label="Profile avatar"
      className={`shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <circle cx="60" cy="60" r="60" fill={spec.bg} />
        <path d="M18 120 C18 92 36 84 60 84 C84 84 102 92 102 120 Z" fill={spec.shirt} />
        <rect x="52" y="70" width="16" height="18" rx="6" fill={spec.skin} />
        <HairBack style={spec.style} color={spec.hair} />
        <ellipse cx="60" cy="54" rx="24" ry="27" fill={spec.skin} />
        <circle cx="36" cy="56" r="5" fill={spec.skin} />
        <circle cx="84" cy="56" r="5" fill={spec.skin} />
        <HairFront style={spec.style} color={spec.hair} />
        {spec.accessory === 'beard' && <Beard color={spec.hair} />}
        <circle cx="50" cy="56" r="2.8" fill={INK} />
        <circle cx="70" cy="56" r="2.8" fill={INK} />
        <circle cx="44" cy="66" r="4" fill={CHEEK} opacity="0.55" />
        <circle cx="76" cy="66" r="4" fill={CHEEK} opacity="0.55" />
        <path d="M53 66 Q60 72 67 66" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <Accessories kind={spec.accessory} />
      </svg>
    </div>
  );
}
