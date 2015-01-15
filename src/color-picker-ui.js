/**
 * ColorPickerUi Constructor
 *
 * @param {Object} options
 *        pallete: {Array} Override default pallete color
 */
function ColorPickerUi(options) {
  this.options = $.extend(true, options, this.defaults);
  // todo => check given target have already a colorpicker
  this._render();
}

/**
 * Dropdown template (the main template of the ColorPickerUI).
 * @type {String}
 */
ColorPickerUi.prototype.template = templates['templates/dropdown-template.html'];

/**
 * Render the dropdown.
 */
ColorPickerUi.prototype._render = function() {
  var html = tmpl(this.template, {hello: 'vamossss'});
  this.$el = $('body').append(html);
  this._positionate(this.options.target);
  this._setEvents();

};

/**
 * Remove the dropdown, undelegate events and destroy the view.
 */
ColorPickerUi.prototype.remove = function() {
  this.$el.off();
  this.$el.remove();
};

/**
 * Once rendered the dropdown, set events.
 */
ColorPickerUi.prototype._setEvents = function() {
};

/**
 * Place the dropdow near the given target.
 * 
 * @param {HTML element} target
 */
ColorPickerUi.prototype._positionate = function(target) {
  var $target = $(target);
  var position = $target.offset();
  var width = $target.outerWidth();
  var height = $target.outerHeight();
};

ColorPickerUi.prototype.defaults = {
  pallete: [
    // First file
    '#136400','#229A00','#B81609','#D6301D',
    '#F84F40','#41006D','#7B00B4','#A53ED5','#2E5387','#3E7BB6',
    '#5CA2D1','#FF6600','#FF9900','#FFCC00','#FFFFFF',
    // Second file
    '#012700','#055D00','#850200','#B40903','#F11810',
    '#11002F','#3B007F','#6B0FB2','#081B47','#0F3B82','#2167AB',
    '#FF2900','#FF5C00','#FFA300','#000000'
  ],
  template: '<div>',
  verticalPosition: 'top'
};

/**
 * Override the default pallete with the supplied one,
 * so the user is able to set the pallete once in the.
 *
 * @param {Array} pallete Array colors
 */
ColorPickerUi.setPallete = function(pallete) {
  if (!(pallete instanceof Array) || !pallete.length) {
    console.warn('ColorPickerUi can\'t set the given pallete. It should be an array.');
    return;
  }
  ColorPickerUi.prototype.defaults.pallete = pallete;
};