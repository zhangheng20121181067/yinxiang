//总共有三个click改为touchStart



var mySwiper;
$(document).ready(function(){
    //音频播放
    var play;
    function audioAutoPlay(id){
        var audio = document.getElementById(id);
            play = function(){
               audio.play();
               document.removeEventListener("touchstart",play, false);
            };
        audio.play();
        document.addEventListener("WeixinJSBridgeReady", function () {
            play();
        }, false);
        document.addEventListener("touchstart",play, false);
    }
    audioAutoPlay('Jaudio');

     //防止输入框input输入内容后影响布局
    var $bodyHeight=$(window).height();
    $("html,body").css({
        height: $bodyHeight + 'px'
    });

    

   //禁止上下滑动，防止与手势上下滑动发生冲突;
   document.querySelector('body').addEventListener('touchmove', function (ev) {
      event.preventDefault();
   });

      //首页
      $(".touchStart").swipe({
        swipeStatus:function(event, phase, direction, distance, duration,fingerCount) {    //distance实际距离
          //  console.log("你用"+fingerCount+"个手指以"+duration+"秒的速度向"
                //    + direction + "滑动了" +distance+ "像素 " +"你在"+phase+"中");
            distance=distance/(document.documentElement.clientWidth/750);   //得到的distance为750设计稿上的距离
            console.log("---"+distance);
            if(direction=="down"&&distance>=170){   //&&distance<=390&&duration<=8000&&phase=="end"
              // console.log(event.srcElement);
              mySwiper.slideTo(1, 666);
              return false;
            }
        }
    });

    //详情页   
    var arr=[];       //单页数组
    var shuzu={};     //全部数组
    var $indexPage;   //页码

    var $inputval;
   

    //多选
   $(".question-list").find(".question-item").on("click",function(){
        //动画
      if( $(this).hasClass("translate15")){
          $(this).removeClass("translate15");
      }else{
          $(this).addClass("translate15");
      }

      //选择标记(多选)
      var $xuanze=$(this).find(".xuanze");
      if( $xuanze.hasClass("none")){
          $xuanze.removeClass("none");
      }else{
           $xuanze.addClass("none");
      }
     

      $indexPage=$(".swiper-slide-active").attr("data-index");
      //定义一个空数组
      arr=[];
      $(".swiper-slide-active .xuanze:not(.none)").each(function(){
          arr.push($(this).siblings().text());   //将选择的选项放到数组
      });

      //您的建议
     $(".swiper-slide-active").find("input").blur(function(e){
        e.stopPropagation();
        $inputval=$(this).val();     
     });

     // console.log($indexPage+":"+arr);
   });

    //单选
   $(".question-list-danxuan").find(".question-item").on("click",function(){
        if(  $(this).hasClass("translate15")){
            $(this).removeClass("translate15").siblings().removeClass("translate15");
        }else{
            $(this).addClass("translate15").siblings().removeClass("translate15");
        }

        //选择标记
        var $xuanze=$(this).find(".xuanze");
        if( $xuanze.hasClass("none")){
            $xuanze.removeClass("none").parent().siblings().find(".xuanze").addClass("none");
        }else{
            $xuanze.addClass("none").parent().siblings().find(".xuanze").addClass("none");
        }

    $indexPage=$(".swiper-slide-active").attr("data-index");
    //定义一个空数组
         arr=[];
        $(".swiper-slide-active .xuanze:not(.none)").each(function(){
            arr.push($(this).siblings().text());   //将选择的选项放到数组
        });
    });

            
    //设置滑动方向为向下
    $('.swiper-container').removeClass('hide');
    mySwiper = new Swiper('.swiper-container',{
        direction : 'vertical',
        onSlideChangeEnd: function(){
           //选择栏淡入效果
           // $(".question-item").hide();
          // $(".swiper-slide-active .question-item").delay(1300).show(1000);
        }
    });
    



    var $modal=$(".modal");
    var pop=document.getElementsByClassName("pop")[0];
    $.button('.icon-go','ani-act',function(){
        $(".swiper-slide-active").find("input").blur();
        if($inputval){
            arr.push($inputval)
        }
        if(arr.length<=0){   //shuzu
          // alert("请至少选择一个选项")
           //console.log($modal)
           openModal($modal);
           popShow(pop);
        }else{    
            mySwiper.slideNext(true, 333);   
            shuzu[$indexPage]=arr.toString();              
            console.log("跳转后:",JSON.stringify(shuzu));   
            arr=[];   
            $inputval="";    
        } 
    })

    
   //获取url参数
   function GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      return r != null ? unescape(r[2]) : null;
   }
    

    var $activity_guid="yingxiangcheng";
    var $openid;
    var $nickname;
    var $headimgurl;   
    var $testing_result;
    var $is_finish=1;

    var $code= GetQueryString("code");
    var $appid= GetQueryString("appid");
    var $state= GetQueryString("state");
    //get请求  获取用户信息
    $.ajax({
        type: "get",
        url:"/com/get_userinfo_by_code?code="+$code+"&appid="+$appid+"&state="+$state,
        success: function (data) {
           // console.log(JSON.stringify(data));

            $openid=data.data.userinfo.openid;
            $nickname=data.data.userinfo.nickname;
            $headimgurl=data.data.userinfo.headimgurl;
        }
    });

   //最后一个提交按钮
    $.button('.icon-go.post','ani-act',function(){
        $(".swiper-slide-active").find("input").blur();       
        if(arr.length<=0){   //shuzu
           //alert("请至少选择一个选项")
           openModal($modal);
           popShow(pop);
        }else{                    
            shuzu[$indexPage]=arr.toString();  
            $testing_result=JSON.stringify(shuzu);       
            console.log($activity_guid,$openid,$nickname,$headimgurl,$testing_result,$is_finish);
            $.ajax({
                type: "post",
                url:"/zyinxc/testing_save",
                data:{
                    "activity_guid": $activity_guid,
                    "openid": $openid,
                    "nickname": $nickname,
                    "headimgurl": $headimgurl,
                    "testing_result": $testing_result,
                    "is_finish": $is_finish
                },
                success: function (data) {
                    console.log("post----"+JSON.stringify(data));
                }
            });          
            mySwiper.slideNext(true, 333);          
        } 
    });


    //弹出框
    /*取窗口滚动条高度*/
    function getScrollTop(){
        var scrollTop=0;
        if(document.documentElement&&document.documentElement.scrollTop) {
            scrollTop=document.documentElement.scrollTop;
        } else if(document.body) {
            scrollTop=document.body.scrollTop;
        }
        return scrollTop;
    }

    function openModal($modal){
        $modal.show();
    }
    function closeModal(){
        $modal.hide();
    }

    //弹出框
    function popShow(elm){      
        //定位
        elm.style.display="block";
        var l=(document.documentElement.clientWidth-elm.offsetWidth)/2;
        var t=(document.documentElement.clientHeight-elm.offsetHeight)/2;
        elm.style.left=l+'px';
        elm.style.top=t+'px';  //定位高度等于滚轮高度加上可视窗高度

        //取消事件
        var cancel=elm.getElementsByClassName("cancel")[0];
        //点击取消时 
        cancel.onclick=function(){
            elm.style.display="none";
            closeModal();
        }
    };









    //微信分享
    


})

