/**
 * ColorPickerUi Constructor
 *
 * @param {Object} options
 *        pallete: {Array} Override default pallete color
 */
function ColorPickerUi(options) {
  this.options = $.extend(true, {}, this.defaults, options);
  this._render();
}

/**
 * Dropdown template (the main template of the ColorPickerUI).
 * @type {String}
 */
ColorPickerUi.prototype.template = templates['templates/dropdown-template.html'];

/**
 * Line style template.
 * @type {[type]}
 */
ColorPickerUi.prototype.lineStyleTemplate = templates['templates/line-style-template.html'];

/**
 * Render the dropdown.
 * This will render both tabs, pallete and the picker.
 * Then both will be toggled for display.
 */
ColorPickerUi.prototype._render = function() {
  this.$el = $(tmpl(this.template, this.options));
  this.$el.appendTo(this.options.container);
  this._positionate(this.options.trigger, this.options.verticalPosition);
  this._setEvents('on');
};

ColorPickerUi.prototype._renderStyleLine = function() {
  var $html = $(tmpl(this.lineStyleTemplate, this.options));
  this.$el.html($html);
  this._setEvents('off');
  $html.fadeIn(120);
  this._setLineStyleEvents('on');
};

/**
 * Remove the from the dom, undelegate events and destroy the view.
 */
ColorPickerUi.prototype.remove = function() {
  this._setEvents('off');
  this._setLineStyleEvents('off');
  var moveTo = this.options.verticalPosition === 'top' ? '-5' : '5';

  this.$el.animate({'margin-top': moveTo, opacity: '0'}, 200,
    function() {
      $(this).remove();
    });
};

/**
 * Set events to on/off
 */
ColorPickerUi.prototype._setEvents = function(action) {
  var that = this;
  var $hexInput = this.$el.find('.cp-hex-input');

  $hexInput[action]('keyup', function(event) {
    var hex = $(this).val();
    if (hex[0] !== '#') {
      hex = '#' + hex;
      $(this).val(hex);
    }
    if (isHex(hex)) {
      that._previewColor(hex, true);
    } else {
      that._previewColor(that.options.selected.color, true);
    }
  });

  $hexInput[action]('keypress', function(event) {
    var hex;
    if (event.which === 13) {
      hex = $(this).val();
      hex = isHex(hex) ? hex : that.options.selected.color;
      that._applyChanges({color: hex});
    }
  });

  // Click hex
  this.$el.find('.cp-hex')[action]('click', function(event) {
    that._onClickPalleteColor.apply(that, [event]);
  });

  // Mouse over color
  this.$el.find('.cp-hex')[action]('mouseover', function() {
    var hex = $(this).data('hex');
    $hexInput.blur();
    that._previewColor(hex);
  });

  $(document)[action]('mouseover', function(event) {
    if ($hexInput.is(':focus')) {return;}
    var $target = $(event.target);
    if (!$target.hasClass('cp-hex')) {
      that._previewColor(that.options.selected.color);
    }
  });

  // Click reset color
  if (this.options.resetColor) {
    this.$el.find('.cp-reset-btn')[action]('click', function() {
      that._applyChanges({color: that.options.resetColor});
    });
  }

  this.$el.find('.cp-line-style-btn')[action]('click', function() {
    that._renderStyleLine();
  });
};

ColorPickerUi.prototype._setLineStyleEvents = function(action) {
  var that = this;

  this.$el.find('.cp-btn-cancel')[action]('click', function() {
    that.remove();
  });

  this.$el.find('.cp-btn-apply')[action]('click', function() {
    var stroke = that.$el.find('.cp-stroke').val();
    var thickness = that.$el.find('.cp-thickness').val();
    that._applyChanges({
      storke: stroke,
      thickness: thickness
    });
  });
};

/**
 * Place the dropdown near the given trigger.
 * This function will be call if the trigger has been supplied.
 * 
 * @param {HTML element} trigger
 * @param {String}       verticalPosition   
 */
ColorPickerUi.prototype._positionate = function(trigger, verticalPosition) {
  if (!trigger) {return;}
  var $trigger = $(trigger);
  var position = $trigger.offset();
  var btnWidth = $trigger.outerWidth();
  var btnHeight = $trigger.outerHeight();
  var x = position.left - this.options.width/2 + btnWidth/2;
  var y, yBeforeAnimation;

  if (this.options.verticalPosition === 'top') {
    // Top
    y = position.top - this.$el.height();
    yBeforeAnimation = y + 5;
  } else {
    // Bottom
    y = position.top + btnHeight;
    yBeforeAnimation = y - 5;
  }

  this.$el.css({'top': yBeforeAnimation, opacity: 0.7})
    .animate({top: y, opacity: 1}, 100, 'linear');

  this.$el.css('left', x);
};

/**
 * Triggered when the user clicks on a pallete color.
 * 
 * @param  {Object} event
 */
ColorPickerUi.prototype._onClickPalleteColor = function(event) {
  var $currentTarget = $(event.currentTarget);
  var hex = $currentTarget.data('hex');
  this._applyChanges({color: hex});
};

/**
 * Set the supplied color as the current selected color.
 * 
 * @param  {String} hexColor
 */
ColorPickerUi.prototype._applyChanges = function(params) {
  if (params.color) {
    this.options.selected.color = params.color;
  }

  if (params.stroke) {
    this.options.selected.stroke = params.stroke;
  }

  if (params.thickness) {
    this.options.selected.thickness = params.thickness;
  }

  this.options.onPick.apply(this, [this.options.selected]);

  // Only remove when selecting a color,
  // if it's been displayed as a dropdown.
  if (this.options.trigger) {
    this.remove();
  }
};

/**
 * Change the preview color input.
 * 
 * @param  {String} hexColor
 */
ColorPickerUi.prototype._previewColor = function(hex, dontChangeInput) {
  this.$el.find('.cp-selected-color').css('background', hex);
  if (!dontChangeInput) {
    this.$el.find('.cp-hex-input').val(hex);
  }
};

ColorPickerUi.prototype.defaults = {
  pallete: [
    // First file
    '#4527a0','#5e35b1','#7e57c2', // Purple
    '#0d47a1','#1565c0','#1e88e5', // Blue
    '#33691e','#558b2f','#689f38', // Green
    '#e65100','#ef6c00','#fb8c00', // Orange
    '#b71c1c','#d32f2f','#f44336', // Red
    // Second file
    '#9575cd','#b39ddb','#d1c4e9', // Light purple
    '#42a5f5','#90caf9','#bbdefb', // Light blue
    '#7cb342','#9ccc65','#c5e1a5', // Light green
    '#ff9800','#ffb74d','#ffcc80', // Light orange
    '#ef5350','#e57373','#ef9a9a', // Light red
  ],
  container: 'body',
  selected: {
    color: '#000',
    stroke: 'normal',
    thickness: '1'
  },
  width: 200,
  lang: 'en',
  resetColor: null,
  texts: {
    en: {
      moreColors: 'More colors',
      lineStyle: 'Line style',
      reset: 'Reset',
      stroke: 'Stroke',
      thickness: 'Thickness',
      cancel: 'Cancel',
      apply: 'Apply'
    },
    es: {
      moreColors: 'Más colores',
      lineStyle: 'Estilo de linea',
      reset: 'Restaurar',
      stroke: 'Trazo',
      thickness: 'Grosor',
      cancel: 'Cancelar',
      apply: 'Aplicar'
    }
  },
  onPick: function(hexColor) {},
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

/**
 * Adds a new language to defaults texts.
 * If any given text is missing, it will take the english one
 * by default.
 * 
 * @param {String} locale
 * @param {Object} texts  Texts of the locale
 */
ColorPickerUi.addLang = function(locale, texts) {
  if (typeof locale !== 'string') {
    console.warn('ColorPickerUi needs a locale string to add a new language.');
    return;
  }
  texts = $.extend(ColorPickerUi.prototype.defaults.texts.en, texts);
  ColorPickerUi.prototype.defaults.texts[locale] = texts;
};