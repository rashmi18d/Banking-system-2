export const sortArray = (data: any[], key: string, direction: string) => {
  let sortableItems = [...data];

  if (key) {
    sortableItems.sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  return sortableItems;
};
