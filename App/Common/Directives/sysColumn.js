/**
 * Created by laomao on 2017/1/4.
 */
(function () {
    'use strict';
    angular.module('System').directive("sysColumn", [function(){
        return {
            replace:true,
            scope:{
            },
            templateUrl:'Directives/Template/sysColumn.html',
            controller:["$rootScope","$scope","$state","S_Column",function ($rootScope,$scope,$state, S_Column) {
                $scope.system = $rootScope.system;
                $scope.go = function ( id ) {

                    var obj =  S_Column.Get(id);

                    if( obj.isFolder ){
                        if($rootScope.system.UserOnColumnOpen[obj.id]||typeof $rootScope.system.UserOnColumnOpen[obj.id] == 'undefined'){
                            $rootScope.system.UserOnColumnOpen[obj.id] = false;
                            $rootScope.system.UserOnColumnClose[obj.id] = true;
                        }else{
                            $rootScope.system.UserOnColumnOpen[obj.id] = true;
                            $rootScope.system.UserOnColumnClose[obj.id] = false;

                        };
                    }else {
                        $state.go( obj.routerId );
                    };
                };

                $scope.sidebarToggler = function () {
                    $('body').is('.page-sidebar-closed')?$('body').removeClass('page-sidebar-closed'):$('body').addClass('page-sidebar-closed');
                };

            }]
        };
    }]);
})();