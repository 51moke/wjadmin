/**
 * Created by laomao on 2017/2/22.
 */
(function () {
    'use strict';
    angular.module('System').directive("sysUiSelect", [function(){
        return {
            replace:true,
            scope:{
                sync:"=",
                on:"=",
                trigger:"="
            },
            templateUrl:'SysUi/Template/sysUiSelect.html',
            link : function(scope, element, attrs, controller){
                /*  items : '=',
                    expand : '@',
                    icon : '=',
                    data.selectedItem : '=',
                    data.placeholder : '=',
                    filter : '=',
                    change : '&'
                */

                console.log(scope.data.items);

                scope.data = scope.sync;

                scope.search={filterStr : ''};
                var ts = new Date().getTime();
                /* 用于关闭当前页面所有其余select */
                $(element[0]).attr('_ts',ts);
                scope.ts = ts;
                /* 设置默认值 */
               //scope.data.expand = false;
                if(!scope.data.selectedItem || !scope.data.selectedItem.text){
                    scope.data.selectedItem = {text : scope.data.placeholder || '请选择',value : '',index:-1};
                }
                /**
                 * 下拉列表展开及关闭事件处理
                 * @param event
                 */
                var expandHandle = function(event){
                    event.preventDefault();
                    var parent = $(event.target).closest('.sysUiSelect');
                    //alert(parent.length);
                    if(!parent || !parent.length){
                        if(scope.data.expand){
                            scope.$apply(function () {
                                //alert(scope.data.expand)
                                scope.data.expand = false;
                            });
                        }
                    }else{
                        if(scope.ts+''!=parent.attr('_ts')){
                            if(scope.data.expand){
                                scope.$apply(function () {
                                    scope.data.expand = false;
                                });
                            }
                        }
                    }
                };
                scope.evToggleExpand = function(event){
                    event.preventDefault();
                    scope.data.expand = !scope.data.expand;
                    if(scope.data.expand){
                        //alert(scope.data.expand);
                        document.removeEventListener('click',expandHandle,false);
                        document.addEventListener('click',expandHandle,false);
                    }else{
                        document.removeEventListener('click',expandHandle,false);
                    }
                };
                /**
                 * item点击事件处理
                 * @param item
                 * @param index
                 */
                scope.evItemClick = function(item, index){
                    if(item.disabled){
                        return;
                    }
                    var prevItem = angular.copy(scope.data.selectedItem);
                    scope.data.selectedItem = item;
                    scope.data.selectedItem['index'] = index;
                    scope.data.expand = false;

                    /* 此处的参数字面量item必须要与父作用域下的函数参数名字保持一致 */
                    // scope.wjClick && scope.wjClick({item:scope.data.selectedItem});
                    if(prevItem.value != scope.data.selectedItem.value){
                        //scope.wjChange && scope.wjChange({item:scope.data.selectedItem,prevItem:prevItem});
                        scope.trigger('change',scope.data.selectedItem,prevItem);
                    }
                };
                scope.preventDismiss = function($event){
                    $event.preventDefault();
                    $event.stopPropagation();
                };
            },
            controller:["$rootScope","$scope",function ($rootScope,$scope) {
                //数据双向绑定
                $scope.data = $scope.sync;
                $scope.click = function ( obj ) {
                    //调用控制器方法
                    $scope.trigger('click',obj,1,2,3);
                };
                //绑定事件提供控制器调用
                $scope.on('aaa',function ( arg ) {
                    console.log("绑定的事件",arg);
                });
            }]
        };
    }]).filter('optionFilter',[function(){
        return function(optionArr,filterStr){
            var arr = [];
            if(!filterStr){
                return optionArr;
            }
            if(!optionArr){
                return arr;
            }
            optionArr.forEach(function(option){
                if(option.text.indexOf(filterStr)>=0){
                    arr.push(option);
                }
            });
            return arr;
        }
    }]);
})();