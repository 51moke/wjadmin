/**
 * Created by laomao on 2017/1/17.
 */
(function(){
    "use strict";
    angular.module("System").provider("DevelopMoban",[function() {

        this.$get = ["$http",function($http) {
            function getTime() {
                var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
                var str = "/**\n * 自动创建于：" + time + "\n */\n";
                return str;
            };

            return {
                modulesViews:function () {
                    return "<ui-view><sys-whaley></sys-whaley></ui-view>";
                },
                columnViews:function ( html ) {
                    if (html){
var h = '<div class="container-fluid">\n\
    <div class="row">\n\
        <div class="col-md-12">\n\
            <div class="panel panel-default">\n\
                <div class="panel-heading">\n\
                    <h3 class="panel-title">';
					h+=html;
					h+='</h3>\n\
                </div>\n\
                <div class="panel-body">\n\
                    Panel content\n\
                </div>\n\
            </div>\n\
        </div>\n\
    </div>\n\
</div>';
                        return h;
                    }
                    return "";
                },
                columnControllers:function ( obj ) {
                    return this.modulesControllers(obj);
                },
                modulesControllers:function ( obj ) {
                    return getTime()+'(function () {\n\
    "use strict";\n\
    angular.module("#&#appName#&#").controller("' + obj.controller + '",["$rootScope","$scope",function ($rootScope,$scope) {\n\
        console.log("' + obj.controller + ' page ");\n\
    }]);\n\
})();';
                },
                dtatic:function ( obj ) {
                    return getTime()+"."+obj.state+"-box{\n/*请把css代码写在这盒子里面*/\n\n}";
                }
            };
        }];

    }]);
})();