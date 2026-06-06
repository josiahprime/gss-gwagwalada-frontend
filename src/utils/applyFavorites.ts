// Generic function for any array of items with `id: string`
export const applyFavorites = <T extends { id: string }>(
  list: T[] | null | undefined,
  favoriteIds: string[]
): T[] => {
  if (!Array.isArray(list)) return [];
  return list.map(item => ({
    ...item,
    isFavorite: favoriteIds.includes(item.id),
  }));
};
