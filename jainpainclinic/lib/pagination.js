export function getTotalPages(totalItems, itemsPerPage) {
  return Math.max(1, Math.ceil(totalItems / itemsPerPage));
}

export function getPaginatedItems(items, page, itemsPerPage) {
  const start = (page - 1) * itemsPerPage;
  return items.slice(start, start + itemsPerPage);
}
