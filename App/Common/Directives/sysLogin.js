/**
 * Created by laomao on 2017/2/14.
 */
(function () {
    'use strict';
    angular.module('System').directive("sysLogin", [function(){
        return {
            replace:true,
            scope:{
            },
            templateUrl:'Directives/Template/sysLogin.html',
            controller:["$rootScope","$scope","$state","$timeout","S_Http",function ($rootScope,$scope,$state,$timeout,S_Http) {
                $scope.email = "";
                $scope.password = "";
                $scope.doLogin = function () {
                    S_Http.post({
                        url:wjSystem.config.api.Login,
                        data:{account:$scope.email,pass:$scope.password}
                    }).then(function ( result ) {

                        if (result.errcode == 0 ){
                            localStorage.setItem("_sysGlobal.userData",angular.toJson(result.data));
                            $rootScope._sysGlobal.userData = result.data;
                            $timeout(function () {
                                $state.go('system');
                            },800);

                        }else{
                            console.log("账号或密码错误");
                        };
                    },function ( result ) {
                        console.log("失败");
                    });

                };
            }]
        };
    }]);
})();