/**
 * Created by laomao on 2017/1/3.
 */
(function(){
    "use strict";

    angular.module("System").provider("S_Alert", ["$stateProvider",function($stateProvider) {

        this.$get = ["$rootScope","$state","$timeout",function($rootScope,$state,$timeout) {
            return {
                data:{},
                add:function ( k, v ) {
                    this.data[k] = v;
                },
                close:function ( k ) {
                    if(k){
                        delete this.data[k];
                    }else {
                        this.data = {};
                    };
                },
                autoClose:function (id,time) {
                    if ( time !== false ){
                        if (time===true||isNaN(Number(time))){
                            time = 2000;
                        };
                        var mthis = this;
                        $timeout(function () {
                            mthis.close( id );
                        },time);
                    };
                },
                alert:function ( errid, msg, time ) {
                    if (msg){
                        var id = new Date().getTime()+'_'+Math.random();
                        this.add(id,{type:wjSystem.errcode[errid],msg:msg});
                        this.autoClose(id,time);
                        return id;
                    };
                },
                success:function ( msg, time ) {
                    return this.alert( 0, msg, time );
                },
                warning:function ( msg,time ) {
                    return this.alert( 1, msg, time );
                },
                error:function ( msg,time ) {
                    return this.alert( 2, msg, time );
                }
            };

        }];
    }]);

})();