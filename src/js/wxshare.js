//checkCode();
import {GetQueryString} from './common'    
export function initSDK () {
    //删除参数值
    var isWXConfig = false;
    var shareLink = 'http://open1.ufunet.cn/pages/redirect/dist/index.html?appid=wxb49f0a0ee3b7b621&source=1&redirect_uri=/pages/h5/2017/0815'
    var shareData = {
        imgUrl: 'http://open1.ufunet.cn/pages/h5/2017/0815/newShare.jpg', // 分享图标
        title:$('title').html()+'',   // 分享标题
        desc:$('meta[name=description]').attr('content')+'武汉印象城问卷调查',   // 分享内容                                                                       // 分享描述
        link: shareLink,   // 分享链接
        type: '',
        dataUrl: '',
        success: function (res) {
            //openToast('分享成功',3000);
        },
        cancel: function (res) {

        }
    }
    function checkCode(){
        var code = GetQueryString('code');
        if(!code){
            //openToast('微信授权失败，请重新进入',2000);
            window.location.href = shareLink;
            return false;
        }
    }
    window.WXENV = new (function (ticketUrl) {
        var self = this;
        self.ticketUrl = ticketUrl;
        self.nonceStr = new Date().getTime()+'x';
        self.timestamp = new Date().getTime()+'';
        self.readyHandlers = [];
        self.shareData = shareData;
        self.debug = false;
        self.jsApiList =
            [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                // 'stopRecord',
                // 'onVoiceRecordEnd',
                // 'playVoice',
                // 'onVoicePlayEnd',
                // 'pauseVoice',
                // 'stopVoice',
                // 'uploadVoice',
                // 'downloadVoice',
                // 'hideOptionMenu',
                // 'showOptionMenu',
                // 'hideMenuItems',
                // 'showMenuItems',
                // 'hideAllNonBaseMenuItem',
                // 'showAllNonBaseMenuItem',
                // 'closeWindow',
                // 'scanQRCode',
                //'chooseImage',
                // 'previewImage',
                // 'uploadImage'
            ];
        self._updateShareData = function (data) {
            wx.onMenuShareTimeline({
                title: data.title,
                link: data.link,
                imgUrl: data.imgUrl,
                success: data.success,
                cancel: data.cancel
            });

            wx.onMenuShareAppMessage({
                title: data.title,
                desc: data.desc,
                link: data.link,
                imgUrl: data.imgUrl,
                type: data.type,
                dataUrl: data.dataUrl,
                success: data.success,
                cancel: data.cancel
            });

            wx.onMenuShareQQ({
                title: data.title,
                desc: data.desc,
                link: data.link,
                imgUrl: data.imgUrl,
                success: data.success,
                cancel: data.cancel
            });

            wx.onMenuShareWeibo({
                title: data.title,
                desc: data.desc,
                link: data.link,
                imgUrl: data.imgUrl,
                success: data.success,
                cancel: data.cancel
            });
            //alert(JSON.stringify(data));
        };
        var js = document.getElementsByTagName('script')[0];
        self.onEnvReady = function () {
            var url = self.ticketUrl+'?appid='+GetQueryString('appid')+'&nonceStr='+self.nonceStr+'&timestamp='+self.timestamp+'&url='+encodeURIComponent(window.location.href.split('#')[0]);
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                timeout: 10000,
                success: function(data){
                if(data.status == 1){
                    var data = data.data;
                    var config = {
                        debug: self.debug,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: self.jsApiList
                    };
                    wx.config(config);
                }else{
                    alert(data.message);
                }
                },
                error: function(xhr, type){
                    alert('获取coonfig失败');
                }
            })
        };
        var wxjs = document.createElement('script');
        wxjs.addEventListener('load', function () {
            wx.ready(function () {
            
                //alert('js ready is ok');
                //setTimeout(function(){
                    isWXConfig = true;
                    self._updateShareData(shareData);
                //},1)
            });
            self.onEnvReady();
        });
        wxjs.src = 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js';
        js.parentNode.insertBefore(wxjs, js.nextSibling);
    })('/com/get_ticket_getticket');
}