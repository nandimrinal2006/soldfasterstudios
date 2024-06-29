 
    //*********************************************
    //  CHECK THE DEVICE AND BROWSER SUPPORTS FIRST
    //*********************************************

    // Check the device for mobile or desktop
        var mobile = false;
        function checkTheDevice() {
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 992 ) {
                    mobile = true;
                    document.body.classList.add("mobile");
                    document.querySelectorAll('.animated').forEach(el => el.classList.add("visible"));
                }
            else{ mobile = false; document.body.classList.remove("mobile") }
        }
    //Run the device control and check with window resize
        checkTheDevice();
        window.addEventListener("resize", checkTheDevice);

    // Check the browsers
        // Opera 8.0+
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
            // Firefox 1.0+
            isFirefox = typeof InstallTrigger != 'undefined',
            // Safari 3.0+ "[object HTMLElementConstructor]"
            isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification),
            // Internet Explorer 6-11
            isIE = /*@cc_on!@*/false || !!document.documentMode,
            // Edge 20+
            isEdge = !isIE && !!window.StyleMedia,
            // Chrome 1+
            isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
            // Blink engine detection
            isBlink = (isChrome || isOpera) && !!window.CSS,
            // Parallax effects for selected browsers
            isParallaxBrowsers =  (isOpera || isFirefox || isBlink || isChrome);

    //For Live Projects
    //Give their background images
    //Get all data-background, data-bg and data-bg-mobile attributes
        var dataBg = document.querySelectorAll("[data-background]");
            dataBgMobile = document.querySelectorAll("[data-bg-mobile]"),
            lazyLoadedBG = document.querySelectorAll("[data-bg]");
        function getBg(){Array.prototype.forEach.call(dataBg, function(el){var bgImg = el.dataset.background;el.style.backgroundImage = 'url('+ bgImg +')';});}
        function getMobileBG(){Array.prototype.forEach.call(dataBgMobile, function(el){var bgImg = el.getAttribute("data-bg-mobile");el.style.backgroundImage = 'url('+ bgImg +')';});}
        function getLoadedBg(){Array.prototype.forEach.call(lazyLoadedBG, function(el){var bgImg = el.getAttribute("data-bg");el.style.backgroundImage = 'url('+ bgImg +')';});}

    //Start all lazy loads
        lazyLoadAll = "[data-bg]:not(.bg-mobiled), [data-src]";
        var peraLazyLoad = new LazyLoad({
            elements_selector: lazyLoadAll,
        });
        window.lazyLoadOptions = {
            threshold: 0,
            // Assign the callbacks defined above
        };

    //Add active class to ".link-active" a elements.
        var url = window.location.href;
        var lastPart = url.replace(/.*\//, ""); 
        document.querySelectorAll('a.link-active[href="'+ lastPart + '"]').forEach( function(elem){
            elem.classList.add("active");
        });

    //Window on load function
        function onLoadFunction(e){

            //Body ready
            document.body.classList.add("ready");

            //Call youtube functions if page has an embed player
            var youtubeEmbedElement = document.getElementById("youtubeVideo") || false;
            if (youtubeEmbedElement) {
                youtubeVideo();
            }

            //Hide loader
            var loader = document.querySelector('.loader-wrapper') || false;
            if (loader){
                setTimeout(function() {document.querySelector('.loader-wrapper').classList.add("none");}, 2000);
            }
            

            if (mobile === true) {
                getBg();getMobileBG();
            } else{
                getBg();
            }
            onResizeFunction();
            animatedItems();
            animatedConts();

            //Scroll smoothly
            var smoothLink = document.querySelectorAll("a[href^='#']:not([href='#']):not(.no-scroll):not([data-slide]):not([data-toggle])");
            smoothLink.forEach(e => e.addEventListener("click", function(event){
                var anchor = e.getAttribute("href"),
                    anchorElem = document.querySelector(anchor),
                    navOffset = themeNav.getAttribute("data-offset");
                if (anchor == "#top") {
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth",
                    });
                } else if (anchorElem) {
                    var trgt = anchorElem.offsetTop - navOffset;
                    window.scrollTo({
                        top: trgt,
                        left: 0,
                        behavior: "smooth",
                    });
                } else{
                    alert("The section ("+ anchor +") is not available on this page.");
                }
                event.preventDefault();
            }));
        };
    //Trigger load function when window loaded
        window.addEventListener("load", onLoadFunction);

    // Youtube Player Functions
        function youtubeVideo(){
            var youtubeEmbedElement = document.getElementById("youtubeVideo") || false;
            if (youtubeEmbedElement) {
                // Add YouTube API script
                var tag = document.createElement("script");
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName("script")[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                var player;
                var videoId = youtubeEmbedElement.dataset.videoId;
                var startSeconds = youtubeEmbedElement.getAttribute("data-startAt");
                var endSeconds = youtubeEmbedElement.getAttribute("data-endAt");

                onYouTubeIframeAPIReady = function () {
                  player = new YT.Player("youtubeVideo", {
                    videoId: videoId, // YouTube Video ID
                    playerVars: {
                      autoplay: 1, // Auto-play the video on load
                      autohide: 1, // Hide video controls when playing
                      disablekb: 1,
                      controls: 0, // Hide pause/play buttons in player
                      showinfo: 0, // Hide the video title
                      modestbranding: 1, // Hide the Youtube Logo
                      loop: 1, // Run the video in a loop
                      fs: 0, // Hide the full screen button
                      rel: 1, // Disable related videos
                      modestbranding: 0,
                      playsinline: 1,
                      enablejsapi: 1,
                      start: startSeconds,
                      end: endSeconds
                    },
                    events: {
                      onReady: function (e) {
                        e.target.mute();
                        e.target.playVideo();
                        e.target.setPlaybackQuality('highres');
                        setTimeout( function(){
                            document.body.classList.add("youtube-video-ready")
                        }, 1200)
                      },
                      onStateChange: function (e) {
                        e.target.playVideo();
                        if (e.data === YT.PlayerState.PLAYING) {
                            document.getElementById("youtubeVideo").classList.add("loaded");
                        }

                        if (e.data === YT.PlayerState.ENDED) {
                            // Loop from starting point
                            player.seekTo(startSeconds);
                        }

                        if (e.data == YT.PlayerState.BUFFERING) {
                            e.target.setPlaybackQuality('highres');
                        }
                      }
                    }
                  });
                  var muteButton = document.querySelector(".muteToggle") || false;
                  if (muteButton) {
                    muteButton.addEventListener("click", function(){
                        if (player.isMuted()) {
                            player.unMute();
                            muteButton.classList.add("active");
                        } else{
                            player.mute();
                            muteButton.classList.remove("active");
                            }
                    });
                  }
                  

                };
            }
        }

    //Work .active-inview elements with inview classes.
        inView('.active-inview')
            .on('enter', el => {
                el.classList.add("inview");
            })
            .on('exit', el => {
                el.classList.remove("inview");
        });

    //Get text color from data-color attribute.
        var colorItem = document.querySelectorAll("[data-color]");
        Array.prototype.forEach.call(colorItem, function(el){
            var colorOfElem = el.dataset.color;
            el.style.color = colorOfElem;
        });

    //Get background color from data-bgcolor attribute.
        var bgColorItem = document.querySelectorAll("[data-bgcolor]");
        Array.prototype.forEach.call(bgColorItem, function(el){
            var bgColorOfElem = el.dataset.bgcolor;
            el.style.backgroundColor = bgColorOfElem;
        });

    //Get border color from data-bcolor attribute.
        var bColorItem = document.querySelectorAll("[data-bcolor]");
        Array.prototype.forEach.call(bColorItem, function(el){
            var bColorOfElem = el.dataset.bcolor;
            el.style.borderColor = bColorOfElem;
        });

    //Stay when click on this items.
        document.querySelectorAll('.stay').forEach(el =>
            el.addEventListener("click", function(elem){elem.preventDefault();})
        );

    //Animated items
        var animatedItems = function() {
            if ( mobile === false ) {
                //Animations for single items
                var elems = document.querySelectorAll(".animated");
                Array.prototype.forEach.call(elems, function(el){
                    if (el.getBoundingClientRect().top < window.scrollY && !document.body.classList.contains("animation-page")) {
                        el.classList.remove("animated");
                        el.removeAttribute("data-animation");
                        el.removeAttribute("data-animation-delay");
                    } else{
                        elems = document.querySelectorAll(".animated");
                        inView(".animated").on('enter', elem => {
                            if (!el.classList.contains("visible")) {
                                var delay = elem.getAttribute('data-animation-delay'),
                                    animation = elem.getAttribute('data-animation');
                                setTimeout(function() {elem.classList.add(animation, "visible");}, delay);
                            }
                        });
                        inView.offset({
                            top: 0,
                            bottom: 150,
                        });
                    }
                });
            }
        }
        
    //Animated items -- Trigger all animations when container inview.
        var animatedConts = function() {
            if ( mobile === false ) {
                //Animations for single items
                var elems = document.querySelectorAll(".animated-container");
                Array.prototype.forEach.call(elems, function(el){
                    inView(".animated-container").on('enter', elem => {
                        var inels = elem.querySelectorAll(".animated");
                        Array.prototype.forEach.call(inels, function(els){
                            if (!els.classList.contains("visible")) {
                                var delay = els.getAttribute('data-animation-delay'),
                                    animation = els.getAttribute('data-animation');
                                setTimeout(function() {els.classList.add(animation, "visible");}, delay);
                            }
                        });
                    });
                    inView.offset({
                        top: 0,
                        bottom: 150,
                    });
                });
            }
        }
    //Animations with hovers
        var hoverAnimations = function() {
            //Animations for single items - This animations can play on mobile
            var hoverConts = document.querySelectorAll(".has-overlay-hover");
            Array.prototype.forEach.call(hoverConts, function(elem){
                var elems = elem.querySelectorAll(".animated-hover");
                //On hover and touch start events
                function onHover(){
                    Array.prototype.forEach.call(elems, function(el){
                        var delay = el.getAttribute('data-animation-delay'),
                        animation = el.getAttribute('data-animation');
                        setTimeout(function() {el.classList.add(animation, "visible");}, delay);
                    });
                }
                elem.addEventListener('mouseenter', onHover);
                elem.addEventListener('touchstart', onHover);
                //Mouse leave event
                function outHover(){
                    Array.prototype.forEach.call(elems, function(el){
                        var delay = el.getAttribute('data-animation-delay'),
                        animation = el.getAttribute('data-animation');
                        el.classList.remove(animation, "visible");
                    });
                }
                elem.addEventListener('mouseleave', outHover);
            });
        }
        hoverAnimations();
    //Get active class for Bootstrap Accordions
        var accBar = document.querySelectorAll(".acc-bar");
        accBar.forEach(e => e.addEventListener("click", function(){
            var inActiveBars = document.querySelectorAll("[aria-expanded='false']");
                inActiveBars.forEach(elem => elem.classList.remove("active"));
            if (e.getAttribute("aria-expanded") === "true") {e.classList.add("active")}
        }));




    //Shuffle - Filtering and masonry portfolio items
        var Shuffle = window.Shuffle;
        var portfolio = document.getElementById("portfolio");
        class Demo {
            constructor(element) {
                this.element = element;
                this.shuffle = new Shuffle(element, {
                    itemSelector: '.work-item',
                    buffer: 0, // Useful for percentage based heights when they might not always be exactly the same (in pixels).
                    columnThreshold: 0.01, // Reading the width of elements isn't precise enough and can cause columns to jump between values.
                    columnWidth: 0, // A static number or function that returns a number which tells the plugin how wide the columns are (in pixels).
                    delimiter: ' ', // If your group is not json, and is comma delimited, you could set delimiter to ','.
                    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // CSS easing function to use.
                    filterMode: Shuffle.FilterMode.ANY, // When using an array with filter(), the element passes the test if any of its groups are in the array. With "all", the element only passes if all groups are in the array.
                    group: "", // Initial filter group.
                    gutterWidth: 0, // A static number or function that tells the plugin how wide the gutters between columns are (in pixels).
                    initialSort: null, // Shuffle can be initialized with a sort object. It is the same object given to the sort method.
                    isCentered: true, // Attempt to center grid items in each row.
                    isRTL: false, // Attempt to align grid items to right.
                    roundTransforms: true, // Whether to round pixel values used in translate(x, y). This usually avoids blurriness.
                    sizer: null, // Element or selector string. Use an element to determine the size of columns and gutters.
                    speed: 450, // Transition/animation speed (milliseconds).
                    staggerAmount: 15, // Transition delay offset for each item in milliseconds.
                    staggerAmountMax: 150, // Maximum stagger delay in milliseconds.
                    throttleTime: 5, // How often shuffle can be called on resize (in milliseconds).
                    useTransforms: true, // Whether to use transforms or absolute positioning.
                });
                // Log events.
                this._activeFilters = [];
                this.addFilterButtons();
                this.checkLightboxElems();
            }
            addFilterButtons() {
                const options = document.querySelector('.filter-options');
                if (!options) {return;}
                const filterButtons = Array.from(options.children);
                const onClick = this._handleFilterClick.bind(this);
                filterButtons.forEach((button) => {
                    button.addEventListener('click', onClick, false);
                });
            }
            _handleFilterClick(evt) {
                const btn = evt.currentTarget;
                const btnGroup = btn.getAttribute('data-group');
                this._removeActiveClassFromChildren(btn.parentNode);
                let filterGroup;
                btn.classList.add('active');
                filterGroup = btnGroup;
                this.shuffle.filter(filterGroup);
                this.checkLightboxElems();
            }
            _removeActiveClassFromChildren(parent) {
                const { children } = parent;
                for (let i = children.length - 1; i >= 0; i--) {
                    children[i].classList.remove('active');
                }
            }
            checkLightboxElems(elems) {
                var cont = document.querySelector("[data-default-filter]") || false;
                if (cont) {
                    var elems = cont.querySelectorAll("a");
                    elems.forEach(el => el.removeAttribute("data-fslightbox"));
                    cont.querySelectorAll("figure.shuffle-item--visible figcaption a").forEach(el => el.setAttribute('data-fslightbox', 'portfolio'));
                    refreshFsLightbox();
                }
                
            }
        }
        if (portfolio) {
            document.addEventListener('DOMContentLoaded', () => {
                window.demo = new Demo(portfolio);
            });
        }
    //Popovers
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
             return new bootstrap.Popover(popoverTriggerEl)
        });
    //Call parallax effect and get parallax containers
        var parallaxElem = document.querySelector(".parallax") || false;
        if (mobile === false && parallaxElem) {
            var parallaxElem = document.querySelectorAll(".parallax");
            Array.prototype.forEach.call(parallaxElem, function(elem){
                elem.parentNode.classList.add('has-parallax');
            });
            //Ready skrollr effects
            var s = skrollr.init({
                forceHeight: false,
                smoothScrolling: false
            });
        }
    //Fade out function
        function fadeOut(el) {
            el.style.opacity = 1;
            (function fade() {
                if ((el.style.opacity -= .1) < 0) {
                    el.style.display = "none";
                } else {
                    requestAnimationFrame(fade);
                }
            })();
        };

    //Fade in function
        function fadeIn(el, display) {
            el.style.opacity = 0;
            el.style.display = display || "block";
            (function fade() {
                var val = parseFloat(el.style.opacity);
                if (!((val += .1) > 1)) {
                    el.style.opacity = val;
                    requestAnimationFrame(fade);
                }
            })();
        };
    //Call Easy Pie Chart plugin
        var pieChartElem = document.querySelectorAll('.pie-chart');
        if (pieChartElem) {
            inView(".pie-chart").once('enter', elem => {
                Array.prototype.forEach.call(pieChartElem, function(el){
                    var size = el.getAttribute("data-size"),
                        lineColor = el.getAttribute("data-line-color"),
                        elWidth = el.getAttribute("data-line-width");
                    el.style.height = size + "px";
                    new EasyPieChart(el, {
                        barColor: lineColor,
                        trackColor: 'rgba(127,127,127,0.09)',
                        scaleColor: 'transparent',
                        scaleLength: 5,
                        lineCap: 'round',
                        lineWidth: elWidth,
                        trackWidth: elWidth,
                        size: size,
                        rotate: 0,
                        animate: {
                            duration: 1600,
                            enabled: true
                        }
                    });
                });
            });
        }
    //Hide with scroll down - Back to top button  elements
        const hideByScroll = document.querySelector(".hide-by-scroll");
        var prevScrollpos = window.scrollY;
        if (window.scrollY < 250) {document.body.classList.add("welcome-home");}
        window.addEventListener("scroll", function() {
            // You can add .hide-on-home class to any fixed item. It will be invisible on home and visible when you scroll down.
            if (window.scrollY > 250) {document.body.classList.remove("welcome-home");}
            else { document.body.classList.add("welcome-home");  }

            if ( hideByScroll){
                // show hide subnav depending on scroll direction
                var currentScrollPos = window.scrollY;
                if (prevScrollpos > currentScrollPos) {
                    hideByScroll.classList.remove("hiding");
                } else if (currentScrollPos > 700) {
                    document.querySelector(".hide-by-scroll:not(.modern-nav.active):not(.mouseover)").classList.add("hiding");
                }
                prevScrollpos = currentScrollPos;
            }
        });

        document.onmousemove = function(event) {
            var cursorCoords = event.clientY;
            if ( cursorCoords <= 80 && themeNav.classList.contains("hiding") ) {
                themeNav.classList.remove("hiding");
            }
        }

    //Counter animations
        function counterAnimationHandler() {
            const counters = document.querySelectorAll('.counter ')
            counters.forEach(counter => {
            counter.querySelector("span").innerText = '0' //set default counter value
            counter.dataset.count = 0;
            const updateCounter = () => {
                const target = +counter.getAttribute('data-target') //define increase couter to it's data-target
                const count = +counter.dataset.count //define increase couter on innerText

                const increment = target / 200 // define increment as counter increase value / speed

                if (count < target) {
                    const newCount = Math.ceil(count + increment);
                    counter.dataset.count = newCount;
                    counter.querySelector("span").innerText = numberWithCommas(newCount);
                    setTimeout(updateCounter, 9);
                } else {
                    counter.querySelector("span").innerText = numberWithCommas(target); //if default value is bigger that date-target, show data-target
                }
            }

                updateCounter() //call the function event
            })

            function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        }
        inView(".counter").once('enter', elem => {
            counterAnimationHandler();
        });
        inView.offset({
            top: 0,
            bottom: 150,
        });

    //Call content slider
        var swiperContent = new Swiper(".content-slider", {
            grabCursor: true,
            effect: "creative",
            speed: 550, // 1000 = 1 second
            spaceBetween: 0,
            loop: true,
            slidesPerView: 2,
            navigation: {
                nextEl: '.content-slider-next',
                prevEl: '.content-slider-prev',
            },
            creativeEffect: {
                progressMultiplier: true,
                limitProgress: 2,
                shadowPerProgress: true,
                prev: {
                    shadow: false,
                    translate: ["-20%", 0, -500],
                    opacity: 0,
                    rotate: [0, 30, 0],
                },
                next: {
                    translate: ["100%", 0, -0],
                },
            },
        });

    //Call content slider
        var swiperText = new Swiper(".text-slider", {
            grabCursor: false,
            effect: "fade",
            touchRatio: 1,
            speed: 750, // 1000 = 1 second
            autoHeight: true,
            autoplay: {
                delay: 5000,
            },
            navigation: {
                nextEl: '.text-slider-next',
                prevEl: '.text-slider-prev',
            },
            spaceBetween: 0,
            loop: true,
            slidesPerView: 1,
            fade: {
                crossFade: true,
            },
        });

    //Create a custom slider for home pages
        //This is delay for next/play buttons and pagination areas. - You can set autoplay delays on data-attributes of slides for each slide.
        var swiperDelay = 1000;
        //Call Swiper Slider For Home V3
        const swiperHome = new Swiper('.custom-slider', {
            effect: 'fade', // 'slide', 'fade', 'cube', 'coverflow', 'flip', 'cards'
            speed: 600, // 1000 = 1 second
            loop: true,
            touchRatio: 0,
            followFinger: false,
            fade: {
                crossFade: true,
            },
            autoplay: {
                delay: 12000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true,
                dynamicBullets: true,
              },
            navigation: {
                nextEl: '.slider-next',
                prevEl: '.slider-prev',
            },
            on: {
                resize: function () {
                    swiperHome.update();
                },
                slideChange: function () {
                    //Reset background images
                    var dataBg = document.querySelectorAll("[data-background]"); dataBgMobile = document.querySelectorAll("[data-bg-mobile]"), lazyLoadedBG = document.querySelectorAll("[data-bg]");
                    if (mobile === true) {getBg();getMobileBG();} else{getBg();getLoadedBg(); peraLazyLoad.update()}
                    //Get the elements
                    var animatedItem = document.querySelectorAll(".swiper-slide-visible .animate");
                    //Set elements classes with their animations and delays
                    Array.prototype.forEach.call(animatedItem, function(el){
                        var delay = el.getAttribute('data-animation-delay'),
                            animation = el.getAttribute('data-animation');
                        setTimeout(function() {el.classList.add(animation, "visibleme");}, delay);
                    });

                    if (document.querySelector(".swiper-slide-visible").classList.contains("nav-to--dark")) {
                        var nav = document.querySelector(".modern-nav");
                        nav.classList.add("details-dark");
                        nav.classList.remove("details-white");
                    }
                    if (document.querySelector(".swiper-slide-visible").classList.contains("nav-to--white")) {
                        var nav = document.querySelector(".modern-nav");
                        nav.classList.remove("details-dark");
                        nav.classList.add("details-white");
                    }
                },
                slideChangeTransitionEnd: function () {
                    //Get the elements
                    var hidingItem = document.querySelectorAll(".custom-slider .swiper-slide:not(.swiper-slide-visible) .animate");
                    //Set elements classes with their animations
                    Array.prototype.forEach.call(hidingItem, function(el){
                        var animation = el.getAttribute('data-animation');
                        el.classList.remove(animation, "visibleme");
                    });
                }

            }
        });
        //Go to slide (data-slide-target attribute) function 
        var goToSlide = document.querySelectorAll("[data-slide-target]");
        Array.prototype.forEach.call(goToSlide, function(el){
            el.addEventListener("click", function(elem){
                var slideTarget = el.getAttribute("data-slide-target");
                swiperHome.slideTo(slideTarget); elem.preventDefault();
            });
        });
        //Get active class according to slide number
        var slideTargetItem = document.querySelector("[data-slide-target]") || false;
        if (slideTargetItem) {
            swiperHome.on('slideChange', function () {
                var slideTargetItem = document.querySelectorAll("[data-slide-target]");
                slideTargetItem.forEach(e => e.classList.remove("active"));
                var currentIndex = swiperHome.realIndex + 1;
                document.querySelector("[data-slide-target='"+ currentIndex +"']").classList.add("active");
                document.querySelectorAll(".disable-me").forEach( e => e.style.pointerEvents = "none" );
                setTimeout(function(){ document.querySelectorAll(".disable-me").forEach( e => e.style.pointerEvents = "all" )}, swiperDelay);
            });
        }

    //*********************************************
    //  NAVIGATION SCRIPTS
    //*********************************************

        var themeNav = document.getElementById('navigation') || false;
        var navMenu = themeNav.querySelector('.nav-menu');
        var navLink = themeNav.querySelectorAll('.nav-link:not([data-toggle="dropdown-menu"])');
        var burgerMenu = document.getElementById('hamburger-menu') || false;
        var overlayMenu = document.getElementById('mobile-nav-bg') || false;

        //Scroll Spy
        if (document.querySelector(".modern-nav .nav-menu a[href^='#']:not([href='#'])")) {
            var scrollSpy = new bootstrap.ScrollSpy(document.body, { target: ".modern-nav .nav-menu", offset: 150 });
        }
        if (document.querySelector(".scroll-spy")) {
            var scrollSpy = new bootstrap.ScrollSpy(document.body, { target: ".scroll-spy", offset: 150 });
        }

        // Toggle Menu Function
        if (burgerMenu) {burgerMenu.addEventListener('click', toggleMenu);}
        if (overlayMenu) {overlayMenu.addEventListener('click', toggleMenu);}
        navLink.forEach(function(item){item.addEventListener('click', toggleMenu)});

        //Toggle active class for overlay and themenav
        function toggleMenu() {
            if (themeNav && themeNav.classList.contains("active")) {
                overlayMenu.classList.remove('animate');
                navMenu.classList.remove('animate');
                setTimeout(function(){ themeNav.classList.remove('active'); }, 350);
                var toggleElem = themeNav.querySelectorAll('.showing');
                Array.prototype.forEach.call(toggleElem, function(el){
                    el.classList.remove("showing");
                    el.querySelector(".dropdown-menu").style.maxHeight = "0px";
                });
            } else{
                themeNav.classList.add('active');
                navMenu.classList.add('animate');
                setTimeout(function(){ overlayMenu.classList.add('animate'); }, 100);
            }
            
        }

        //Navigation get mouseover class
        function navOver() {themeNav.classList.add("mouseover")}
        function navOut() {themeNav.classList.remove("mouseover")}
        themeNav.addEventListener("mouseover", navOver, false);
        themeNav.addEventListener("mouseout", navOut, false);

        // Collapse SubMenu Function
        themeNav.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-toggle') && window.innerWidth <= 992) {
                e.preventDefault();
                const menuItemHasChildren = e.target.parentElement;

                // If menu-item-child is Expanded, then Collapse It
                if (menuItemHasChildren.classList.contains('showing')) {
                    collapseSubMenu();
                } else {
                    // Collapse the Existing Expanded menu-item-child
                    if (themeNav.querySelector('.dd-toggle.showing')) {
                        collapseSubMenu();
                    }
                    // Expanded the New menu-item-child
                    menuItemHasChildren.classList.add('showing');
                    const subMenu = menuItemHasChildren.querySelector('.dropdown-menu');
                    subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
                }
            }
        });

        function collapseSubMenu() {
            themeNav.querySelector('.dd-toggle.showing .dropdown-menu').removeAttribute('style');
            themeNav.querySelector('.dd-toggle.showing').classList.remove('showing');
        }

        // Fixed Resize Screen Function
        function onResizeFunction (e){
            if (this.innerWidth > 992) {
                // If themeNav is Open, then Close It
                if (themeNav.classList.contains('showing')) {
                    toggleMenu();
                }

                // If menu-item-child is Expanded, then Collapse It
                if (themeNav.querySelector('.dd-toggle.showing')) {
                    collapseSubMenu();
                }
            }
            if (mobile === true) {
                getBg();
                getMobileBG();
            } else{
                getBg();
                getLoadedBg();
            }
        };
        window.addEventListener("resize", onResizeFunction);

        //Add scrolled class when scroll down
        function getScrolledClass() {
            if (window.scrollY > 70) {
                if (themeNav.classList.contains("sticky") || themeNav.classList.contains("fixed") ) {
                    themeNav.classList.add("scrolled");
                    if (document.querySelector(".modern-nav .top-bar:not(.cookie)") || document.querySelector(".modern-nav.has-header-cookie-bar .cookie-active") ) {
                        if (mobile === false) {
                            var barH = document.querySelector(".modern-nav .top-bar").offsetHeight;
                            themeNav.css({"-webkit-transform":"translateY(-"+ barH + "px" + ")", "transform":"translateY(-" + barH + "px" + ")"});
                        }
                    }
                }
            }
            else {
                themeNav.classList.remove("scrolled");
                if (document.querySelector(".modern-nav .top-bar")) {
                    var barH = document.querySelector(".modern-nav .top-bar").offsetHeight;
                }
                themeNav.style = "-webkit-transform: none; transform: none; ";
            }
        } getScrolledClass();

        var scroll = function () {
            getScrolledClass();
            if(window.scrollY + window.innerHeight === document.innerHeight) {
                hideByScroll.classList.remove('hiding');
            }
        };

        var waiting = false, endScrollHandle;
        window.addEventListener('scroll', function(){
            if (waiting) { return; }
            waiting = true;
            // clear previous scheduled endScrollHandle
            clearTimeout(endScrollHandle);
            scroll();
            setTimeout(function () {
                waiting = false;
            }, 50);
            // schedule an extra execution of scroll() after 200ms
            // in case the scrolling stops in next 100ms
            endScrollHandle = setTimeout(function () { scroll(); }, 50);
        });


    //Text rotator animation, if page has.
        var textRotator = document.querySelector(".text-rotator") || false;
        if (textRotator) {
            var textRotator = document.querySelectorAll(".text-rotator");
            Array.prototype.forEach.call(textRotator, function(el){
                var words = el.getElementsByClassName('word');
                var wordArray = [];
                var currentWord = 0;

                for (var i = 0; i < words.length; i++) {splitLetters(words[i]);}
                function changeWord() {
                    var cw = wordArray[currentWord], nw = currentWord == words.length - 1 ? wordArray[0] : wordArray[currentWord + 1];
                    for (var i = 0; i < cw.length; i++) {animateLetterOut(cw, i);}
                    for (var i = 0; i < nw.length; i++) { nw[i].className = 'letter behind'; nw[0].parentElement.style.opacity = 1; animateLetterIn(nw, i);}
                    currentWord = (currentWord == wordArray.length - 1) ? 0 : currentWord + 1;
                }
                function animateLetterOut(cw, i) {
                    setTimeout(function() {
                        cw[i].className = 'letter out';
                    }, i * 30);
                }
                function animateLetterIn(nw, i) {
                    setTimeout(function() { el.style.width = nw[i].parentElement.offsetWidth + 'px'; el.style.height = nw[i].parentElement.offsetHeight + 'px'; nw[i].className = 'letter in'; }, 250 + (i * 30));
                }
                function splitLetters(word) {
                    var content = word.innerHTML;
                    word.innerHTML = '';
                    var letters = [];
                    for (var i = 0; i < content.length; i++) {
                        var letter = document.createElement('span');
                        letter.className = 'letter';
                        var char = content.charAt(i);
                        letter.innerHTML = char;
                        word.appendChild(letter);
                        letters.push(letter);
                    }

                    wordArray.push(letters);
                }
                var speed = el.getAttribute("data-speed");
                var inviewInternal = setInterval(changeWord, speed);
                inView('.text-rotator').on('enter', el => {
                    changeWord();
                    clearInterval(inviewInternal);
                    inviewInternal = setInterval(changeWord, speed);
                }).on('exit', e => {
                    clearInterval(inviewInternal);
                    inviewInternal = setInterval(changeWord, 100000);
                });
            });
        }



    // Validate all ".validate-me" forms with animations
        (function () {
            'use strict'

            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.querySelectorAll('.validate-me')

            // Loop over them and prevent submission
            Array.prototype.slice.call(forms).forEach(function (form) {
                var checkValidForEach = function () {
                    var invalidElem = form.querySelector("[required]:invalid");
                    if (!invalidElem) {
                        form.classList.remove("no-valid");
                    }
                }
                form.addEventListener('keyup', checkValidForEach, false); 
                form.addEventListener('change', checkValidForEach, false); 
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        form.classList.add("no-valid");
                        form.querySelector("[required]:invalid").focus();
                        event.preventDefault()
                        event.stopPropagation()
                    } else{

                        //Animations for contact form
                        if (form.getAttribute("id") === "contact-form") {
                            var formCont = document.querySelector("#contact-form-container"),
                                formWrapper = document.querySelector(".contact-form-wrapper"),
                                successWrapper = document.querySelector(".success-message-wrapper"),
                                formH = formCont.offsetHeight + "px";
                                formCont.style.height = formH;
                            //Directly
                            setTimeout(function() {
                                formCont.classList.add("success");
                            }, 0);
                            //After half second
                            setTimeout(function() {
                                formWrapper.classList.add("none");
                                successWrapper.classList.remove("none");
                                var successH = successWrapper.offsetHeight + "px";
                                formCont.style.height = successH;
                            }, 900);
                            //After half second - must be in different function
                            setTimeout(function() {
                                successWrapper.classList.add("ready");
                            }, 900);
                        }

                        //Animations for newsletter form
                        if (form.getAttribute("id") === "newsletter-form") {
                            var formContainer = form.querySelector(".form-container"),
                                newsTitle = document.querySelector(".newsletter-title"),
                                successMs = form.querySelector(".success-message");
                            //After 50ms
                            setTimeout(function() {
                                formContainer.classList.add("opacity-0", "hidden", "slow")
                                newsTitle.classList.add("opacity-0", "hidden");
                            }, 50);
                            //After 250ms
                            setTimeout(function() {
                                formContainer.classList.add("none")
                                successMs.classList.remove("none")
                                var startsWith = "height";
                                var classes = newsTitle.className.split(" ").filter(function(v) {
                                    return v.lastIndexOf(startsWith, 0) !== 0;
                                });
                                newsTitle.className = classes.join(" ").trim();
                                newsTitle.classList.add("height-0");
                            }, 250);
                            //After 700ms
                            setTimeout(function() {
                                successMs.classList.remove("opacity-0", "hidden")
                                newsTitle.classList.add("none");
                            }, 700);
                        }
                        
                        event.preventDefault();
                    }
                form.classList.add('was-validated')
                }, false)
            })
        })()

