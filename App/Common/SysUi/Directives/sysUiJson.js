/**
 * Created by laomao on 2017/2/22.
 */
(function () {
    'use strict';
    angular.module('System').directive("sysUiJson", ["$sce",function($sce){
        return {
            replace:true,
            scope:{
                sync:"=",
                on:"=",
                trigger:"="
            },
            template:'<div ng-bind-html="json"></div>',
            link : function(scope, element, attrs) {

                scope.on("set", function ( value ) {

                    var json = '';

                    if (typeof value == 'string'){
                        json = value;
                    }else if(typeof value == "object"){
                        json = angular.toJson( value );
                    };

                    if ( json ){
                        try {
                            scope.json = $sce.trustAsHtml( new JSONFormat( json  ,4).toString() );
                        }catch (e){

                        };
                    };

                });
            }
        };
    }]);
})();