window.onload = ()=> {
    const pageWidth = 750;
    let shiftLeft = 0;
    let curPage = 0;// start from 0
    const pageCount = document.getElementsByClassName('page').length;

    const iconWrapper = document.getElementsByClassName('icon-wrapper')[0];
    iconWrapper.style.width = pageCount * pageWidth + 'px';

    const pagination = document.getElementsByClassName('pagination')[0];
    // init pagination
    for (let i = 0; i < pageCount; i++) {
        const i = document.createElement('i');
        pagination.appendChild(i);
    }
    const paginationGroup = pagination.getElementsByTagName('i');
    paginationGroup[curPage].className = 'active';

    // touch/mouse event detect
    const eventMethod = {};
    if (window.hasOwnProperty('ontouchstart')) {
        eventMethod.type = 'touch';
        eventMethod.start = 'touchstart';
        eventMethod.move = 'touchmove';
        eventMethod.end = 'touchend';
    } else {
        eventMethod.type = 'mouse';
        eventMethod.start = 'mousedown';
        eventMethod.move = 'mousemove';
        eventMethod.end = 'mouseup';
    }

    iconWrapper.addEventListener(eventMethod.start, (event)=> {
        let xMove = 0;// shift in `x` direction
        let speed = 0;// time gap between every two movements, smaller is faster
        let hold = 0;// frame count when user hold mouse/hand, it will be recounted by any movement.
        const x = eventMethod.type === 'touch' ? event.targetTouches[0].pageX : event.clientX;
        let lastTime = Date.now();

        const timer = setInterval(()=> {
            hold += 1;
        }, 16);

        const moveEvent = (event)=> {
            event.preventDefault();
            const curX = eventMethod.type === 'touch' ? event.changedTouches[0].pageX : event.clientX;
            xMove = curX - x;
            hold = 0;

            const curTime = Date.now();
            speed = curTime - lastTime;
            lastTime = curTime;

            iconWrapper.style.marginLeft = shiftLeft + xMove + 'px';
        };

        const upEvent = (event)=> {
            clearInterval(timer);
            iconWrapper.removeEventListener(eventMethod.move, moveEvent);
            window.removeEventListener(eventMethod.end, upEvent);

            const distance = Math.abs(xMove);
            const maxSpeed = eventMethod.type === 'touch' ? 60 : 16;
            if (distance >= pageWidth / 2 || (hold < 2 && speed < maxSpeed && distance > 10)) {
                if (xMove < 0) {
                    // next page
                    shiftLeft = shiftLeft === -1 * pageWidth * (pageCount - 1) ? shiftLeft : shiftLeft - pageWidth;
                } else {
                    // prev page
                    shiftLeft = shiftLeft === 0 ? shiftLeft : shiftLeft + pageWidth;
                }
            }

            // do page change or restore, use css `transition` for animation
            iconWrapper.style.transition = '.3s ease-in-out';
            iconWrapper.style.marginLeft = shiftLeft + 'px';
            setTimeout(()=> {
                iconWrapper.style.transition = 'none';
                // update pagination
                const nextPage = Math.abs(shiftLeft / pageWidth);
                if (curPage !== nextPage) {
                    paginationGroup[curPage].className = '';
                    paginationGroup[nextPage].className = 'active';
                    curPage = nextPage;
                }
            }, 300);
        };

        iconWrapper.addEventListener(eventMethod.move, moveEvent);
        window.addEventListener(eventMethod.end, upEvent);
    });
};