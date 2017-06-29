//TransitionEventHandler.js

import {on, off} from '../common/util.js';

//EVENT_NAME_MAP 用来决定哪种事件种类在 transition/animation end 时该被触发。
const EVENT_NAME_MAP = {
    transitionend: {
        'transition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'mozTransitionEnd',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd'
    },

    animationend: {
        'animation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd',
        'MozAnimation': 'mozAnimationEnd',
        'OAnimation': 'oAnimationEnd',
        'msAnimation': 'MSAnimationEnd'
    }
};

let endEvents = [];

//
const detectEvents = ()=>{
    let testEl = document.createElement('div');
    let style = testEl.style;

    if(!('AnimationEvent' in window)){
        delete EVENT_NAME_MAP.animationend.animation;
    }
    if(!('TransitionEvent' in window)){
        delete EVENT_NAME_MAP.animationend.transition;
    }

    for(let baseEventName in EVENT_NAME_MAP){
        let baseEvents = EVENT_NAME_MAP[baseEventName];
        for(let styleName in baseEvents){
            if(styleName in style){
                endEvents.push(baseEvents[styleName]);
                break;
            }
        }
    }
};

detectEvents();

const TransitionEventsHandler = {
    addEndEventListener(node, eventListener){
        if(endEvents.length === 0){
            //CSS transition not supported, use setTimeout run eventListener immediately.
            window.setTimeout(eventListener, 0);
        }
        endEvents.forEach((endEvent)=>{
            on(node, endEvent, eventListener, false);
        });
    },

    removeEndEventListener(node, eventListener){
        if(endEvents.length === 0){
            return;
        }
        endEvents.forEach((endEvent)=>{
            off(node, endEvent, eventListener, false);
        });
    }
};

export default TransitionEventsHandler;





