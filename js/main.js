function DuurtLang() {
	setTimeout(function(){
		document.querySelector("#loading .text").innerHTML = "Bijna klaar..";}, 10000);
	setTimeout(function(){
		document.querySelector("#loading .text").innerHTML = "Als het nog lang duurt, wacht dan nog maar even" ;}, 20000);
	setTimeout(function(){
		document.querySelector("#loading .text").innerHTML = "We laden eerst alle afbeeldingen.." ;}, 30000);
	setTimeout(function(){
		document.querySelector("#loading .text").innerHTML = "Je hebt wel erg langzaam internet.." ;}, 60000);
	setTimeout(function(){
		document.querySelector("#loading .text").innerHTML = "Probeer, als het te lang duurt, de browser te herladen" ;}, 100000);
}

var opacityLaadscherm = 1;
DuurtLang();

var isPageLoaded = false;
window.addEventListener("load", function(){
	
	isPageLoaded = true;

	function fadeOut () {
			opacityLaadscherm = Number(opacityLaadscherm-0.09);
			document.getElementById("load_screen").style.opacity = opacityLaadscherm;
			if (document.getElementById("load_screen").style.opacity > 0) {
			requestAnimationFrame(function (z) {
			fadeOut();
			});
			}
			else {
			document.getElementById("load_screen").style.display = "none";
			}
	}

		setTimeout(function () {
			fadeOut ();
	},1000);

});





/* credits to:
https://codyhouse.co/demo/presentation-slideshow/index.html
*/

jQuery(document).ready(function($){


	/* cache jQuery objects */
	var slideshow = $('.cd-slideshow'),
		slides = slideshow.children('li'),
		navigation = $('.cd-slideshow-nav');
	/* initialize varaibles */
	var delta = 0,
        scrollThreshold = 6,
	 	resizing = false,
    	scrolling = false;

	/* check media query and bind corresponding events */
	var mq = windowWidth(slideshow.get(0)),
		bindToggle = false;
	bindEvents(mq, true);
	/* initilaize slidshow */
	initSlideshow(slideshow);

	/* on swipe, update visible sub-slides (if available) */
	slides.on('swipeleft', function(event){
		( mq == 'mobile' ) && updateSubSlide($(this), 'next');
	});
	slides.on('swiperight', function(event){
		( mq == 'mobile' ) && updateSubSlide($(this), 'prev');
	});

	/* update slideshow if user clicks on a not-visible slide (desktop version only)*/
	slides.on('click', function(event){
		var slide = $(this);


		if( mq == 'desktop' && !slide.hasClass('visible') ) {
			updateSlide('nav', slide);
		} else if( mq == 'desktop' && $(event.target).parents('.sub-visible').length == 0 && $(event.target).parents('.sub-slides').length > 0 ) {
			var newSubSlide = $(event.target).parents('.cd-slider-content').parent('li'),
				direction = ( newSubSlide.prev('.sub-visible').length > 0 ) ? 'next' : 'prev';
			updateSubSlide(slide, direction);
		}
	});

	/* open/close main navigation*/
	navigation.on('click', '.cd-nav-trigger', function(){
		if(navigation.hasClass('nav-open') && mq == 'desktop' ) $(window).on('DOMMouseScroll mousewheel', updateOnScroll);
		else if( !navigation.hasClass('nav-open') && mq == 'desktop') $(window).off('DOMMouseScroll mousewheel', updateOnScroll);
		navigation.toggleClass('nav-open');
	});

	/* select a slide from the navigation */
	navigation.on('click', 'a', function(event){
		var selectedItem  = $(event.target),
			isSubSlide = (selectedItem.parents('.sub-nav').length > 0),
			slideIndex = ( !isSubSlide ) ? selectedItem.parent('li').index() : selectedItem.parents('.sub-nav').parent('li').index(),
			newSlide = slides.eq(slideIndex);
		
		slideshow.addClass('remove-transitions');
		navigation.removeClass('nav-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			slideshow.removeClass('remove-transitions');
		});

		if ( mq == 'desktop' ) {
			event.preventDefault();
			updateSlide('nav', newSlide);
			$(window).on('DOMMouseScroll mousewheel', updateOnScroll);
		}

		if( !isSubSlide) {
			newSlide.children('.sub-slides').attr('style', '').children('li.sub-visible').removeClass('sub-visible').end().children('li').eq(0).addClass('sub-visible');
			updateSlideDots(newSlide.children('.slider-dots'), 'nav', 0);
		} else {
			var subIndex = selectedItem.parent('li').index() + 1,
				visibleSubSlide = newSlide.children('.sub-slides').children('li').eq(subIndex);
			updateSubSlide(newSlide ,'nav', visibleSubSlide);
		}
	});
	
	/* update slideshow position on resize */
	$(window).on('resize', function(){
		if( !resizing ) {
			(!window.requestAnimationFrame) ? updateOnResize() : window.requestAnimationFrame(updateOnResize);
		 	resizing = true;
		}
	});

	function updateSlideDots(listItemNav, string, newSubIndex) {
		var activeDot = listItemNav.children('.active');
		
		if( string == 'next' ) var newDots = activeDot.next();
		else if(  string == 'prev') var newDots = activeDot.prev();
		else var newDots = listItemNav.children('li').eq(newSubIndex);

		activeDot.removeClass('active');
		newDots.addClass('active');
	}

	function updateSubSlide(listItem, string, subSlide) {


		var translate = 0,
			listItemNav = listItem.children('.slider-dots'),
			marginSlide = Number(listItem.find('.cd-slider-content').eq(0).css('margin-right').replace('px', ''))*6,
			windowWidth = window.innerWidth;

		windowWidth = ( mq == 'desktop' ) ? windowWidth - marginSlide : windowWidth;

		if( listItem.children('.sub-slides').length > 0 ) {
			var subSlidesWrapper = listItem.children('.sub-slides'),
				visibleSubSlide = subSlidesWrapper.children('.sub-visible');
			if( visibleSubSlide.length == 0 ) visibleSubSlide = subSlidesWrapper.children('li').eq(0).addClass('sub-visible');
			
			if( string == 'nav' ) {
				/* we have choosen a new slide from the navigation */
				var	newSubSlide = subSlide;
			} else {
				var	newSubSlide = (string == 'next') ? visibleSubSlide.next() : visibleSubSlide.prev();
			}

			if(newSubSlide.length > 0 ) {
				var newSubSlidePosition = newSubSlide.index();
				translate = parseInt(- newSubSlidePosition*windowWidth);

				setTransformValue(subSlidesWrapper.get(0), 'translateX', translate + 'px');
				updateSlideDots(listItemNav, string, newSubSlidePosition);
				visibleSubSlide.removeClass('sub-visible');
				newSubSlide.addClass('sub-visible');
			}
		}


		if( listItem.children('.sub-slides').length > 0 ) {
			if(newSubSlide.length > 0 ) {
				// console.log(listItem["0"].id + " " + newSubSlidePosition);

	    		constructURL(listItem["0"].id,newSubSlidePosition)

			}
		}

	}

	function updateSlide(string, slide) {



    	/* switch from a slide to the next/previous one*/
    	var visibleSlide = slides.filter('.visible'),
    		marginSlide = ( visibleSlide.find('.cd-slider-content').length > 0 ) ? Number(visibleSlide.find('.cd-slider-content').eq(0).css('margin-bottom').replace('px', ''))*3 : 0,
    		actualTranslate = getTranslateValue(slideshow.get(0), 'Y');

    	if( string == 'nav' ) {
    		/* we have choosen a new slide from the navigation */
    		var newSlide = slide;
    	} else {
    		var newSlide = (string == 'next') ? visibleSlide.next() : visibleSlide.prev();
    	}

    	if( newSlide.length > 0 ) {
    		$(window).off('DOMMouseScroll mousewheel', updateOnScroll);
    		var translate = parseInt( - newSlide.offset().top + actualTranslate + marginSlide);
    		( translate > 0) && ( translate = 0);
    		setTransformValue(slideshow.get(0), 'translateY', translate + 'px');
    		visibleSlide.removeClass('visible');
			newSlide.addClass('visible');
			( newSlide.find('.sub-visible').length == 0 ) && newSlide.find('.sub-slides').children('li').eq('0').addClass('sub-visible');
	    }


    	if( newSlide.length > 0 ) {
    		constructURL(newSlide["0"].id,0)
			// console.log(newSlide["0"].id + " " + 0);
		}
    }


	function buildURL() {
		// URL: 	#slide-1&0

		// console.log("b ~ " + location.hash)
		if (location.hash.length > 0) {
			if (location.hash.search("&") > 0) {
				var hash = location.hash.split("&");
				// console.log(hash)
				// loop though the array


				var hzero = hash[0].split("-");
				if ( (   hash[0].indexOf("slide-") > -1   ) && !isNaN(hzero[1]) ) {
					// console.log("hi1111" )
					// updateSlide("nav", {0: document.querySelector(hash[0])} )
					setTimeout(function(){

						var obj = $(hash[0]);
						updateSlide('nav', obj);

					}, 1);

				}

				if (!isNaN(hash[1])) {

					setTimeout(function(){
						var obj = $(hash[0]);
						var subobj = $(hash[0] + " ol li:nth-child(" + hash[1] + ")");

						console.log(obj,subobj)
						updateSubSlide(obj ,'nav', subobj);

					}, 4);

				}

			}
		}
	}
	buildURL();

	var prevURL;
	function constructURL(slideName,subslideInt) {

		if (isPageLoaded) {
			if (history.pushState) {

				var url = "#" + slideName + "&" + Number(subslideInt+1);
				if (url !== prevURL) {
					var stateObj = { url: url };
					history.pushState(stateObj, "Qdraw", url);
				}
				prevURL = url;
		

			}
		}
	}


	window.onhashchange = function() {
		console.log("~")

		if (isPageLoaded) {

			if (window.innerDocClick) {
				// Thanks: http://stackoverflow.com/questions/25806608/how-to-detect-browser-back-button-event-cross-browser
				window.innerDocClick = false;

				console.log("innerDocClick");
				buildURL();


			} else {
				if (window.location.hash != '#undefined') {
					buildURL();

				} else {
					// Go back to (for expample) Google;
					history.pushState("", document.title, window.location.pathname);
					location.reload();
				}
			}
		}

	};


	function updateOnResize() {
		mq = windowWidth(slideshow.get(0));
		bindEvents(mq, bindToggle);
		if( mq == 'mobile' ) {
			bindToggle = true;
			slideshow.attr('style', '').children('.visible').removeClass('visible');
		} else {
			bindToggle = false;
			if ( slides.filter('.visible').length == 0 ) slides.eq(0).addClass('visible');
			updateSlide('nav', slides.filter('.visible'));
		}
		initSlideshow(slideshow);
		resizing = false;
	}

	function scrollHijacking(event) {
        if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) { 
            delta--;
            ( Math.abs(delta) >= scrollThreshold) && updateSlide('prev');
        } else {
            delta++;
            (delta >= scrollThreshold) && updateSlide('next');
        }
        scrolling = false;
        return false;
    }

	function updateOnScroll(event) {
    	if( !scrolling ) {
    		(!window.requestAnimationFrame) ? scrollHijacking(event) : window.requestAnimationFrame(function(){scrollHijacking(event);});
		 	scrolling = true;
    	}
    }

	function bindEvents(MQ, bool) {
    	if( MQ == 'desktop' && bool) {   		
			$(window).on('DOMMouseScroll mousewheel', updateOnScroll);
    		$(document).on('keydown', function(event){
				if( event.which=='40' ) {
					event.preventDefault();
					updateSlide('next');
				} else if( event.which=='38' ) {
					event.preventDefault();
					updateSlide('prev');
				} else if( event.which=='39' ) {
					var visibleSlide = slides.filter('.visible');
					updateSubSlide(visibleSlide, 'next');
				} else if ( event.which=='37' ) {
					var visibleSlide = slides.filter('.visible');
					updateSubSlide(visibleSlide, 'prev');
				}
			});
		} else if( MQ == 'mobile' ) {
			$(window).off('DOMMouseScroll mousewheel', updateOnScroll);
    		$(document).off('keydown');
		}
    }

	function createSubSlideDots(container, slideNumber) {
		/* create dots i slide has sub-slides */
		if( container.find('.slider-dots').length == 0 ) {
			var navigationWrapper = $('<ol class="slider-dots"></ol>').appendTo(container);
			for (i = 0; i < slideNumber; i++) { 
			    var navItem = (i == 0) ? $('<li class="active"></li>') : $('<li></li>');
			    navItem.appendTo(navigationWrapper);
			}
		}
	}

	function initSlideshow(slideshow) {
		var windowWidth = window.innerWidth;
		slideshow.children('li').each(function(){
			var slide = $(this),
				subSlideNumber = slide.children('.sub-slides').children('li').length,
				slideWidth = (subSlideNumber) * windowWidth;
			slideWidth = ( slideWidth == 0 ) ? windowWidth : slideWidth;
			slide.css('width', slideWidth + 'px');
			if( subSlideNumber > 0 ) { 
				var visibleSubSlide = slide.find('.sub-visible');
				if( visibleSubSlide.length == 0 ) {
					visibleSubSlide = slide.find('li').eq(0);
					visibleSubSlide.addClass('sub-visible');
				}
				updateSubSlide(slide ,'nav', visibleSubSlide);
				createSubSlideDots(slide, subSlideNumber);
			}
		});
	}

	function getTranslateValue(element, axis) {
		var elementStyle = window.getComputedStyle(element, null),
			elementTranslate = elementStyle.getPropertyValue("-webkit-transform") ||
         		elementStyle.getPropertyValue("-moz-transform") ||
         		elementStyle.getPropertyValue("-ms-transform") ||
         		elementStyle.getPropertyValue("-o-transform") ||
         		elementStyle.getPropertyValue("transform");

        if( elementTranslate.indexOf('(') >=0 ) {
        	elementTranslate = elementTranslate.split('(')[1];
    		elementTranslate = elementTranslate.split(')')[0];
    		elementTranslate = elementTranslate.split(',');
    		var translateValue = ( axis == 'X') ? elementTranslate[4] : elementTranslate[5];
        } else {
        	var translateValue = 0;
        }

        return Number(translateValue);
	}

	function setTransformValue(element, property, value) {
		element.style["-webkit-transform"] = property+"("+value+")";
		element.style["-moz-transform"] = property+"("+value+")";
		element.style["-ms-transform"] = property+"("+value+")";
		element.style["-o-transform"] = property+"("+value+")";
		element.style["transform"] = property+"("+value+")";

		$(element).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			if( mq == 'desktop') {
				delta = 0;
				$(window).on('DOMMouseScroll mousewheel', updateOnScroll);
			}
		});
	}

	function windowWidth(element) {
		var mq = window.getComputedStyle(element, '::before').getPropertyValue('content').replace(/["']/g, '');
		return mq;
	}
});