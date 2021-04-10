module.exports = {
  /**
   * Get first item in array
   *
   * @param {Array} array Input array
   *
   * @returns {null|*}
   */
  firstItem(array) {
    if (!Array.isArray(array)) {
      return null;
    }

    return array[0];
  },
  /**
   * Sort array of objects by field
   *
   * @param {Object[]} array Input array
   * @param {string} field Field to sort by
   *
   * @returns {null|Object[]}
   */
  sortByField(array, field) {
    if (!Array.isArray(array) || array.length === 0 || array[0].hasOwnProperty == null) {
      return null;
    }

    return array.sort((first, second) => {
      if (first[field] === second[field]) {
        return 0;
      }

      return first[field] > second[field] ? 1 : 0;
    });
  },
};
