/**
 * Created by zh on 2017/7/7.
 */
//这段代码放到link后,body前就是为了当页面加载完毕后,根据屏幕宽度来重设根节点字体大小.
(function(doc,win,undefined){
    var docEl=doc.documentElement;
   // resizeEvent='orientationchange' in win? 'orientationchange':'resize';
    recalc=function(){
        var clientWidth=docEl.clientWidth;
        if(clientWidth===undefined){
            return;
        }
        docEl.style.fontSize=100*(clientWidth/750)+"px";
        if(clientWidth>=750){
            docEl.style.fontSize='100px';
        }else{
            docEl.style.fontSize=100*(clientWidth/750)+"px";
        }

    };
    if(doc.addEventListener===undefined){
        return;
    }
  //  win.addEventListener(resizeEvent,recalc,false);
    doc.addEventListener('DOMContentLoaded',recalc,false);
})(document,window);
