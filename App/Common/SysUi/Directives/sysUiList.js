/**
 * Created by laomao on 2017/2/22.
 */
(function () {
    'use strict';
    angular.module('System').directive("sysUiList", ["$timeout",function($timeout){
        return {
            replace:true,
            scope:{
                sync:"=",
                on:"=",
                trigger:"="
            },
            templateUrl:'SysUi/Template/sysUiList.html',
            link : function(scope, element, attrs) {

                scope.data = scope.sync;
                var hData = scope.data.ietmHead||[];
                var itemHead = {};
                for (var i in hData ){
                    var o = hData[i];
                    if( typeof o == 'object' ){
                        itemHead[i] = o;
                    }else{
                        itemHead[i] = {
                            title:o,
                            type:"data"
                        };
                    };

                };
                scope.itemHead = itemHead;

                /**
                 * 绑定事件给页面控制器调用
                 * @param data
                 */
                scope.on('setData', function ( data ) {
                    console.log( data );
                    scope.data.itemList = data;
                });

                /**
                 * 列表处理
                 */
                scope.$watch('data.itemList',function () {
                    scope.itemList = [];
                    for (var i in scope.data.itemList){
                        var obj = {};
                        for (var j in scope.itemHead){
                            if ( scope.itemHead[j].type == "on"){
                                obj[j] = {title:"我的按钮",data:scope.itemHead[j].data};
                                obj[j]['#btn#'] = true;
                            }else{
                                if (angular.isFunction(scope.itemHead[j].filters)){
                                    obj[j] = scope.itemHead[j].filters(scope.data.itemList[i][j]);
                                }else{
                                    obj[j] = scope.data.itemList[i][j];
                                };
                            };
                        };
                        scope.itemList.push( obj );
                    };

                });

                //通知控制器
                scope.onbtn = function ( key, bi, i ) {
                    var btn = scope.itemHead[key].data[bi];
                    btn.index = i;
                    var data = scope.data.itemList[i];
                    var udata = {};
                    for (var k in btn.key){
                      udata[btn.key[k]] = data[btn.key[k]];
                    };
                    scope.trigger(key,udata,btn);
                };


            }
        };
    }]);
})();