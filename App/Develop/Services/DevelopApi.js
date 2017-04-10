/**
 * Created by laomao on 2017/1/17.
 */
(function(){
    "use strict";
    angular.module("System").provider("DevelopApi",[function() {
        this.$get = ["$http",function($http) {
            return {
                create:function () {
                    var data = [],
                        successCall,
                        thenCall,
                        errorCall,
                        mthis=this;

                    this.getData = function () {
                        return angular.copy(data);
                    };

                    this.setDataObj = function ( obj ) {
                        data.push( obj );
                        return this;
                    };

                    this.setData = function ( path, html, isCover,compile) {
                        html||(html="");
                        isCover||(isCover=false);
                        this.setDataObj({
                            html:html,
                            isCover:isCover,
                            path:path,
                            compile:compile
                        });
                        return this;
                    };

                    this.submit = function () {
                        $http({
                            method:'POST',
                            cache:false,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            data:angular.toJson(data),
                            url:"http://127.0.0.1:"+wjSystem.developPort+"/create?"+Math.random()
                        }).error(function(data,header,config,status){
                            !(typeof errorCall == "function")||errorCall(data,header,config,status);
                        }).success(function(obj,header,config,status){
                            !(typeof successCall == "function")||successCall(obj,header,config,status);
                        }).then(function (res) {
                            !(typeof thenCall == "function")||thenCall(res);
                        });
                        return this;
                    };

                    this.success = function ( ueserCall ) {
                        successCall = ueserCall;
                        return this;
                    };

                    this.then = function ( ueserCall ) {
                        thenCall = ueserCall;
                        return this;
                    };

                    this.error = function ( ueserCall ) {
                        errorCall = ueserCall;
                        return this;
                    };
                }
            };
        }];
    }]);
})();