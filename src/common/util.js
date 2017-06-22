//util.js

export const on = (element, type, handler, userCapture)=>{
    if(document.attachEvent){
        element.attachEvent('on' + type, handler);
    }else if(document.addEventListener){
        element.addEventListener(type, handler, userCapture);
    }
};

export const off = ()=>{

};