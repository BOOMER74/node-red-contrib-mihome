module.exports = {
  /**
   * Decode value string
   *
   * @param {string} string Encoded string
   *
   * @returns {null|string}
   */
  decodeValueString(string) {
    const decoded = JSON.parse(string);

    if (Array.isArray(decoded)) {
      return decoded[0];
    }

    return null;
  },
  /**
   * Decode hex string to integer
   *
   * @param {string} string Hex string
   *
   * @return {null|number}
   */
  decodeHexString(string) {
    if (string == null) {
      return null;
    }

    return parseInt(Buffer.from(string, 'hex').reverse().toString('hex'), 16);
  },
};
