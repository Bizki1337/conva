import type { IHex } from 'src/interfaces';

const evenColumnShifts = [
  {
    // Левый гексагон
    row: -1,
    column: 0,
  },
  {
    // Левый верхний гексагон
    row: -1,
    column: -1,
  },
  {
    // Правый верхний гексагон
    row: 0,
    column: -1,
  },
  {
    // Правый гексагон
    row: +1,
    column: 0,
  },
  {
    // Правый нижний гексагон
    row: 0,
    column: +1,
  },
  {
    // Левый нижний гексагон
    row: -1,
    column: +1,
  },
];

const oddColumnShifts = [
  {
    // Левый гексагон
    row: -1,
    column: 0,
  },
  {
    // Левый верхний гексагон
    row: 0,
    column: -1,
  },
  {
    // Правый верхний гексагон
    row: +1,
    column: -1,
  },
  {
    // Правый гексагон
    row: +1,
    column: 0,
  },
  {
    // Правый нижний гексагон
    row: +1,
    column: +1,
  },
  {
    // Левый нижний гексагон
    row: 0,
    column: +1,
  },
];

export const exploreHexs = (hexs: Record<string, IHex>, id: number): Record<string, IHex> => {
  const nextHexs = structuredClone(hexs);
  const currentHex = hexs[id];
  if (!currentHex || currentHex.hiddenByClouds) return nextHexs;

  const isEven = currentHex.columnIndex % 2 === 0;
  const nextShifts = isEven ? [...evenColumnShifts] : [...oddColumnShifts];

  nextShifts.forEach((shift) => {
    const targetRow = currentHex.rowIndex + shift.row;
    const targetColumn = currentHex.columnIndex + shift.column;

    const neighborHex = Object.values(hexs).find(
      (hex) => hex.rowIndex === targetRow && hex.columnIndex === targetColumn,
    );

    if (!neighborHex) return;

    nextHexs[neighborHex.id].hiddenByClouds = false;
  });

  return nextHexs;
};
