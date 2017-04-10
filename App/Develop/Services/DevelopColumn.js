/**
 * Created by laomao on 2017/1/16.
 */
(function(){
    "use strict";
    angular.module("System").provider("DevelopColumn",[function() {

        this.$get = ["$http","S_Column","DevelopApi","DevelopMoban",function($http,S_Column,DevelopApi,DevelopMoban) {

            var modulesPath = "Modules/";
            var RoutesPath = "Routes/";

            function set( userObj, api ) {

                var obj = angular.copy( userObj );
                var column = {};

                for(var id in obj){
                    var o = angular.extend({},obj[id]);
                    column[id]||(column[id] = o,S_Column.handleColumn( id, o, obj, true ));
                };

                function setDtatic( o ){

                    var path = modulesPath + (o.templateUrl.slice(0,o.templateUrl.lastIndexOf("/")+1));
                    var images = path+"Static/images/";
                    var directives = path + "Directives/";
                    var filters = path + "Filters/";
                    var services = path + "Services/";

                    path += "Static/style/style.less";
                    api.setData(images,"dir",false);
                    api.setData(directives,"dir",false);
                    api.setData(filters,"dir",false);
                    api.setData(services,"dir",false);
                    api.setData(path,DevelopMoban.dtatic(o),false);

                };

                function setModulesControllers( o ) {
                    var path = modulesPath + (o.templateUrl.slice(0,o.templateUrl.lastIndexOf("/")+1))+"App.js";
                    api.setData(path,DevelopMoban.modulesControllers(o),false,{"appName":"#&#appName#&#"});
                };

                function setColumnControllers( o ) {
                    if(o.isFolder !=1 ){
                        var top = o.sysData.top.state[0].toLocaleUpperCase() + o.sysData.top.state.slice(1,o.sysData.top.state.length);
                        var zi = o.state[0].toLocaleUpperCase() + o.state.slice(1,o.state.length);
                        var path = modulesPath + top + "/Controllers/"+zi+"/"+o.controller+".js";
                        api.setData(path,DevelopMoban.columnControllers(o),false,{"appName":"#&#appName#&#"});
                    };

                };

                function setCoumnViews(){
                    for(var i in column){
                        var o = column[i];
                        var p = modulesPath+o.templateUrl;
                        if(o.isFolder!=1){
                            if(o.pid==0){
                                api.setData(p,DevelopMoban.modulesViews(),false);
                            }else{
                                api.setData(p,DevelopMoban.columnViews(o.title),false);
                            };
                        };
                    };
                };
                setCoumnViews();

                function setCoumnRouter(name,data) {
                    var path = modulesPath + name[0].toLocaleUpperCase() + name.slice(1,name.length) + "/"+RoutesPath;
                    var obj = {};
                    var htmlArr = [];
                    function setData(d) {
                        for(var i in d){
                            var o = d[i];
                            var newobj = angular.copy(userObj[o.id]);
                            !newobj.newadd||(delete newobj.newadd);
                            var arr = S_Column.GetSon(o.id,column);
                            if(arr.length>0){
                                newobj.isFolder = 1;
                            };
                            obj[o.id]||(setColumnControllers( o ),api.setData(path+newobj.state+".js","/*\n此文件由系统自动生成，请不要修改此文件的内容\n*/\nwjSystem.sysColumn('"+angular.toJson(newobj)+"');",true),obj[o.id] = newobj);
                            if(newobj.isFolder){
                                setData(arr);
                            };


                        };
                    };

                    setData(data);

                };

                for(var i in column){
                    var o = column[i];
                    if(o.pid==0){
                       var newobj = userObj[o.id];
                       delete newobj.newadd;
                        api.setData(RoutesPath+newobj.state+".js","/*\n此文件由系统自动生成，请不要修改此文件的内容\n*/\nwjSystem.sysColumn('"+angular.toJson(newobj)+"');",true);
                        setModulesControllers( o );
                        setDtatic( o );
                        setCoumnRouter(o.state,S_Column.GetSon(o.id,column));
                    };
                };
            };

            return {
                create:function ( obj, call ) {
                    var api = new DevelopApi.create();
                    set( obj, api );
                    api.submit();
                    api.success(function (obj) {
                       console.log("生成结果",obj);
                    });
                }
            };
        }];
    }]);
})();