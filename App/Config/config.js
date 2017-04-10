/**
 * Created by laomao on 2017/2/17.
 */
(function () {
    /**
     * 公共配置
     * @type {{login: string}}
     */

	wjSystem.config.html5Mode = false;
	wjSystem.config.DefaultPage = "system";		//默认页
	
	//项目接口公共配置
    wjSystem.config.api = {
        //getNewList:"http://127.0.0.1/getnewslist.do",       //获取新闻列表接口
        //getNewCon:"http://127.0.0.1/getnewscon.do",         //获取新闻内容接口
        //Login:"http://127.0.0.1/login.do",                   //登陆模块
    };

})();