/*! jquery.selectable.js version : 1.0.0 authors : Eldar Mardanov */
(function($){$(function(){
function makeSelect(el, p) {
    this.el = $(el);
	this.el.css('display','none');
	this.params = $.extend(this, makeSelect.options, p);
    this.id = this.el.attr('id');
    this.withSearch = this.params.withSearch?1:0;
    this.size = this.params.width?this.params.width:this.el.data('width');
    this.enabled = this.el.attr('disabled') ? false : true;
    this.params.className = this.params.className || '';
    this.ael = $('<div></div>',{'for': this.id, 'class': this.params.mainClass+' '+this.params.className +' '+(this.enabled ? '' : 'disabled')});
	this.ael.html(this.tpl());
	this.fAel = this.ael.find('.'+this.params.firstClass);
    this.replacement();
}
makeSelect.options = {mainClass: 'selectable',firstClass: 'firstelem',listClass: 'listitems'};
makeSelect.prototype = {
    replacement: function () {
		if($('div[for="'+this.id+'"]').html()) $('div[for="'+this.id+'"]').remove();
		this.el.after(this.ael);
        this.build();
        this.hideIfClickOutside();
    },
    hideIfClickOutside: function(){
		var self = this;
		$(document).click(function(e){
			if(self.isOpen()) if(!self.checkPosition(e)) self.hide();
		});
	},
	isOpen: function(){
		return this.ael.hasClass('a') ? true : false;
	},
	checkPosition: function(e){
		return !(!this.ael.is(e.target) && this.ael.has(e.target).length === 0);
	},
	hide: function(){
		this.ael.removeClass('a');
		if(this.withSearch){
			this.aelVal(this.el.find('option:selected').text());
			this.fAel.attr('readonly','readonly');
		}
	},
	show: function(){
		this.ael.addClass('a');
		this.ael.find('li').show();
		this.fAel.removeAttr('readonly').val('').focus();
		this.ael.find('ul').scrollTop(0);
		this.ael.find('ul').scrollTop(this.ael.find('ul').find('.a').position().top-3);
	},
    aelVal: function(a){
        this.withSearch?(this.fAel.val(a),this.fAel.attr('placeholder','enter text: '+a)):this.fAel.html(a);
    },
    build: function () {
        this.ael.css({'width': this.size});
        var b = '', self = this;
        $.each(this.el.find('option'), function(){
			var selected = $(this).is(':selected') ? true : false;
			if(selected) self.aelVal(this.text);
            b += '<li vll="' + this.value + '" '+(selected ? 'class="a"' : '')+'>' + this.text + '</li>';
        });
        this.ael.find('ul').html(b);
        this.bindAll();
    },
    bindAll: function(){
        var self = this;
		this.ael.find('input').on('keyup',function(e){
			var ch = self.ael.find('li'), filter = e.target.value.toUpperCase().trim();
			if(filter!=''){
				var afiler = Utils.changeLang(filter);
				ch.hide();
				self.ael.find('p.not_found').remove();
				ch.each(function(){
					if($(this).text().toUpperCase().indexOf(filter)>-1) $(this).show();
					else if($(this).text().toUpperCase().indexOf(afiler)>-1) $(this).show();
				});
				if(!self.ael.find('ul').children(':visible').length){
					self.ael.find('ul').append($('<p>',{class:'not_found',text:'Нет совпадений'}));
				}
			}
			else ch.show();
		});
		this.ael.find('ul').bind( 'mousewheel DOMMouseScroll', function(e){
			var oe = e.originalEvent,d = oe.wheelDelta || -oe.detail;
			this.scrollTop += ( d < 0 ? 1 : -1 ) * 20;
			e.preventDefault();
		});
        this.ael.not('.disabled').on('click', function(e){
			if($(this).hasClass('a')){
				if($(e.target).is('.firstelem') && self.withSearch) return true;
				self.hide();
			}
			else self.show();
        });
        this.ael.find('li').on('click', function(){
			if(!$(this).hasClass('a')){
				$(this).parent().children().removeClass('a');
				$(this).addClass('a');
				self.aelVal($(this).text());
				self.el.val($(this).attr('vll'));
				self.el.change();
			}
        });
    },
    tpl: function () {
        return (this.withSearch?'<input readonly class="'+this.params.firstClass+'"/>':'<div class="'+this.params.firstClass+'"></div>')+'<div class="'+this.params.listClass+'"><ul></ul></div>';
    }
}
$.fn.makeSelect = function (p){return new makeSelect(this, p);}
})})(jQuery);