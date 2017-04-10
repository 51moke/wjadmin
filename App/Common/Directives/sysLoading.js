/**
 * Created by laomao on 2017/2/14.
 */
(function () {
    'use strict';
    angular.module('System').directive("sysLoading", ["$http",function($http){
        return {
            restrict: 'E',
            replace:true,
            scope:{
            },
            templateUrl:'Directives/Template/sysLoading.html',
            link: function (scope, element, attrs) {

                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };
                scope.$watch(scope.isLoading, function (loading) {
                    if(loading){
                        element.removeClass('ng-hide');
                    }else{
                        element.addClass('ng-hide');
                    }
                });
            }
        };
    }]);
})();