import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ExpenseCategory } from '../data/types';

export function CategoryIcon({
  category,
  size = 18,
  color = 'white',
}: {
  category: ExpenseCategory;
  size?: number;
  color?: string;
}) {
  const name: keyof typeof MaterialCommunityIcons.glyphMap =
    category === 'Food'
      ? 'food'
      : category === 'Transport'
        ? 'car'
        : category === 'Utilities'
          ? 'flash'
          : category === 'Entertainment'
            ? 'movie'
            : category === 'Shopping'
              ? 'cart'
              : category === 'Travel'
                ? 'airplane'
                : 'shape';

  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}

