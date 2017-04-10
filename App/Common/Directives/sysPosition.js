/**
 * Created by laomao on 2017/1/6.
 */
(function () {
    'use strict';
    angular.module('System').directive("sysPosition", [function(){
        return {
            replace:true,
            scope:{
            },
            templateUrl:'Directives/Template/sysPosition.html',
            controller:["$rootScope","$scope",function ($rootScope,$scope) {
                $scope.system = $rootScope.system;

                /**
                 * 关闭颜色选择
                 */
                $scope.close_color = function () {
                    $("#close_color_mode,#close_color").css("display","none");
                };

                /**
                 * 打开颜色选择
                 */
                $scope.open_color = function () {
                    $("#close_color_mode,#close_color").css("display","block");
                };

            }]
        };
    }]);
})();