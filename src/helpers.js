/**
 * Returns true if the given hex is a valid hex color.
 * 
 * @param  {String}  hex
 * @return {Boolean}
 */
function isHex(hex) {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
}