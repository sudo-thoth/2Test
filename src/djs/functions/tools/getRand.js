/**
 * Returns a random value/element from an array or object.
 *
 * @param {Array|Object} data - The array or object to select from.
 * @returns {any} A random element from the array or object.
 *
 * @throws {Error} If the passed variable is not an array or object.
 * @throws {Error} If the passed array is empty.
 * @throws {Error} If the passed variable is null or undefined.
 *
 * @example
 * getRand([1, 2, 3, 4, 5]); // returns a random element from the array
 * getRand({a: 1, b: 2, c: 3}); // returns a random value from the object
 */

module.exports = function getRand(data = []) {
    if (data == null) {
      throw new Error("Passed variable is null or undefined");
    }
  
    if (Array.isArray(data)) {
      if (data.length === 0) {
        throw new Error("Passed array is empty");
      }
  
      // get a random number between 0 and the number of elements in the array
      const randIndex = Math.floor(Math.random() * data.length);
  
      // return the element at the randomly-chosen index
      return data[randIndex];
    } else if (typeof data === "object" && data !== null) {
      // get the keys of the object
      const keys = Object.keys(data);
  
      // get a random number between 0 and the number of keys in the object
      const randIndex = Math.floor(Math.random() * keys.length);
  
      // return the value at the randomly-chosen key
      return data[keys[randIndex]];
    } else {
      throw new Error("Passed variable is not an array or object");
    }
  }
