/**
 * Created by laomao on 2017/2/22.
 */
(function () {
    'use strict';
    angular.module('System').directive("sysUi", ["$compile","$timeout",function($compile,$timeout){
        return {
            replace:true,
            restrict: 'E',
            scope:{
            },
            template:'<div></div>',
            compile: function(tElem, tAttrs){
                var group = tAttrs.group||"page";
                wjSystem.__sysRoot.sysUi[group+tAttrs.data]||(wjSystem.__sysRoot.sysUi[group+tAttrs.data] = wjSystem.uifunid());
                wjSystem.__sysRoot.sysUi[tAttrs.data]||(wjSystem.__sysRoot.sysUi[tAttrs.data]=wjSystem.uifunid());
                var userData;
                return {
                    pre: function(scope, iElem, iAttrs){

                        wjSystem.__sysRoot.sysUi[group+tAttrs.data]["#userData#"]||(wjSystem.__sysRoot.sysUi[group+tAttrs.data]["#userData#"]={bind:{},on:{},isCompile:false});
                        userData = wjSystem.__sysRoot.sysUi[group+tAttrs.data]["#userData#"];
                        var $scope = userData.scope||wjSystem.__sysRoot;

                        scope.sync = $scope.sysUi[group+tAttrs.data];
                        scope.trigger = function ( name ) {
                            if(angular.isFunction(userData.on[name])){
                                var arg = Array.prototype.slice.apply(arguments);
                                arg.splice(0,1);
                                userData.on[name].apply(scope,arg);
                            };
                        };

                        scope.on = function (name,fun) {
                            userData.bind[name] = fun;
                        };

                        $(tElem).append('<sys-ui-'+tAttrs.name+'  sync="sync" trigger="trigger" on="on"></sys-ui-'+tAttrs.name+'>');
                        $compile(tElem.contents())(scope);
                    },
                    post: function(scope, iElem, iAttrs){
                        $timeout(function () {
                            userData.isCompile = true;
                            if( userData._tmp ){
                                for (var i in userData._tmp){
                                    var o = userData._tmp[i];
                                    if( angular.isFunction( userData.bind[o.key]) ){
                                        userData.bind[o.key].apply(null,o.arg);
                                    };

                                };
                            };
                        });
                    }
                }
            }

        };
    }]);
})();