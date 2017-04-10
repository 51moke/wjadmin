/**
 * Created by laomao on 2017/3/12.
 */

/**
 * 日期格式化
 */
(function () {
    angular.module('System').filter('S_DateFormat',function(){
        return function(_time,_format,_repair){
            var repair = _repair||1000;
            var time = parseInt(_time);
            var format = _format||'yyyy-MM-dd h:m:s';
            return new Date(time*repair).format( format );
        };
    });
})();