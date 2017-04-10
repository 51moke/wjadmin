/**
 * Created by laomao on 2017/1/3.
 */
(function(){
    "use strict";

    angular.module("System").provider("S_Router", ["$stateProvider",function($stateProvider) {
        this.$get = ["$rootScope","$state",function($rootScope,$state) {
            return {
                AutoSet:function (obj) {
                    
                    if($state.get(obj.routerId)){
                        return;
                    };

                    if(obj.pid==0){
                        obj.resolve = {
                            loadMyCtrl: ['$ocLazyLoad',function($ocLazyLoad){
                                var modul = obj.sysData.top.state[0].toUpperCase()+obj.sysData.top.state.substr(1);
                                return $ocLazyLoad.load([
                                        "Modules/"+modul+"/Static/style/style.css",
                                        "Modules/"+modul+"/app.js",
                                        "Modules/"+modul+"/templates.js"],
                                    {rerun: true}
                                );
                            }]
                        };
                    }else{
                        obj.params = {args:''};
                        obj.url = obj.url + '/{args}'
                    };
                    $stateProvider.state(obj.routerId,obj);

                }
            };

        }];
    }]);

})();