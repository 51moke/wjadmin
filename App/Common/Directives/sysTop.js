/**
 * Created by laomao on 2017/1/6.
 */
(function () {
    'use strict';
    angular.module('System').directive("sysTop", [function(){
        return {
            replace:true,
            scope:{
            },
            templateUrl:'Directives/Template/sysTop.html',
            controller:["$rootScope","$scope",function ($rootScope,$scope) {
                $scope.userData = $rootScope._sysGlobal.userData;
            }]
        };
    }]);
})();