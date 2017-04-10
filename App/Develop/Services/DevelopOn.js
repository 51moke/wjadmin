/**
 * Created by laomao on 2017/1/17.
 */
(function(){
    "use strict";
    angular.module("System").provider("DevelopOn",[function() {

        this.$get = ["$rootScope",function($rootScope) {
            return {
                socket:function () {
                    $.getScript("http://127.0.0.1:"+wjSystem.developPort+"/socket.io/socket.io.js", function(data, status, jqxhr) {
                        var socket = io.connect('http://127.0.0.1:'+wjSystem.developPort);
                        var timeId;
                        var isLock = false;
                        $rootScope.deveolpUpdateMsg||($rootScope.deveolpUpdateMsg={data:["正在更新。。。"]});

                        socket.on('UpdateStart', function( obj ){
                            $("body").css("overflow","hidden");
                            $rootScope.deveolpUpdateMsg.isShow = true;
                            clearTimeout(timeId);
                            $rootScope.deveolpUpdateMsg.data.push( obj.title+""+obj.url);
                            $rootScope.$apply();
                            try {
                                $('.developUpdate .developcon').stop().animate({scrollTop: $('.developUpdate .developcon').get(0).scrollHeight}, "fast");
                            }catch(err){
                            }

                        });

                        socket.on('UpdateComplete', function( obj ){
                            $rootScope.deveolpUpdateMsg.data.push( obj.title+""+obj.url);
                            $rootScope.$apply();
                            try {
                                $('.developUpdate .developcon').stop().animate({scrollTop: $('.developUpdate .developcon').get(0).scrollHeight}, "fast");
                            }catch(err){
                            }

                            timeId = setTimeout(function () {
                                isLock||location.reload(true);
                            },200);
                        });

                        socket.on('SetLock', function( is ){
                            clearTimeout(timeId);
                            isLock = is;
                        });
                        $rootScope.$apply();

                        try {
                            $('.developUpdate .developcon').stop().animate({scrollTop: $('.developUpdate .developcon').get(0).scrollHeight}, "fast");
                        }catch(err){
                        }

                    });
                }
            };
        }];

    }]);
})();