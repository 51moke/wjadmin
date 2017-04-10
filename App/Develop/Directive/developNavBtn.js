/**
 * Created by laomao on 2017/1/4.
 */
(function () {
    'use strict';
    angular.module('System').directive("developNavBtn", [function(){
        return {
            replace:true,
            scope:{
            },
            templateUrl:'Template/developNavBtn.html',
            controller:["$rootScope","$scope","$http","DevelopOn",function ($rootScope,$scope,$http,DevelopOn) {

                $scope.isShowBtn = false;

                function setPort() {
                    $http({
                        method:'GET',
                        cache:false,
                        url:"Develop/Api/port.json?"+Math.random()
                    }).then(function(resp){

                        if(resp.data.port){
                            wjSystem.developPort = resp.data.port;

                            $http({
                                method:'GET',
                                cache:false,
                                url:"http://127.0.0.1:"+wjSystem.developPort+"/getpath?"+Math.random()
                            }).error(function(data,header,config,status){
                                alert("可视化服务未开启");
                            }).then(function(resp){
                                $scope.isShowBtn = true;
                                DevelopOn.socket();
                            })

                        };

                    });
                };
                setPort();

                $scope.isShow = false;
                var isOn = false;
                $scope.show = function () {

                    $scope.isShow = true;
                    $scope.isShowBtn = false;
                    $('body').addClass('m-develop-box-body');

                };

            }]
        };
    }]);
})();