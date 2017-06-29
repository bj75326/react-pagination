//util.js

export const on = (element, type, handler, userCapture)=>{
    if(document.attachEvent){
        element.attachEvent('on' + type, handler);
    }else if(document.addEventListener){
        element.addEventListener(type, handler, userCapture);
    }
};

export const off = (element, type, handler, userCapture)=>{
    if(document.detachEvent){
        element.detachEvent('on' + type, handler);
    }else if(document.removeEventListener){
        element.removeEventListener(type, handler, userCapture);
    }
};