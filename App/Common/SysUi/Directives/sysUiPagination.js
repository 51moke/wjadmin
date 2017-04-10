/**
 * Created by laomao on 2017/2/26.
 */

(function () {
    'use strict';
    angular.module('System').directive("sysUiPagination", [function($sce){
        return {
            replace:true,
            scope:{
                sync:"=",
                on:"=",
                trigger:"="
            },
            templateUrl:'SysUi/Template/sysUiPagination.html',
            controller:["$rootScope","$scope",function ($rootScope,$scope) {
                $scope.id = $scope.sync;
                $scope.id.pageSize = $scope.id.pageSize || 5;
                $scope.id.currentPage = $scope.id.currentPage||1;
                $scope.id.totalCount = $scope.id.totalCount||0;
                $scope.pageSizeList = $scope.id.pageSize;

                var ingPage = $scope.id.currentPage;

                var around;
                var isTo = ($scope.id.pageSize/2)==Math.ceil($scope.id.pageSize/2)?0:1;

                $scope.$watch('id.totalCount',function () {
                    $scope.id.totalCount = $scope.id.totalCount||0;
                    if ((($scope.id.pageSize+1)==$scope.id.totalCount)||$scope.id.pageSize>=$scope.id.totalCount){
                        var k = $scope.id.totalCount-2;
                        if (k<0){
                            k = 0;
                        };
                        $scope.pageSizeList = new Array(k);
                    }else{
                        $scope.pageSizeList = new Array($scope.id.pageSize);
                    };
                    around = Math.ceil(($scope.pageSizeList.length-1)/2);
                    resetAround();

                });

                function resetAround() {
                    if ($scope.id.currentPage<=around+1){
                        $scope.pageAround = 2;
                    }else if (($scope.id.currentPage+around)>=$scope.id.totalCount){
                        $scope.pageAround = $scope.id.totalCount-$scope.pageSizeList.length;
                    }else{
                        $scope.pageAround = $scope.id.currentPage-around;
                    };

                    if ($scope.id.currentPage>($scope.pageAround+1)&&$scope.pageAround>=around&&$scope.id.totalCount>$scope.id.pageSize+2){
                        $scope.pre = true;
                    }else{
                        $scope.pre = false;
                    };
                    if ((($scope.id.pageSize+2)<$scope.id.totalCount)&&($scope.id.totalCount-$scope.id.currentPage>(around+isTo) )){
                        $scope.after = true;
                    }else{
                        $scope.after = false;
                    };

                };

                function onpage() {
                    ($scope.id.currentPage>=1)||($scope.id.currentPage = 1);
                    ($scope.id.currentPage<$scope.id.totalCount)||($scope.id.currentPage=$scope.id.totalCount);
                    if (ingPage != $scope.id.currentPage){
                        ingPage = $scope.id.currentPage;
                        resetAround();
                        $scope.trigger('page',$scope.id.currentPage);
                    };
                };
                
                $scope.onclick = function ( page ) {
                    $scope.id.currentPage = page;
                    onpage();
                };

                $scope.prePage = function () {
                    $scope.id.currentPage-=$scope.id.pageSize;
                    onpage();
                };

                $scope.nextPage = function () {
                    $scope.id.currentPage+=$scope.id.pageSize;
                    onpage();
                };

                //提供控制器调用直接跳转到指定页面
                $scope.on('page',function ( page ) {
                    $scope.id.currentPage = page;
                    onpage();
                });

            }]

        };
    }]);
})();