import type { HexTagType, IHex } from 'src/interfaces';

// Веса для разных типов (можно настроить по желанию)
const TAG_WEIGHTS: Record<HexTagType, number> = {
  meadow: 30, // Самый частый
  hill: 20,
  river: 15,
  swamp: 10,
  mountain: 10,
  fog: 0,
  ocean: 5, // Самый редкий
};

// Функция для получения случайного тега с учетом весов
const getRandomTag = (): HexTagType => {
  const totalWeight = Object.values(TAG_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  const random = Math.random() * totalWeight;

  let weightSum = 0;
  for (const [tag, weight] of Object.entries(TAG_WEIGHTS)) {
    weightSum += weight;
    if (random <= weightSum) {
      return tag as HexTagType;
    }
  }

  return 'meadow'; // fallback
};

// Основная функция для наполнения тегами
export const fillHexsWithRandomTags = (hexs: Record<string, IHex>): Record<string, IHex> => {
  const updatedHexs: Record<string, IHex> = {};

  Object.entries(hexs).forEach(([id, hex]) => {
    updatedHexs[id] = {
      ...hex,
      tag: getRandomTag(),
    };
  });

  return updatedHexs;
};
