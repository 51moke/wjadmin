/**
 * Created by laomao on 2017/2/14.
 */
(function () {
    'use strict';
    angular.module('System').directive("sys404", [function(){
        return {
            replace:true,
            scope:{
            },
            templateUrl:'Directives/Template/sys404.html',
            controller:["$rootScope","$scope",function ($rootScope,$scope) {

            }]
        };
    }]);
})();