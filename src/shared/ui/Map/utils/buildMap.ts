import type { ICreateMapArgs } from '../hooks/useCreateMap';

export interface IBuildHexReturn {
  x: number;
  y: number;
  rowIndex: number;
  columnIndex: number;
}

export interface IBuildMapReturn {
  rows: number;
  columns: number;
  polygons: IBuildHexReturn[];
}

export const buildMap = ({ height, radius, width }: ICreateMapArgs): IBuildMapReturn => {
  const result: IBuildMapReturn = {
    rows: 0,
    columns: 0,
    polygons: [],
  };

  if (!height || !width || !radius) return result;

  const hexWidth = Math.sqrt(3) * radius;
  const hexHeight = radius * 2;

  const verticalSpacing = hexHeight * 0.75; // 3/4 высоты для правильного смещения
  const shiftX = hexWidth / 2; // Корректировка общей ширины при смещении чётного ряда
  const shiftY = radius / 2; // Корректировка общей высоты при смещении чётного ряда

  const rowsX = Math.floor((width - shiftX) / hexWidth);
  const columnsY = Math.floor((height - shiftY) / verticalSpacing);

  for (let col = 0; col < columnsY; col++) {
    const isEvenRow = col % 2 === 0;
    const offsetX = isEvenRow ? 0 : hexWidth / 2;

    for (let row = 0; row < rowsX; row++) {
      const x = offsetX + row * hexWidth;
      const y = col * verticalSpacing;

      result.polygons.push({
        x: x + radius, // Радиус для отступов от краёв
        y: y + radius, // Радиус для отступов от краёв
        rowIndex: row,
        columnIndex: col,
      });
    }
  }

  return result;
};
