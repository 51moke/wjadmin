/**!
 * Created by laomao on 2017/1/10.
 */
(function () {
    var jsData = {};
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o){
            if (new RegExp("(" + k + ")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            };
        };
        return fmt;
    };

    var lib = function ( name ) {

        jsData[name]||(jsData[name]={});
        var data = jsData[name];

        return {
            set:function (id,value,reset) {
                if(typeof id == 'undefined'&&!reset){
                    return;
                };
                data[id] = lib.deepCopy(value);

                return this;
            },
            get:function (id) {
                if(typeof id == 'undefined'){
                    return lib.deepCopy(data);
                };
                return lib.deepCopy(data[id]);
            },
            remove:function ( id ) {
                delete data[id];
                return this;
            }
        };
    };

    lib.appIsPalay = false;
    lib.deepCopy = function (p, c) {

        if(typeof p != 'object' ){
            return p;
        };

        var c = c || {};
        for (var i in p) {
            if (typeof p[i] === 'object') {
                c[i] = (p[i].constructor === Array) ? [] : {};
                lib.deepCopy(p[i], c[i]);
            } else {
                c[i] = p[i];
            }
        }
        return c;
    };

    lib.sysColumn = function ( v ) {

        if( typeof v == 'string'){
            try {
                v = JSON.parse(v);
            }catch (e){
                v = "";
            };
        };

        if( typeof v == 'object' ){
            if( typeof v.length == 'undefined'){
                lib('sysColumn').set(v.id,v);
            }else{
                for (var i in v){
                    var o = v[i];
                    lib('sysColumn').set(o.id,o);
                };
            };
        };
        return lib('sysColumn').get();
    };

    lib.aloneState = {};
    lib.setAlone = function ( state ) {
        lib.aloneState[state] = true;
    };

    function state_args( args ) {
        switch(typeof args){
            case 'undefined':
                return '';
                break;
            case 'object':
                var p = angular.toJson(args) ;
                p = p.substring(1,p.length-1);
                return ((args instanceof Array)?'a':'o')+'-'+p;
                break;
            case 'function':
                return state_args( args() );
                break;
            default:
                return 's-'+args;
        };
    };

    lib.go = function (state,args) {
        args = {args:state_args( args )};
        !lib.state||(lib.state.go(state,args));
    };

    lib.stateParams = function () {
        if (lib.$stateParams){
            var type = lib.$stateParams.args.substring(2,0);
            var p = lib.$stateParams.args.substring(2);
            switch(type){
                case 'a-':
                    p = angular.fromJson('['+p+']');
                    break;
                case 'o-':
                    p = angular.fromJson('{'+p+'}');
                    break;
                case 's-':
                    break;
                default:
                    p = lib.$stateParams.args;
            };
            return p;
        };
        return "" ;
    };

    lib.config = {};

    lib.uifunid = function () {
        return function () {

        };
    };

    lib.uifun = function () {
        return function ( userData, _group ) {

            if (typeof userData == 'object'){
                for (var i in userData){
                    var obj  = userData[i];
                    var syncObj = obj.sync||{};
                    var scope = obj.scope||lib.__sysRoot;
                    var group = obj.group||"page";

                    if (!angular.isFunction(scope.sysUi)){
                        scope.sysUi = lib.uifun();
                    };
                    if (!angular.isFunction(scope.sysUi[i])){
                        scope.sysUi[i]  = lib.uifunid();
                    };

                    lib.__sysRoot.sysUi[group+i]||(lib.__sysRoot.sysUi[group+i]=lib.uifunid());
                    lib.__sysRoot.sysUi[group+i]["#userData#"] = {
                        isCompile:false,
                        scope:scope,
                        group:group,
                        sync:syncObj,
                        on:obj.on||{},
                        bind:{}
                    };

                    for (var j in syncObj){
                        lib.__sysRoot.sysUi[group+i][j] = syncObj[j];
                    };
                    scope.sysUi[i] =lib.__sysRoot.sysUi[group+i];

                };
            }else if (typeof userData == 'string'){
                var arg = userData.split('.');
                var group = _group||"page";
                lib.__sysRoot.sysUi[group+arg[0]]||(lib.__sysRoot.sysUi[group+arg[0]]={});
                var userData = lib.__sysRoot.sysUi[group+arg[0]]["#userData#"]||{bind:{},on:{},isCompile:false};
                if(!arg[1]){
                    return {
                        trigger:function (name) {
                            if(angular.isFunction(userData.bind[name])){
                                var arg = Array.prototype.slice.apply(arguments);
                                arg.splice(0,1);
                                userData.bind[name].apply(null,arg);
                            }else if (!userData.isCompile){
                                userData._tmp||(userData._tmp=[]);
                                var arg = Array.prototype.slice.apply(arguments);
                                arg.splice(0,1);
                                userData._tmp.push({key:name,arg:arg});
                            };

                        }
                    };
                }else if( angular.isFunction( userData.bind[arg[1]]) ){
                    return userData.bind[arg[1]];
                }else {
                    return function () {
                        if (!userData.isCompile){
                            userData._tmp||(userData._tmp=[]);
                            userData._tmp.push({key:arg[1],arg:arguments});
                        };
                    };
                };
            };
        };
    };

    lib.version = function () {
        return "1.0.0";
    };

    lib.scrollTop = function () {
        $(".m-rightPos").animate({scrollTop: 0}, "fast");
    };

    window.wjSystem = lib;
})();