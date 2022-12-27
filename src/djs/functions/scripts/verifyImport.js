module.exports = function verifyImport(module) {
    // check if the module is defined
    if (module !== undefined) {
      return true;
    } else {
      return false
    }
}