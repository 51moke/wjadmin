/**
 * Created by laomao on 2017/1/3.
 */
(function(){
    "use strict";

    angular.module("System").provider("S_Http", ["$stateProvider",function($stateProvider) {

        this.$get = ["$http","$rootScope","$state","$timeout","S_Alert",function($http,$rootScope,$state,$timeout,S_alert) {
            return {
                ajax:function ( configObj ) {
                    var config = {
                        withCredentials:true,
                        method:"GET",
                        url:wjSystem.config.urls.formUrl,
                        params:{},
                        data:{},
                        cache:false,
                        timeout:20000
                    };

                    var call = {
                        f1:function () {

                        },
                        f2:function () {

                        },
                        isAutoShowMsg:true,
                        isAutoScrollTop:true
                    };
                    var func = {
                        then:function (f1,f2,isShow,isTop) {
                            call.f1 = (typeof f1 == "function"?f1:function () {});
                            call.f2 = (typeof f2 == "function"?f2:function () {});
                            if (typeof isShow == "undefined"){
                                isShow = true;
                            };
                            if (typeof isTop == "undefined"){
                                isTop = true;
                            }
                            call.isAutoShowMsg = isShow;
                            call.isAutoScrollTop = isTop;
                        }
                    };

                    config = $.extend(config,configObj);

                    $http(config).success(function(result,status,headers,config){

                        if ( result.errcode == -1 ){
                            $state.go('login');
                            S_alert.warning(result.msg||"登陆超时，请重新登陆");
                        }else{
                            !call.isAutoShowMsg||S_alert.alert(result.errcode,result.msg);
                            call.f1(result,status,headers,config);
                            if (call.isAutoScrollTop){
                                $timeout(function () {
                                    wjSystem.scrollTop();
                                },50);
                            };

                        };
                    }).error(function(result,status,headers,config){
                        !call.isAutoShowMsg||S_alert.error("对不起，服务器出错，请联系提供接口技术人员");
                        call.f1(result,status,headers,config);
                    });

                    return func;
                },
                post:function ( formObj, configObj ) {
                    var obj = {
                        data:{}
                    };
                    obj = $.extend(obj, configObj);
                    var p ={
                        url:"",         //给后端的url
                        params:"",      //给后端的参数
                        method:"",      //给后端的类型
                        noAutoMsg:false, //关闭自动提示
                        data:{}         //给后端的表单数据
                    };
                    p = $.extend(p,formObj);
                    //console.log( p );

                    if (!p.url){
                        console.log("参数错误，url不可以为空");
                        return {then:function () {}};
                    };

                    obj.method = "POST";
                    obj.data = p;

                    return this.ajax( obj );
                }
            };
        }];
    }]);

})();