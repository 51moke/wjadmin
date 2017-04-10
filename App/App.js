/**
 * Created by 老毛 on 2016/12/7.
 */
(function () {
    "use strict";
    angular.module("System",["ui.router"]).controller('__sysRoot',["$scope",function ($scope) {
        wjSystem.__sysRoot = $scope;
    }]);
    angular.module("PublicService",["System"]);
    angular.module("App",["PublicService","oc.lazyLoad"]);
})();

(function () {
    "use strict";
    angular.module("App").run(["$rootScope","S_Column",function ($rootScope,S_Column) {

        if( !wjSystem.appIsPalay ) {

            $rootScope._sysGlobal = $rootScope._sysGlobal||{};
            wjSystem.appIsPalay = true;
            S_Column.init();

            var isCdata = function () {
                var cdata = S_Column.Get();
                for (var i in cdata){
                    return true;
                };

                wjSystem.$stateProvider.state(wjSystem.config.DefaultPage,{
                    url:"/"+wjSystem.config.DefaultPage,
                    template:'<sys-whaley></sys-whaley>',
                    controller:['$rootScope','$scope',function ($rootScope,$scope) {
                        angular.element('title').html('后台管理系统初始化');
                    }]
                });

                return false;
            };
            isCdata();

            //用户信息
            if (localStorage.getItem("_sysGlobal.userData")){
                $rootScope._sysGlobal.userData = angular.fromJson( localStorage.getItem("_sysGlobal.userData") );
            }else{
                //wjSystem.state.go('login');
            };

            //路由监听事件
            $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

                var $scope = event;
                wjSystem.__sysRoot.sysUi = wjSystem.uifun();
                wjSystem.sysUi = wjSystem.__sysRoot.sysUi;



                //独立页面拦截器
                if (wjSystem.aloneState[toState.name]){
                    $rootScope.system.pageState.isAlone = true;
                    return false;
                };

                $rootScope.system.pageState.isAlone = false;
                try {
                    angular.element('title').html(toState.sysData.position.map(function (elem) {
                        return elem.title;
                    }).join(" - "));
                } catch (e) {

                };

                $rootScope.system.currentData = toState;
                S_Column.SetColumnCurrent(toState);

                $(".m-rightPos").animate({scrollTop: 0}, "fast");
                $("body").animate({scrollTop: 0}, "fast");
            });

        };
    }]).config(["$urlRouterProvider","$locationProvider","$stateProvider",function($urlRouterProvider,$locationProvider,$stateProvider) {

        wjSystem.$stateProvider = $stateProvider;
        //登陆页面路由
        wjSystem.setAlone('login');
        $stateProvider.state('login',{
            url:"/login",
            template:'<sys-login></sys-login>',
            controller:['$rootScope','$scope',function ($rootScope,$scope) {
                angular.element('title').html('登陆');
                setTimeout(function () {
                    $('.m-sysLogin .wj-login-content').addClass('wj-login-show');
                });
            }]
        });

        if ( wjSystem.config.html5Mode ){
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        };

        $urlRouterProvider.when("", wjSystem.config.DefaultPage);
        $urlRouterProvider.otherwise(function($injector, $location){

            if ($location.$$url=="/"||$location.$$url=='/index.html'){
                wjSystem.state.go(wjSystem.config.DefaultPage);
            }else{
                var state = '####'+$location.$$url;
                $stateProvider.state(state,{
                    url:$location.$$url,
                    template:'<sys404></sys404>',
                    controller:['$rootScope',function ($rootScope) {
                        angular.element('title').html('您访问的页面不存在！！！');
                    }]
                });
                wjSystem.setAlone(state);
                wjSystem.state.go(state);
            }



        });

    }]);
})();