/**
 * Created by laomao on 2017/1/3.
 */
(function(){
    "use strict";
    angular.module("System").provider("S_Column",[function() {

        this.$get = ["$rootScope","$state","S_Router","$stateParams","$timeout",function($rootScope,$state,S_Router,$stateParams,$timeout) {
            var column = {};
            wjSystem.rootScope = $rootScope;
            wjSystem.state = $state;
            wjSystem.$stateParams = $stateParams;

            $rootScope.system||($rootScope.system = {});
            $rootScope.system.pageState = {
                isAlone:false
            };
            $rootScope.system.TopColumn = [];
            $rootScope.system.Column = [];
            $rootScope.system.ColumnCurrent = {};
            $rootScope.system.TopColumnCurrentId = "";
            $rootScope.system.currentData = {};
            $rootScope.system.UserOnColumnOpen = {};
            $rootScope.system.UserOnColumnClose = {};

            function setSysData( id, obj, data ) {
                obj.sysData = {};
                obj.sysData.position=[];

                function setP(i) {
                    obj.sysData.position.push(angular.extend({},data[i]));
                    if(data[i].pid == 0){
                        return angular.extend({},data[i]);
                    };
                    return setP(data[i].pid);
                };

                obj.sysData.top = setP(id,data,obj.sysData.position);
            };

            function setRouterId( o ) {
                o.routerId = (o.pid==0?o.state:o.sysData.top.state+'.'+o.state);
            };

            function setUrl( o ) {
                o.url = "/" + o.state;
            };

            function setController( o ) {
                if(o.pid==0){
                    o.controller = o.state[0].toUpperCase()+o.state.substr(1)+"Ctrl";
                }else{
                    var arr = [o.sysData.position[0],o.sysData.position[o.sysData.position.length-1]];
                    o.controller = arr.map(function(elem){return elem.state[0].toUpperCase()+elem.state.substr(1);}).join("")+"Ctrl";

                };
            };

            function setTemplateUrl( o ) {
                var top = o.sysData.top;
                var modulname = top.state[0].toUpperCase()+top.state.substr(1);
                if( o.pid == 0 ){
                    o.templateUrl = modulname + "/index.html";
                }else {
                    var state = o.state;
                    var name = state[0].toUpperCase()+state.substr(1);
                    var path = modulname +"/Views/"+name+"/";
                    o.templateUrl = path + name + "View.html";

                };
            };

            function handleColumn(id, o, data,noRouter) {
                setSysData( id, o, data );
                setRouterId( o );
                setController( o );
                setTemplateUrl( o );
                setUrl( o );
                noRouter||setRouter( o );
            };

            function setRouter( o ) {
                if( o.isFolder ==0 ){
                    S_Router.AutoSet(o);
                };
            };

            return {
                init:function () {
                    var data = wjSystem.sysColumn();
                    for(var id in data){
                        var o = angular.extend({},data[id]);
                        column[id]||(column[id] = o,handleColumn( id, o, data ));
                    };

                    $rootScope.system.TopColumn = this.GetSon();

                },
                handleColumn:handleColumn,
                SetColumnCurrent:function ( state ) {

                    $rootScope.system.ColumnCurrent = {};
                    $rootScope.system.ColumnCurrent[state.id] = true;
                    $rootScope.system.UserOnColumnOpen[state.id] = true;


                    function getFuId( pid ) {
                        try {
                            if(column[pid].pid==0){
                                $rootScope.system.TopColumnCurrentId = column[pid].id;
                            }else{
                                $rootScope.system.ColumnCurrent[column[pid].id]=true;
                                $rootScope.system.UserOnColumnOpen[column[pid].id] = true;
                                getFuId(column[pid].pid);
                            };
                        } catch (e) {

                        };
                    };

                    if(state.pid!=0){
                        getFuId(state.pid);
                    }else {
                        $rootScope.system.TopColumnCurrentId = state.id;
                    };

                    this.ChangeModules( $rootScope.system.TopColumnCurrentId );
                },
                ChangeModules:function ( id ) {
                    $rootScope.system.TopColumnCurrentId = id;
                    var mthis = this;
                    function setData( id ) {
                        var d = mthis.GetSon(id);
                        var data = [];
                        for( var i in d ){
                            var obj = d[i];
                            if ( obj.isFolder ){
                                obj.son = setData( obj.id );
                            };
                            data.push( obj );
                        };
                        return data;
                    };
                    $rootScope.system.Column = setData( id );
                },
                GetSon:function (pid,userColumn) {
                    pid = pid||0;
                    var data = [];
                    var c = userColumn||column;
                    for(var i in c){
                        if( c[i].pid == pid ){
                            data.push(angular.copy(c[i]));
                        };
                    };
                    return data;
                },
                Get:function (id) {
                    if(id){
                        return angular.extend({},column[id]);
                    };
                    return angular.extend({},column);
                },
            };
        }];
    }]);
})();