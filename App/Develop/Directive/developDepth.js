/**
 * Created by laomao on 2017/1/16.
 */
(function () {
    'use strict';
    angular.module('App').directive("developDepth", [function(){
        return {
            replace:true,
            scope:{
                i:"@"
            },
            template:'<span class="m-nav-depth"><i class="depth1" ng-if="i==1"><icon></icon></i><i class="depth2" ng-if="i==2"><icon></icon></i></span>',
            controller:["$rootScope","$scope",function ($rootScope,$scope) {
            }]
        };
    }]);
})();