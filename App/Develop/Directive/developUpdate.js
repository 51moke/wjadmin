/**
 * Created by laomao on 2017/1/16.
 */
(function () {
    'use strict';
    angular.module('System').directive("developUpdate", [function(){
        return {
            replace:true,
            scope:{
            },
            templateUrl:'Template/developUpdate.html',
            controller:["$rootScope","$scope",function ($rootScope,$scope) {
                $rootScope.deveolpUpdateMsg||($rootScope.deveolpUpdateMsg={data:["正在更新。。。"]});
                $scope.deveolpUpdateMsg = $rootScope.deveolpUpdateMsg;
            }]
        };
    }]);
})();