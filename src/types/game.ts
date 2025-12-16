import { IconType } from 'react-icons';
import { FaPaw, FaDragon, FaFire } from 'react-icons/fa';

export type GameType = 'pokemon' | 'yugioh' | 'duelmasters';

export interface GameInfo {
  id: GameType;
  name: string;
  path: string;
  colorScheme: string;
  description: string;
  icon: IconType;
}

export const GAMES: Record<GameType, GameInfo> = {
  pokemon: {
    id: 'pokemon',
    name: 'ポケモンカード',
    path: '/pokemon',
    colorScheme: 'red',
    description: 'ポケモンカードゲームのデッキ構築',
    icon: FaPaw,
  },
  yugioh: {
    id: 'yugioh',
    name: '遊戯王',
    path: '/yugioh',
    colorScheme: 'blue',
    description: '遊戯王のデッキ構築',
    icon: FaDragon,
  },
  duelmasters: {
    id: 'duelmasters',
    name: 'デュエル・マスターズ',
    path: '/duelmasters',
    colorScheme: 'purple',
    description: 'デュエル・マスターズのデッキ構築',
    icon: FaFire,
  },
} as const;
