/**
 * @component ptr.js
 * @description Pull to Refresh for the Web 1.1 https://github.com/apeatling/web-pull-to-refresh 改版
 * @time 2017-04-05 14:50
 * @author fishYu
 **/

let Ptr = function () {

	/**
	 * Hold all of the default parameters for the module
	 * @type {object}
	 */
	var defaults = {
		// ID of the element holding pannable content area
		contentEl: 'ptr-content',

		// ID of the element holding pull to refresh loading area
		ptrEl: 'ptr-anim',

		// Number of pixels of panning until refresh
		distanceToRefresh: 70,

		// Pointer to function that does the loading and returns a promise
		loadUp: false,

		loadDown: false,

		// Dragging resistance level
		resistance: 3.0,

		isLoading: false,
		isLoadingDown: false
	};

	/**
	 * Hold all of the merged parameter and default module options
	 * @type {object}
	 */
	var options = {};

	/**
	 * Pan event parameters
	 * @type {object}
	 */
	var pan = {
		enabled: false,
		distance: 0,
		startingPositionY: 0
	};

	/**
	 * Easy shortener for handling adding and removing body classes.
	 */
	var bodyClass ;

	/**
	 * Initialize pull to refresh, hammer, and bind pan events.
	 *
	 * @param {object=} params - Setup parameters for pull to refresh
	 */
	var init = function( params ) {
		params = params || {};

		// let wrapper = document.createElement("div");
		// wrapper.className = "ptr-wrapper";

		let parentEl = params.el;
		bodyClass = parentEl.classList;

		// let parentNode = parentEl.parentNode;
        //
		// parentNode.removeChild(parentEl);
        //
        //
		// wrapper.appendChild(parentEl);
		// parentNode.appendChild(wrapper);

		if(params.loadUp){
			params.loadingFunction = function () {
				return new Promise(params.loadUp);
			};
		}

		if(params.loadDown){
			params.loadingDownFunction = function () {
				return new Promise(params.loadDown);
			}
		}

		options = {
			contentEl: params.contentEl,
			ptrEl: params.ptrEl,
			distanceToRefresh: params.distanceToRefresh || defaults.distanceToRefresh,
			loadingFunction: params.loadingFunction || defaults.loadUp,
			loadingDownFunction: params.loadingDownFunction || defaults.loadDown,
			resistance: params.resistance || defaults.resistance,
			parentEl: parentEl
		};

		// options.ptrEl.innerHTML = "<span class=\"genericon genericon-next\"></span>" +
		// 	"<div class='p-loading'>" +
		// 	"<div class='spinner__item1'></div>" +
		// 	"<div class='spinner__item2'></div>" +
		// 	"<div class='spinner__item3'></div>" +
		// 	"<div class='spinner__item4'></div>" +
		// 	"</div>";

		options.ptrEl.style.visibility = "hidden";

		if ( ! options.contentEl || ! options.ptrEl ) {
			return false;
		}

		var h = options.hammer = new HammerJS( options.parentEl ,{domEvents:true});

		h.get( 'pan' ).set( { direction: HammerJS.DIRECTION_VERTICAL } );

		h.on( 'panstart', onPanStart );
		h.on( 'pandown', onPanDown );
		h.on( 'panup', onPanUp );
		h.on( 'panend', onPanEnd );
		//modify by fishYU 2017-04-05 注释全局的滚动事件
		// parentEl.addEventListener("scroll", onScroll, false);
	};

	var _loadDownReset = function () {
		options.isLoadingDown = false;
	};

	var lastScrollTop = 0;var startY, startTopScroll;
	var onTouchStart = function (event) {
		// startY = event.touches[0].pageY;
		// let elem = options.parentEl;
		// startTopScroll = elem.scrollTop;
        //
		// if(startTopScroll <= 0)
		// 	elem.scrollTop = 1;
        //
		// if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
		// 	elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
	}

	var onScroll = function () {
		if(options.isLoadingDown || !options.loadingDownFunction || options.isLoading){
			return;
		}
		var height = options.parentEl.offsetHeight;
		var top = options.parentEl.scrollTop;
		let offset = 15; //允许误差

		// console.log("ff");
		if(top < lastScrollTop + offset / 2){
			lastScrollTop = top;
			return;
		}
		lastScrollTop = top;
		var contentHeight = options.contentEl.offsetHeight;
		// console.log(height, top, contentHeight);

		if(height + top + offset >= contentHeight){
			options.isLoadingDown = true;
			// console.log(top);
			setTimeout(function () {
				options.loadingDownFunction().then(_loadDownReset);
			},500);
		}
	};

	/**
	 * Determine whether pan events should apply based on scroll position on panstart
	 *
	 * @param {object} e - Event object
	 */
	var onPanStart = function(e) {
		if (options.parentEl.classList.contains('ptr-loading') || options.isLoading) {
			pan.enabled = false;
			return;
		}

        //
        // console.log(e);
		pan.startingPositionY = options.parentEl.scrollTop;
		// console.log("start",pan.startingPositionY );
		if ( pan.startingPositionY <= 1) {
			pan.enabled = true;
			// console.log(options.contentEl.style);

		}
	};

	/**
	 * Handle element on screen movement when the pandown events is firing.
	 *
	 * @param {object} e - Event object
	 */
	var onPanDown = function(e) {
		// e.srcEvent.stopPropagation();
		if ( ! pan.enabled ) {
			return;
		}

		if(options.isLoading){
			return;
		}

		if(options.loadingFunction && e.deltaY > 20){
			options.ptrEl.style.visibility = "visible";
		}

		//modify by fishYu 2017-04-05 打开注释
		// e.preventDefault();
		pan.distance = e.distance / options.resistance;

		_setContentPan();
		_setBodyClass();
	};

	/**
	 * Handle element on screen movement when the pandown events is firing.
	 *
	 * @param {object} e - Event object
	 */
	var onPanUp = function(e) {
		// e.srcEvent.stopPropagation();
		if ( ! pan.enabled || pan.distance <= 1 || options.isLoading) {
			return;
		}
		//modify by fishYu 2017-04-05 打开注释
		// e.preventDefault();

		//todo
		// if ( pan.distance < e.distance / options.resistance ) {
		// 	console.log(pan.distance);
		// 	pan.distance = 0;
		// } else {
			pan.distance = e.distance / options.resistance;
		// }

		_setContentPan();
		_setBodyClass();
	};

	/**
	 * Set the CSS transform on the content element to move it on the screen.
	 */
	var _setContentPan = function() {
		// Use transforms to smoothly animate elements on desktop and mobile devices
		// if(options.isLoading){
		//
		// }
		options.contentEl.style.transform = options.contentEl.style.webkitTransform = 'translate3d( 0, ' + (pan.distance) + 'px, 0 )';
		options.ptrEl.style.transform = options.ptrEl.style.webkitTransform = 'translate3d( 0, ' + ( pan.distance - options.ptrEl.offsetHeight ) + 'px, 0 )';
	};

	/**
	 * Set/remove the loading body class to show or hide the loading indicator after pull down.
	 */
	var _setBodyClass = function() {
		if ( !options.loadingFunction ) {
			return;
		}
		if ( pan.distance > options.distanceToRefresh ) {
			bodyClass.add( 'ptr-refresh' );
		} else {
			bodyClass.remove( 'ptr-refresh' );
		}
	};

	/**
	 * Determine how to animate and position elements when the panend event fires.
	 *
	 * @param {object} e - Event object
	 */
	var onPanEnd = function(e) {
		if ( ! pan.enabled  || pan.distance === 0) {
			return;
		}

		if(options.isLoading){

		}

		// e.preventDefault();

		options.contentEl.style.transform = options.contentEl.style.webkitTransform = '';
		options.ptrEl.style.transform = options.ptrEl.style.webkitTransform = '';

		if ( options.parentEl.classList.contains( 'ptr-refresh' ) && !options.isLoading) {
			_doLoading();
		} else {
			if(!options.isLoading && !options.isLoadingDown){
				_doReset();
			}
		}

		pan.distance = 0;
		pan.enabled = false;
	};

	/**
	 * Position content and refresh elements to show that loading is taking place.
	 */
	var _doLoading = function() {
		if(options.isLoading || options.isLoadingDown){
			return;
		}
		bodyClass.add( 'ptr-loading' );
		options.isLoading = true;
		options.contentEl.classList.add("ptr-content-load");
		// console.log("donling");
		// If no valid loading function exists, just reset elements
		if ( ! options.loadingFunction ) {
			return _doReset();
		}

		// The loading function should return a promise
		var loadingPromise = options.loadingFunction();

		// For UX continuity, make sure we show loading for at least one second before resetting
		setTimeout( function() {
			// Once actual loading is complete, reset pull to refresh
			loadingPromise.then( _doReset );
		}, 1000 );
	};

	var bodyClassRemove = function() {
		bodyClass.remove( 'ptr-reset' );
		options.contentEl.classList.remove("ptr-content-load");
		// console.log((options),"end");
		options.ptrEl.style.visibility = "hidden";
		options.isLoading = false;

		options.contentEl.style.transform = options.contentEl.style.webkitTransform = '';
		options.ptrEl.style.transform = options.ptrEl.style.webkitTransform = '';

		// pan.distance = 0;
		// pan.enabled = true;
		//options.parentEl.removeEventListener( 'transitionend', bodyClassRemove, false );
	};

	/**
	 * Reset all elements to their starting positions before any paning took place.
	 */
	var _doReset = function() {
		//options.parentEl.addEventListener( 'transitionend', bodyClassRemove, false );
		setTimeout(function () {
			bodyClassRemove();
		},200);
		bodyClass.remove( 'ptr-loading' );
		bodyClass.remove( 'ptr-refresh' );

		bodyClass.add( 'ptr-reset' );

		// console.log("ddd");

		// console.log(("reset"));

	};

	return {
		destroy: function () {
			// _doReset();
			bodyClass.remove( 'ptr-loading' );
			bodyClass.remove( 'ptr-refresh' );
			bodyClassRemove();

			options.parentEl.removeEventListener("scroll", onScroll);
			// options.parentEl.addEventListener("touchstart", onTouchStart, false);
			options.hammer.destroy();
			delete options.parentEl;
			delete options.ptrEl;
			delete options.contentEl;
			defaults.loadDown = null;
			defaults.loadUp = null;
			options.loadingDownFunction = null;
			options.loadingFunction = null;
		},
		init: init
	};
};

export default Ptr;