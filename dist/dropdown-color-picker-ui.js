/* jshint ignore:start */
!function() {
/* jshint ignore:end */
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
  
  this.tmpl = function tmpl(str, data){
	// Figure out if we're getting a template, or if we need to
	// load the template - and be sure to cache the result.
	var fn = !/\W/.test(str) ?
        cache[str] = cache[str] ||
		tmpl(document.getElementById(str).innerHTML) :
	  
	  // Generate a reusable function that will serve as a template
	  // generator (and which will be cached).
	  new Function("obj",
		"var p=[],print=function(){p.push.apply(p,arguments);};" +
		
		// Introduce the data as local variables using with(){}
	        "with(obj){p.push('" +
			
		// Convert the template into pure JavaScript
		str
		  .replace(/[\r\t\n]/g, " ")
		  .split("{{").join("\t")
		  .replace(/((^|\}\})[^\t]*)'/g, "$1\r")
		  .replace(/\t=(.*?)\}\}/g, "',$1,'")
		  .split("\t").join("');")
		  .split("}}").join("p.push('")
		  .split("\r").join("\\'")
		+ "');}return p.join('');");
		
	// Provide some basic currying to the user
	return data ? fn( data ) : fn;
  };
})();

var templates = {};

templates["templates/dropdown-template.html"] = "<div class=\"color-picker-ui-dropdown\" style=\"width: {{= width }}px;\">\n" +
   "  <!-- Nav -->\n" +
   "  <ul class=\"cp-top\">\n" +
   "    <li class=\"cp-top-btn cp-top-btn-active\" data-name=\"pallete\">{{= texts[lang].pallete }}</li>\n" +
   "    <li class=\"cp-top-btn\" data-name=\"picker\">{{= texts[lang].picker }}</li>\n" +
   "  </ul>\n" +
   "\n" +
   "  <!-- Content -->\n" +
   "  <div class=\"cp-content\">\n" +
   "    <div class=\"cp-pallete\">\n" +
   "      {{ for (var i = 0; i < pallete.length; i++) { }}\n" +
   "        <span class=\"cp-pallete-color\" data-hex=\"{{= pallete[i] }}\" style=\"background-color: {{= pallete[i] }};\"></span>\n" +
   "      {{ } }}\n" +
   "    </div>\n" +
   "    <div class=\"cp-picker\" style=\"display: none;\">Picker</div>\n" +
   "  </div>\n" +
   "\n" +
   "  <!-- Footer -->\n" +
   "  <div class=\"cp-footer\">\n" +
   "    <div class=\"cp-selected-color\" style=\"background: {{= selectedColor }};\"></div>\n" +
   "    <input class=\"text\" type=\"text\" value=\"{{= selectedColor }}\">\n" +
   "  </div>\n" +
   "</div>";

/**
 * Returns true if the given hex is a valid hex color.
 * 
 * @param  {String}  hex
 * @return {Boolean}
 */
function isHex(hex) {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
}
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

/**
 * Remove the from the dom, undelegate events and destroy the view.
 */
ColorPickerUi.prototype.remove = function() {
  this._setEvents('off');
  this.$el.remove();
};

/**
 * Set events to on/off
 */
ColorPickerUi.prototype._setEvents = function(action) {
  var self = this;

  this.$el.find('.cp-top-btn')[action]('click', function(event) {
    self._onClickTab.apply(self, [event]);
  });

  this.$el.find('.cp-pallete-color')[action]('click', function(event) {
    self._onClickPalleteColor.apply(self, [event]);
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
    .animate({top: y, opacity: 1}, 80, 'linear');

  this.$el.css('left', x);
};

/**
 * Triggered when the user clicks on a tab.
 * Change tab active classnames and toggle the content.
 * 
 * @param  {Objet} event
 */
ColorPickerUi.prototype._onClickTab = function(event) {
  var $currentTarget = $(event.currentTarget);
  var className = 'cp-top-btn-active';
  var tabName = $currentTarget.data('name');
  // Set active className
  $currentTarget.addClass(className);
  $currentTarget.siblings().removeClass(className);
  // Toggle tab
  this.$el.find('.cp-' + tabName).show().siblings().hide();
};

/**
 * Triggered when the user clicks on a pallete color.
 * 
 * @param  {Object} event
 */
ColorPickerUi.prototype._onClickPalleteColor = function(event) {
  var $currentTarget = $(event.currentTarget);
  var hexColor = $currentTarget.data('hex');
  this._selectColor(hexColor);
};

/**
 * Set the supplied color as the current selected color.
 * 
 * @param  {String} hexColor
 */
ColorPickerUi.prototype._selectColor = function(hexColor) {
  this.options.selectedColor = hexColor;
  this.$el.find('.cp-selected-color').css('background', hexColor);
  this.$el.find('.cp-footer input').val(hexColor);
  this.options.onPick.apply(this, [hexColor]);
  // Only remove when selecting a color,
  // if it's been displayed as a dropdown.
  if (this.options.trigger) {
    this.remove();
  }
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
  container: 'body',
  selectedColor: '#000',
  width: 200,
  lang: 'en',
  texts: {
    en: {
      pallete: 'pallete',
      picker: 'picker'
    },
    es: {
      pallete: 'paleta',
      picker: 'selector'
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
/* jshint ignore:start */
  ColorPickerUi.version = '0.0.0';
  if (typeof define === 'function' && define.amd) {
    define(ColorPickerUi);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = ColorPickerUi;
  }
  this.ColorPickerUi = ColorPickerUi;
}.call(window);
/* jshint ignore:end */
