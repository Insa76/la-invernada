export const getFavorites = () => {
  const data = localStorage.getItem("favorites");
  return data ? JSON.parse(data) : [];
};

export const toggleFavorite = (animal) => {
  const favorites = getFavorites();

  const exists = favorites.find((f) => f.id === animal.id);

  let updated;

  if (exists) {
    updated = favorites.filter((f) => f.id !== animal.id);
  } else {
    updated = [...favorites, animal];
  }

  localStorage.setItem("favorites", JSON.stringify(updated));
  return updated;
};

export const isFavorite = (id) => {
  const favorites = getFavorites();
  return favorites.some((f) => f.id === id);
};