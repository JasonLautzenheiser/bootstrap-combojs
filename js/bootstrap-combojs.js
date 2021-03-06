/* =============================================================
 bootstrap-combojs.js v0.2
 =============================================================
 Copyright (c) 2015 - Jason Lautzenheiser

 Work based on the bootstrap-combobox by Daniel Farrell
 https://github.com/danielfarrell/bootstrap-combobox

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ============================================================ */

;
(function ($) {
	"use strict";
	var $window = $(window);
	var defaults = {
		openOnElementClick: true,
		fullWidthMenu     : true,
		newOptionsAllowed : false,
		animated					: false,
		hideDisabled			: false,
		allowEscapeToClose : true,
		allowEnterToOpen  : false,
		clearElementOnOpen : false,
		animationDuration : 400,
		placeholder       : "",
		menu              : '<ul class="typeahead typeahead-long dropdown-menu"></ul>',
		item              : '<li><a href="#"></a></li>',
		disabledItem			: '<span class="option-disabled"></span>',
		selectedValue     : '',
		addSuffixToName		: false,
		nameSuffix				: '_auto'
	};

	function combojs(element, options) {
		this.$source = $(element);
		var dataOptions = {};  // data- options

		for (var key in defaults)
			dataOptions[key] = this.$source.data(key.toLowerCase());

		this.options = $.extend({}, defaults, dataOptions, options);

		this.init();
	}


	combojs.prototype = {
		constructor: combojs,

		//===========================================
		// public API methods
		//===========================================

		loaditems: function (items, callback) {
			var that = this;
			that.remove();
			$.each(items, function (i, item) {
				that.$source.append($('<option>', {value: item, text: item}));
			});
			that.refresh();
			that.clear();

			this._callback(callback);
		},


		disable: function (callback) {
			this.$element.prop('disabled', true);
			this.$button.attr('disabled', true);
			this.disabled = true;
			this.$container.addClass('combobox-disabled');

			this._callback(callback);

			return this;
		},

		enable: function (callback) {
			this.$element.prop('disabled', false);
			this.$button.attr('disabled', false);
			this.disabled = false;
			this.$container.removeClass('combobox-disabled');

			this._callback(callback);

			return this;
		},

		toggle: function (callback) {
			if (!this.disabled) {
				if (this.$container.hasClass('combobox-selected')) {
					if (this.options.clearElementOnOpen) {
						this.clearTarget();
						this.triggerChange();
						this.clearElement();
					}
					this.lookup();
				} else {
					if (this.shown) {
						this.hide();
					} else {
						this.clearElement();
						this.lookup();
					}
				}
			}
			this._callback(callback);
			return this;
		},

		show: function (callback) {
			var pos = $.extend({}, this.$element.offset(), {
				height: this.$element[0].offsetHeight
			});

			this.$menu
				//.insertAfter(this.$element)
				.css({
					top : pos.top + pos.height,
					left: pos.left
				});

			if (this.options.animated) {
				this.$menu.slideDown(this.options.animationDuration);
			} else {
				this.$menu.show();
			};

			$('.dropdown-menu').on('optionclick', $.proxy(this.scrollSafety, this));

			this.shown = true;

			this._callback(callback);

			return this;
		},

		focusAndSelect: function (callback) {
			this.$element.focus().select();
			this._callback(callback);
			return this;
		},

		focus: function (callback) {
			this.focused = true;
			this._callback(callback);
			return this;
		},

		setValue: function (item, callback) {
			if (item && item.toString() in this.map){
				this.$element.val(this.map[item]);
				this.$target.val(item);
				this.$source.val(item);
				this.$container.addClass('combobox-selected');
				this.selected=true;
			}
			else if (item === null) {
				this.clearTarget();
			}
			this._callback(callback);
			return this;
		},

		hide: function (callback) {
			if (this.options.animated) {
				this.$menu.slideUp(this.options.animationDuration);
			} else {
				this.$menu.hide();
			};
			$('.dropdown-menu').off('optionclick', $.proxy(this.scrollSafety, this));
			this.$element.on('blur', $.proxy(this.blur, this));
			this.shown = false;

			this._callback(callback);
			return this;
		},

		refresh: function (callback) {
			this.source = this.parse();
			this.options.items = this.source.length;

			this._callback(callback);
			return this;
		},

		remove: function(indexes, callback) {
			var dataType = $.type(indexes), dataLength, x= 0, elems = "", value;

			if (dataType === "array") {
				for(dataLength = indexes.length; x <= dataLength; x += 1) {
					value = indexes[x];
					if ($.type(value) === "number") {
						if (elems.length) {
							elems += ", option:eq(" + value + ")";
						}
						else {
							elems += "option:eq(" + value + ")";
						}
					}
				}
				this.$source.find(elems).remove();
			}
			else if (dataType === "number") {
				this.$source.find("option").eq(indexes).remove();
			}
			else {
				this.$source.find("option").remove();
			}

			this.refresh();

			this._callback(callback);

			return this;
		},

		clear: function (callback) {
			this.$element.val("");
			this.$source.val("");
			this.$target.val("");
			this.$container.removeClass("combobox-selected");
			this.selected = false;

			this._callback(callback);

			return this;
		},

		values: function (returnCallback) {

			var vs = [];

			vs = this.$source.find("option").map(function() {
				return $(this).val();
			});

			returnCallback.call(this.$source, vs);
		},

		//===========================================
		// private methods
		//===========================================

		_parseJSON: function(data) {
			return (JSON && JSON.parse && JSON.parse(data)) || $.parseJSON(data);
		},

		_isJSON: function(data) {
			var self = this,json;

			try {
				json = self._parseJSON(data);
				// Valid JSON
				return true;

			} catch (e) {

				// Invalid JSON
				return false;
			}
		},

		init: function () {
			this.template = this.options.template || this.template;
			this.$container = this.setup();
			this.$element = this.$container.find('input[type=text]');
			this.$target = this.$container.find('input[type=hidden]');
			this.$button = this.$container.find('.dropdown-toggle');
			this.$menu = $(this.options.menu).appendTo('body');
			this.matcher = this.options.matcher || this.matcher;
			this.sorter = this.options.sorter || this.sorter;
			this.highlighter = this.options.highlighter || this.highlighter;
			this.newOptionsAllowed = this.options.newOptionsAllowed;

			if (this.options.placeholder !== "")
				this.$element.attr("placeholder", this.options.placeholder);

			this.shown = false;
			this.selected = false;
			this.refresh();
			this.transferAttributes();
			this.listen();
		},

		setup: function () {
			var combobox = $(this.template());
			var that = this;
			this.$source.before(combobox);
			this.$source.hide();

			return combobox;
		},

		parse: function () {
			var that = this, map = {}, source = [], selected = false, selectedValue = '';


			this.$source.find('option').each(function () {
				var option = $(this);

				if (option.val() === '') {
					that.options.placeholder = option.text();
					return;
				}

				if (that.options.hideDisabled) {
					if (option.prop('disabled')) return;
				}

				var props = {};
				props.disabled = option.prop('disabled');
				props.text = option.text();

				map[option.text()] = option.val();
				source.push(props);
				if (option.prop('selected')) {
					selected = option.text();
					selectedValue = option.val();
				}

			});
			this.map = map;
			if (selected) {
				this.$element.val(selected);
				this.$target.val(selectedValue);
				this.$container.addClass('combobox-selected');
				this.selected = true;
			}
			return source;
		},

		transferAttributes: function () {
			this.options.placeholder = this.$element.attr('placeholder') || this.options.placeholder;
			this.$element.attr('placeholder', this.options.placeholder);
			this.$target.prop('name', this.$source.prop('name'));
			this.$target.val(this.$source.val());
			this.$source.removeAttr('name');  // Remove from source otherwise form will pass parameter twice.

			this.$element.attr('required', this.$source.attr('required'))
			this.$element.attr('rel', this.$source.attr('rel'))
			this.$element.attr('title', this.$source.attr('title'))
			this.$element.attr('class', this.$source.attr('class'))
			this.$element.attr('tabindex', this.$source.attr('tabindex'))

			if (this.options.addSuffixToName)
				this.$element.attr('name', this.$source.attr('id') + this.options.nameSuffix)

			this.$source.removeAttr('tabindex');
			if (this.$source.attr('disabled') !== undefined)
				this.disable();
		},

		select: function () {
			var val = this.$menu.find('.active').attr('data-value');
			this.$element.val(this.updater(val));
			this.$target.val(this.map[val]);
			this.$source.val(this.map[val]);

			this.$container.addClass('combobox-selected');
			this.selected = true;

			this.$element.trigger('change');
			this.$target.trigger('change');
			this.$source.trigger('change');

			return this.hide();
		},

		updater: function (item) {
			return item;
		},

		fixMenuScroll: function () {
			var active = this.$menu.find('.active');
			if (active.length) {
				var top = active.position().top;
				var bottom = top + active.height();
				var scrollTop = this.$menu.scrollTop();
				var menuHeight = this.$menu.height();
				if (bottom > menuHeight) {
					this.$menu.scrollTop(scrollTop + bottom - menuHeight);
				} else if (top < 0) {
					this.$menu.scrollTop(scrollTop + top);
				}
			}
		},




		lookup: function (event) {
			this.query = this.$element.val();
			return this.process(this.source);
		},

		process: function (items) {
			var that = this;

			items = $.grep(items, function (item) {
				return that.matcher(item);
			});

			items = this.sorter(items);

			if (!items.length) {
				return this.shown ? this.hide() : this;
			}

			return this.render(items.slice(0, this.options.items)).show();
		},

		template: function () {
			return '<div class="combobox-container"> <input type="hidden" /> <div class="input-group"> <input type="text" autocomplete="false" /> <span class="input-group-addon dropdown-toggle" data-dropdown="dropdown"> <span class="caret" /> <span class="combobox-remove glyphicon glyphicon-remove" /> </span> </div> </div>'
		},

		matcher: function (item) {
			return ~item.text.toLowerCase().indexOf(this.query.toLowerCase());
		},

		sorter: function (items) {
			var beginswith = [], caseSensitive = [], caseInsensitive = [], item;

			while (item = items.shift()) {
				if (!item.text.toLowerCase().indexOf(this.query.toLowerCase())) {
					beginswith.push(item);
				}
				else if (~item.text.indexOf(this.query)) {
					caseSensitive.push(item);
				}
				else {
					caseInsensitive.push(item);
				}
			}

			return beginswith.concat(caseSensitive, caseInsensitive);
		},

		highlighter: function (item) {
			var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
			return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
				return '<strong>' + match + '</strong>';
			});
		},

		render: function (items) {
			var that = this;

			items = $(items).map(function (i, item) {
				i = $(that.options.item).attr('data-value', item.text);
				if (item.disabled) {
					//i.attr("data-disabled", true);
					i.addClass("option-disabled");
					i.text(item.text);
					var ele = i.find('a');
					ele.html(that.highlighter(item.text));
				}
				else {
					var ele = i.find('a');
					ele.html(that.highlighter(item.text));
				}
				return i[0];
			});

			items.first().addClass('active');

			if (this.options.fullWidthMenu)
				this.$menu.width(this.$element.outerWidth());

			this.$menu.html(items);
			return this;
		},

		next: function (event) {
			var active = this.$menu.find('.active').removeClass('active'), next = active.next();

			//while(next.attr("data-disabled")==="true" || !next.length ) {
			while(next.hasClass("option-disabled")=== true || !next.length ) {
				next = next.next();

				if (!next.length) {
					next = $(this.$menu.find('li')[0]);
				}
			}
			next.addClass('active');
		},

		prev: function (event) {
			var active = this.$menu.find('.active').removeClass('active'), prev = active.prev();

			//while(prev.attr("data-disabled")==="true" || !prev.length ) {
			while(prev.hasClass("option-disabled")==="true" || !prev.length ) {
				prev = prev.prev();

				if (!prev.length) {
					prev = this.$menu.find('li').last();
				}
			}
			prev.addClass('active');
		},


		scrollSafety: function (e) {
			if (e.target.tagName == 'UL') {
				this.$element.off('blur');
			}
		},

		clearElement: function () {
			this.$element.val('').focus();
		},

		clearTarget: function () {
			this.$source.val('');
			this.$target.val('');
			this.$container.removeClass('combobox-selected');
			this.$source.trigger('selected',null);
			this.selected = false;
		},

		triggerChange: function () {
			this.$source.trigger('change');
		},

		elementClick: function () {
			if (!this.selected)
				this.toggle();
		},

		listen: function () {
			this.$element
				.on('focus', $.proxy(this.focus, this))
				.on('blur', $.proxy(this.blur, this))
				.on('keypress', $.proxy(this.keypress, this))
				.on('keyup', $.proxy(this.keyup, this));

			if (this.options.openOnElementClick) {
				this.$element.on('click', $.proxy(this.elementClick, this));
			}
			if (this.eventSupported('keydown')) {
				this.$element.on('keydown', $.proxy(this.keydown, this));
			}

			this.$menu
				.on('click', $.proxy(this.click, this))
				.on('mouseenter', 'li', $.proxy(this.mouseenter, this))
				.on('mouseleave', 'li', $.proxy(this.mouseleave, this))
				.on('click', 'li', $.proxy(this.optionclick, this));

			this.$button
				.on('click', $.proxy(this.toggle, this));
		},

		eventSupported: function (eventName) {
			var isSupported = eventName in this.$element;
			if (!isSupported) {
				this.$element.setAttribute(eventName, 'return;');
				isSupported = typeof this.$element[eventName] === 'function';
			}
			return isSupported;
		},

		move: function (e) {
			if (!this.shown) {
				return;
			}

			switch (e.keyCode) {
				case 9: // tab
				case 13: // enter
				case 27: // escape
					e.preventDefault();
					break;

				case 38: // up arrow
					e.preventDefault();
					this.prev();
					this.fixMenuScroll();
					break;

				case 40: // down arrow
					e.preventDefault();
					this.next();
					this.fixMenuScroll();
					break;
			}

			e.stopPropagation();
		},

		keydown: function (e) {
			this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40, 38, 9, 13, 27]);
			this.move(e);
		},

		keypress: function (e) {
			if (this.suppressKeyPressRepeat) {
				return;
			}
			this.move(e);
		},

		keyup: function (e) {
			switch (e.keyCode) {
				case 40: // down arrow
					if (!this.shown) {
						this.toggle();
					}
					break;
				case 39: // right arrow
				case 38: // up arrow
				case 37: // left arrow
				case 36: // home
				case 35: // end
				case 16: // shift
				case 17: // ctrl
				case 18: // alt
					break;

				case 9: // tab
				case 13: // enter
					if (!this.shown) {
						if (this.options.allowEnterToOpen) {
							this.toggle();
						}
						return;
					}
					this.select();
					break;


				case 27: // escape
					if (!this.shown || !this.options.allowEscapeToClose) {
						return;
					}
					this.hide();
					break;

				default:
					if (!e.altKey && !e.ctrlKey && !e.metaKey) {
						this.clearTarget();
						this.lookup();
					}
			}

			e.stopPropagation();
			e.preventDefault();
		},

		blur: function (e) {
			var that = this;
			this.focused = false;
			var val = this.$element.val();
			if (this.newOptionsAllowed) {
				if (this.length === 0)
				{
					this.$target.val(val);
				}
			}
			else {
				if (!this.selected && val !== '') {
					this.$element.val('');
					this.$source.val('').trigger('change');
					this.$target.val('').trigger('change');
				}
			}
			if (!this.mousedover && this.shown) {
				setTimeout(function () {
					that.hide();
				}, 200);
			}
		},

		click: function (e) {
			e.stopPropagation();
			e.preventDefault();
			this.select();
			this.$element.focus();
		},

		optionclick: function(e) {
			if ($(e.toElement).hasClass("option-disabled")) {
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		},

		mouseenter: function (e) {
			this.mousedover = true;
			this.$menu.find('.active').removeClass('active');
			$(e.currentTarget).addClass('active');
		},

		mouseleave: function (e) {
			this.mousedover = false;
		},

		_callback: function(callback) {
			var self = this;

			if ($.isFunction(callback)) {
				callback.call(self);
			}

			return self;
		}
	};

	$.extend(combojs.prototype, {})

	$.fn.combojs = function (option) {
		var args = Array.prototype.slice.call(arguments, 1);

		return this.each(function () {
			var $this = $(this), options = typeof option == 'object' && option, data = $this.data('combojs');
			if (!data) {
				$this.data('combojs', (data = new combojs(this, options)));
			}
			if (typeof option === 'string') {
				var plugin = $.data(this, 'combojs');
				if (typeof plugin[option] === 'function') {
					plugin[option].apply(plugin, args);
				}

			}
		});
	}
}(window.jQuery));
