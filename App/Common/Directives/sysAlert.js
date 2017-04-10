/**
 * Created by laomao on 2017/1/4.
 */

(function () {
    'use strict';
    angular.module('System').directive("sysAlert", [function(){
        return {
            replace:true,
            scope:{
            },
            templateUrl:'Directives/Template/sysAlert.html',
            controller:["$rootScope","$scope","$timeout","S_Alert",function ($rootScope,$scope,$timeout,S_Alert) {
                $scope.data = S_Alert.data;

            }]
        };
    }]);
})();

