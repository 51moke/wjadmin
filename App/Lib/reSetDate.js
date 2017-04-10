/**
 * Created by laomao on 2017/3/12.
 */

/**
 * 继承时间格式化
 * 使用new Date(时间戳).format('yyyy-MM-dd h:m:s')方法进行转化即可，返回的就是yyyy-MM-dd h:m:s格式的值
 * @param format
 * @returns {*}
 */
Date.prototype.format =function(format)
{
    var o = {
        "M+" : this.getMonth()+1,
        "d+" : this.getDate(),
        "h+" : this.getHours(),
        "m+" : this.getMinutes(),
        "s+" : this.getSeconds(),
        "q+" : Math.floor((this.getMonth()+3)/3),
        "S" : this.getMilliseconds()
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
};