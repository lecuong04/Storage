var supercopy = function(){
  var doc     = document;
  var head    = document.head;
  var body    = document.body;
  var html    = document.documentElement;
  var jQuery  = window.jQuery;
  var userSelectCss = 'user-select: text !important;-webkit-user-select: text !important;-webkit-touch-callout: text !important;';
  this.init = function(){
    single();
    repeat();
    special();
  };
  //单一动作
  var single = function(){
    html.onselectstart = html.oncopy = html.oncut = html.onpaste = html.onkeyup = html.onkeydown = html.oncontextmenu = html.onmousemove = html.onmousedown = html.onmouseup = html.ondragstart = null;
    body.onselectstart = body.oncopy = body.oncut = body.onpaste = body.onkeyup = body.onkeydown = body.oncontextmenu = body.onmousemove = body.onmousedown = body.onmouseup = body.ondragstart = null;
    doc.onselectstart = doc.oncopy = doc.oncut = doc.onpaste = doc.onkeyup = doc.onkeydown = doc.oncontextmenu = doc.onmousemove = doc.onmousedown = doc.onmouseup = doc.ondragstart = null;
    window.onkeyup = window.onkeydown = null;

    //删除body
    if(body.style.userSelect){
      body.setAttribute('style', userSelectCss);
    }
    if(html.style.userSelect){
      html.setAttribute('style', userSelectCss);
    }
    removeAttr(body);
    removeAttr(html);

    //添加user-select属性
    var cssid   = 'supercopy_user_select';
    if(!document.getElementById(cssid)){
      var element = document.createElement('style');
      element.id  = cssid;
      element.append('*{'+userSelectCss+'}');
      head.append(element);
    }

    ['copy','cut','contextmenu','selectstart','mousedown','mouseup','mousemove','keydown','keypress','keyup'].forEach(evt => {
      document.documentElement.addEventListener(evt, handler, {capture: true})
    });
  };

  //循环动作
  var repeat = function(){
    var labels          = ['html', 'body', 'div', 'p' , 'b' , 'strong' , 'small', 'span', 'pre', 'a' , 'form' , 'iframe', 'ul', 'li' ,'dl' , 'dt', 'dd', 'table', 'tr' ,'td' ,'h1' ,'h2' ,'h3' ,'h4' ,'h5' ,'h6'];
    var style;
    for (i in labels) {
      var divs = document.getElementsByTagName(labels[i]);
      var len = divs.length;
      for (var i = 0; i < len; ++i) {
        var obj  = divs[i];
        //CSS
        if(obj){
          style         = obj.currentStyle? obj.currentStyle : window.getComputedStyle(obj, null);
          if(style.userSelect == "none"){
            obj.setAttribute('style', userSelectCss);
          }
        }
        //Script
        removeAttr(obj);
        var actions     = ['select' ,'selectstart' ,'selectend', 'copy', 'cut', 'paste', 'keydown', 'keyup', 'keypress', 'contextmenu', 'dragstart'];
        for (j in actions) {
          obj.addEventListener(actions[j], handler);
        }
      }
    }
  };

  //特殊处理
  var special = function(){
    if(jQuery && jQuery(body) && (typeof jQuery(body).off) != "undefined"){
      jQuery(body).off('contextmenu copy cut beforecopy beforecut beforepaste');
    }
  };

  //
  var removeAttr = function (element) {
    element.removeAttribute('oncontextmenu');
    element.removeAttribute('ondragstart');
    element.removeAttribute('onselect');
    element.removeAttribute('onselectstart');
    element.removeAttribute('onselectend');
    element.removeAttribute('oncopy');
    element.removeAttribute('onbeforecopy');
    element.removeAttribute('oncut');
    element.removeAttribute('onpaste');
    element.removeAttribute('onclick');
    element.removeAttribute('onkeydown');
    element.removeAttribute('onkeyup');
    element.removeAttribute('onmousedown');
    element.removeAttribute('onmouseup');
    element.removeAttribute('unselectable');
    if(jQuery && jQuery(body) && (typeof jQuery(body).off) != "undefined"){
      jQuery(element).off('contextmenu copy cut beforecopy beforecut beforepaste');
      jQuery(element).unbind();
    }
  };

  //返回
  var handler = function (event) {
    event.stopPropagation();
    if(event.stopImmediatePropagation){event.stopImmediatePropagation();}
    event.returnValue = true;
  }
};
var copy = new supercopy();
copy.init();
[1000, 3000, 5000, 10000].forEach(delay => {
  setTimeout(copy.init, delay);
});