/**
 * Created by laomao on 2017/1/16.
 */
(function () {
    'use strict';
    angular.module('System').directive("developColumn", [function(){
        return {
            replace:true,
            scope:{
            },
            templateUrl:'Template/developColumn.html',
            controller:["$rootScope","$scope","DevelopColumn",function ($rootScope,$scope,DevelopColumn) {

                $scope.sysAppColumn = wjSystem.sysColumn();
                var maxId = 0;

                function updateColumn(AppColumn) {
                    var  sysAppColumnFu = {};
                    for (var i in AppColumn){
                        var o = AppColumn[i];
                        maxId = maxId<AppColumn[i].id?AppColumn[i].id:maxId;
                        if(o.pid !=0 && !sysAppColumnFu[o.pid]){
                            sysAppColumnFu[o.pid] = AppColumn[o.pid];
                        };
                    };

                    function setNav(obj,sonObj,depth) {
                        var d = depth;
                        d++;
                        for(var i in AppColumn){
                            if( AppColumn[i].pid == sonObj.id ){
                                var o = AppColumn[i];
                                o.depth = depth;
                                obj.lists.push(o);

                                !sysAppColumnFu[o.id]||setNav(obj,o,d);

                            };
                        };
                    };

                    $scope.tree = [];
                    for(var i in AppColumn){
                        if( AppColumn[i].pid == 0 ){
                            var obj = AppColumn[i];
                            obj.lists = [];
                            //设置菜单
                            setNav(obj,obj,0);
                            $scope.tree.push(obj);

                        };
                    };
                };

                var o = angular.copy($scope.sysAppColumn);

                updateColumn(o);

                var newobj = {};

                $scope.add = function ( id ) {
                    maxId++;
                    $scope.sysAppColumn[maxId] = {
                        icon: "",
                        id:maxId,
                        isFolder:0,
                        isHide:0,
                        pid:id,
                        sort:0,
                        state:"",
                        time:0,
                        title:"",
                        url:"",
                        newadd:true
                    };
                    newobj[maxId] = $scope.sysAppColumn[maxId];

                    var o = angular.copy($scope.sysAppColumn);

                    updateColumn(o);
                };

                $scope.save = function () {
                    DevelopColumn.create( $scope.sysAppColumn, function ( obj ) {

                    });
                };

                $scope.isLock = false;
                $scope.$watch('sysAppColumn',function () {

                    $scope.tpmData = {
                        emptytitle:{},
                        estate:{},
                        e2state:{}
                    };

                    for(var i in $scope.sysAppColumn){
                        var o =  $scope.sysAppColumn[i];

                        if(o.title==""){
                            $scope.tpmData.emptytitle[i] = true;
                            $scope.isLock = true;
                            return;
                        };

                        for (var j in newobj){
                            var o2 = newobj[j];
                            if(o2.id!=o.id){
                                if(o2.title==""){
                                    $scope.tpmData.emptytitle[j] = true;
                                    $scope.isLock = true;
                                    return;
                                }else if(o2.state==""){
                                    $scope.tpmData.estate[j] = true;
                                    $scope.isLock = true;
                                    return;
                                }else if(o.state==o2.state){
                                    $scope.tpmData.e2state[j] = true;
                                    $scope.isLock = true;
                                    return;
                                };
                            };
                        };

                    };

                    $scope.isLock = false;

                },true);

            }]
        };
    }]);
})();