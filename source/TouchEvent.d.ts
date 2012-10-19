interface ITouch {
    identifier:number;
    target:EventTarget;
    screenX:number;
    screenY:number;
    clientX:number;
    clientY:number;
    pageX:number;
    pageY:number;
};

interface ITouchList {
    length:number;
    item (index:number):ITouch;
    identifiedTouch(identifier:number):ITouch;
};

interface ITouchEvent extends UIEvent {
    touches:ITouchList;
    targetTouches:ITouchList;
    changedTouches:ITouchList;
    altKey:bool;
    metaKey:bool;
    ctrlKey:bool;
    shiftKey:bool;
    initTouchEvent (type:string, canBubble:bool, cancelable:bool, view:AbstractView, detail:number, ctrlKey:bool, altKey:bool, shiftKey:bool, metaKey:bool, touches:ITouchList, targetTouches:ITouchList, changedTouches:ITouchList);
};

declare var ITouchEvent: {
    prototype: ITouchEvent;
    new(): ITouchEvent;
}

//
// add touch events to HTMLElement
//
interface HTMLElement extends Element, MSHTMLElementRangeExtensions, ElementCSSInlineStyle, MSEventAttachmentTarget, MSHTMLElementExtensions, MSNodeExtensions {
    ontouchstart: (ev: ITouchEvent) => any;
    ontouchmove: (ev: ITouchEvent) => any;
    ontouchend: (ev: ITouchEvent) => any;
    ontouchcancel: (ev: ITouchEvent) => any;
}