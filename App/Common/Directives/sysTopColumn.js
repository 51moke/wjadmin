/**
 * Created by laomao on 2017/1/4.
 */
(function () {
    'use strict';
    angular.module('System').directive("sysTopColumn", [function(){
        return {
            replace:true,
            scope:{
            },
            templateUrl:'Directives/Template/sysTopColumn.html',
            controller:["$rootScope","$scope","$state","S_Column",function ($rootScope,$scope,$state, S_Column) {
                $scope.system = $rootScope.system;

                $scope.click = function ( id,name ) {
                    ($scope.system.TopColumnCurrentId==id)||S_Column.ChangeModules( id );
                    $state.go( name );
                };
            }]
        };
    }]);
})();