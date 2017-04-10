/**
 * Created by laomao on 2017/3/12.
 */
/**
 * 首字母转大写
 */
(function () {
    angular.module('System').filter('S_UpperFirstLetter',function(){
        return function(str){
            str=str||"";
            return str.replace(/\b\w+\b/g, function( word ) {
                return word.substring(0,1).toUpperCase() + word.substring(1);
            });
        };
    });
})();