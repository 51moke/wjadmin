var gulp = require('gulp'),
gulpSequence = require('gulp-sequence'),
del = require('del'),
plumber = require('gulp-plumber'),
concat = require('gulp-concat'),
ngtemplates = require('gulp-angular-templatecache'),
uglify=require('gulp-uglify'),
less = require('gulp-less'),
minifycss = require('gulp-minify-css'),
adminmanage = require('gulp-admin-manage'),
fs=require("fs"),
merge = require('merge-stream'),
open = require("open"),
connect = require('gulp-connect'),
watch = require('gulp-watch');

function getTime() {
    var d = new Date();
    return d.getHours()+":"+(d.getMinutes())+":"+d.getSeconds();
};
function iteratorFodlers(dir){
    var paths = [];
    fs.readdirSync(dir).filter(function(file){
        paths.push(file);
        return true;
    });
    return paths;
};

var config = {
    root:__dirname.replace(/\\/g,"/"),
    appName:"App",
    appPath:"App/",
    modulesPath:'Modules/',
    dist: "dist",
    dev:"dev",
    compile:{}
};
config.compile.appName = config.appName;

var CompileName = process.argv.slice(2)[0];
var ctitle = "启动开发者服务完成";
var mname = config.dev;
if(CompileName=='dev'){
    mname = config.dev;
    ctitle = "启动开发者服务完成";
}else if(CompileName=='dist'){
    mname = config.dist;
    ctitle = "生成生产环境完成";
}else if(CompileName=='test'){
    mname = config.dist;
    ctitle = "生成测试环境完成";
}else{
    console.log("########################友情提示开始###########################\n#  ["+CompileName+"]参数错误,可用命令为：                               #\n#  (开发者环境：gulp dev)                                     #\n#  (测试环境：gulp test)                                      #\n#  (生产环境：gulp dist)                                      #\n########################/友情提示结束##########################");
    return false;
};

//console.log(mname);

//入口文件
gulp.task(CompileName,function (cb) {
    gulpSequence("clean","plug","plug:css:"+mname,"directives:css:"+mname,"plug:js:"+mname,"copy:app:"+mname,"copy:fonts","copy:ImagesDirective","copy:ImagesSysUi","app:"+mname,"modules","ngtemplates:"+mname,"modules:js:"+mname,"modules:css:"+mname,"modules:images","modules:Templates:"+mname,"modules:routes:"+mname,function () {
        if(mname=="dev"){
            gulpSequence("css:develop","copy:develop","watch","develop","webServer","autoopen",function () {
                cb();

                console.log(ctitle);
            });

        }else{
            cb();
            console.log(ctitle);
        };
    });
});

//清除
gulp.task('clean',function(){
    return del(CompileName);
});

//引入的插件处理
var jsPlug = [],cssPlug = [];
gulp.task('plug',function (cb) {
    fs.readFile("plug.json",'utf-8',function(err,data){
        if(err){
            cb(err);
        }else{
            try {
                var obj = JSON.parse(data);
                for(var i in obj.js){
                    jsPlug[i] = config.appPath+obj.js[i];
                };
                for(var i in obj.css){
                    cssPlug[i] = config.appPath+obj.css[i];
                };
                cb();
            }catch (e){
                cb(e);
            };
        };
    });
});
gulp.task('plug:css:'+config.dev,function () {
    return gulp.src(cssPlug)
        .pipe(concat('plug.css'))
        .pipe(gulp.dest(CompileName + "/Static/Style"));
});
gulp.task('plug:css:'+config.dist,function () {
    return gulp.src(cssPlug)
        .pipe(concat('plug.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(CompileName + "/Static/Style"));
});
gulp.task('plug:js:'+config.dev,function () {
    return gulp.src(jsPlug)
                .pipe(plumber())
                .pipe(concat('frame.js'))
                .pipe(gulp.dest(CompileName + "/scripts"));
});
gulp.task('plug:js:'+config.dist,function () {
    return gulp.src(jsPlug)
                .pipe(plumber())
                .pipe(concat('frame.js'))
                .pipe(uglify())
                .pipe(gulp.dest(CompileName + "/scripts"));
});

//公共指令
gulp.task('directives:css:'+config.dev,function () {
    return gulp.src([config.appPath+'Common/**/*.less',config.appPath+'Static/Style/frame.less'])
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(CompileName + "/Static/Style"));
});
gulp.task('directives:css:'+config.dist,function () {
    return gulp.src([config.appPath+'Common/**/*.less',config.appPath+'Static/Style/frame.less'])
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(CompileName + "/Static/Style"));
});

//复制项目静态文件
gulp.task('copy:app:'+config.dev, function() {
    return gulp.src([
        "*.{ico}",
        "Static/Images/**/*.*",
        "Static/fonts/**/*.*",
        "Static/Style/colors/**/*.*",
        "index_*.html"
    ], {
        cwd: config.appPath,
        dot: true,
        base: config.appPath
    }).pipe(gulp.dest(CompileName));
});
gulp.task('copy:app:'+config.dist, function() {
    return gulp.src([
        "*.{ico}",
        "Static/Images/**/*.*",
        "Static/fonts/**/*.*",
        "Static/Style/colors/**/*.*",
        "index.html"
    ], {
        cwd: config.appPath,
        dot: true,
        base: config.appPath
    }).pipe(gulp.dest(CompileName));
});
//复制插件静态文件
gulp.task('copy:fonts', function() {
    return gulp.src([
        "bower_components/bootstrap/fonts/**/*.*",
		"bower_components/font-awesome/fonts/**/*.*"
    ]).pipe(gulp.dest(CompileName+'/Static/fonts'));
});

//复制ImagesDirective静态文件
gulp.task('copy:ImagesDirective', function() {
    return gulp.src([
        "Static/ImagesDirective/**/*.*"
    ], {
        cwd: config.appPath+'Common/Directives',
        dot: true,
        base: config.appPath+'Common/Directives'
    }).pipe(gulp.dest(CompileName));
});
//复制ImagesSysUi静态文件
gulp.task('copy:ImagesSysUi', function() {
    return gulp.src([
        "Static/ImagesSysUi/**/*.*"
    ], {
        cwd: config.appPath+'Common/Ui',
        dot: true,
        base: config.appPath+'Common/Ui'
    }).pipe(gulp.dest(CompileName));
});

//开发者服务
gulp.task('css:develop',function () {
    gulp.src(config.appPath+"Develop/**/*.less")
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(CompileName + "/Develop/Static"));
});
gulp.task('copy:develop',function () {
    return gulp.src([
        "Develop/Api/**/*.*",
        "Develop/Static/images/**/*.*"
    ], {
        cwd: config.appPath,
        dot: true,
        base: config.appPath
    }).pipe(gulp.dest(CompileName));
});

//编译主框架
gulp.task("app:"+config.dev,function () {
    gulp.src([config.appPath+'Lib/**.js',config.appPath + "Config/config."+CompileName+".js",config.appPath + "Config/config.js",config.appPath+"**/*.js","!"+config.appPath + "Config/config.test.js","!"+config.appPath + "Config/config.dist.js","!"+config.appPath + config.modulesPath + "**/*.*"])
        .pipe(plumber())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(CompileName + "/scripts"));
});
gulp.task("app:"+config.dist,function () {

    var arr = [config.appPath+'Lib/**.js',config.appPath + "Config/config."+CompileName+".js",config.appPath + "Config/config.js",config.appPath+"**/*.js","!"+config.appPath + "Config/config.dev.js","!"+config.appPath + config.modulesPath + "**/*.*","!"+config.appPath +  "Develop/**/*.*"];

    if ( CompileName == "test" ){
        //console.log("选择test");
        arr.push("!"+config.appPath + "Config/config.dist.js");
    }else{
        //console.log("选择dist");
        arr.push("!"+config.appPath + "Config/config.test.js");
    };


    gulp.src(arr)
        .pipe(plumber())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest(CompileName + "/scripts"));
});
gulp.task('ngtemplates:'+config.dev, function() {
    var options = {
        module: config.appName,
        //root: "Modules"
    };
    return gulp.src([config.appPath + "Common/**/*.html",config.appPath + "Develop/**/*.html"])
        .pipe(ngtemplates(options))
        //.pipe(angularTemplates())
        .pipe(gulp.dest(CompileName + "/scripts"));
});
gulp.task("ngtemplates:"+config.dist, function() {
    var options = {
        module: config.appName,
        //root: "Modules"
    };
    return gulp.src([config.appPath + "Common/**/*.html"])
        .pipe(ngtemplates(options))
        //.pipe(angularTemplates())
        .pipe(uglify())
        .pipe(gulp.dest(CompileName + "/scripts"));
});


//编译模块
var modulesPath = [];
gulp.task("modules",function (cb) {
    modulesPath = iteratorFodlers(config.appPath+config.modulesPath);
    cb();
});
gulp.task("modules:js:"+config.dev,function () {

    if(modulesPath.length==0){
        return true;
    };

    var tasks = modulesPath.map(function(path) {
        var moduleName = path;
        //console.log(config.appPath + config.modulesPath + moduleName + "/**/*.js")
        return gulp.src([config.appPath + config.modulesPath + moduleName + "/**/*.js","!"+config.appPath + config.modulesPath + moduleName + "/Routes/**/*.*"])
            .pipe(plumber())
            .pipe(concat('app.js'))
            .pipe(gulp.dest(CompileName +  "/" + config.modulesPath + moduleName ));
    });
    return merge(tasks);
});
gulp.task("modules:js:"+config.dist,function () {
    //console.log(modulesPath);
    if(modulesPath.length==0){
        return true;
    };
    var tasks = modulesPath.map(function(path) {
        var moduleName = path;
        //console.log(config.appPath + config.modulesPath + moduleName + "/**/*.js")
        return gulp.src([config.appPath + config.modulesPath + moduleName + "/**/*.js","!"+config.appPath + config.modulesPath + moduleName + "/Routes/**/*.*"])
            .pipe(plumber())
            .pipe(concat('app.js'))
            .pipe(uglify())
            .pipe(gulp.dest(CompileName +  "/" + config.modulesPath + moduleName ));
    });
    return merge(tasks);
});
gulp.task("modules:css:"+config.dev,function () {
    //console.log(modulesPath);
    if(modulesPath.length==0){
        return true;
    };
    var tasks = modulesPath.map(function(path) {
        var moduleName = path;
        return gulp.src([config.appPath + config.modulesPath + moduleName +"/**/*.less" ])
            .pipe(plumber())
            .pipe(less())
            .pipe(concat('style.css'))
            .pipe(gulp.dest(CompileName + "/"+config.modulesPath+moduleName+"/Static/style"));
    });
    return merge(tasks);
});
gulp.task("modules:css:"+config.dist,function () {
    //console.log(modulesPath);
    if(modulesPath.length==0){
        return true;
    };
    var tasks = modulesPath.map(function(path) {
        var moduleName = path;
        return gulp.src([config.appPath + config.modulesPath + moduleName +"/**/*.less" ])
            .pipe(plumber())
            .pipe(less())
            .pipe(concat('style.css'))
            .pipe(minifycss())
            .pipe(gulp.dest(CompileName + "/"+config.modulesPath+moduleName+"/Static/style"));
    });
    return merge(tasks);
});
gulp.task("modules:delImages",function ( cb ) {
    if(modulesPath.length==0){
        cb();
        return true;
    };
    var i = 0;
    modulesPath.map(function(path) {
        i++;
        del(config.dev+"/"+config.modulesPath+path+"/Static/images").then(function () {
            i--;
            if(i==0){
                cb();
            };
        });

    });
});
gulp.task("modules:images",["modules:delImages"],function () {
    //console.log(modulesPath);
    if(modulesPath.length==0){
        return true;
    };
    var tasks = modulesPath.map(function(path) {
        var moduleName = path;
        return gulp.src([
            config.modulesPath+moduleName+"/Static/images/**/*.*"
        ], {
            cwd: config.appPath,
            dot: true,
            base: config.appPath
        }).pipe(gulp.dest(CompileName));
    });
    return merge(tasks);
});
gulp.task("modules:Templates:"+config.dev,function () {
    //console.log(modulesPath);
    if(modulesPath.length==0){
        return true;
    };
    var tasks = modulesPath.map(function(path) {
        var moduleName = path;
        var options = {
            module: config.appName,
            root: moduleName
        };
        return gulp.src([config.appPath + config.modulesPath + moduleName +"/**/*.html" ])
            .pipe(ngtemplates(options))
            //.pipe(angularTemplates())
            .pipe(gulp.dest(CompileName  + "/"+config.modulesPath+moduleName));
    });
    return merge(tasks);
});
gulp.task("modules:Templates:"+config.dist,function () {
    //console.log(modulesPath);
    if(modulesPath.length==0){
        return true;
    };
    var tasks = modulesPath.map(function(path) {
        var moduleName = path;
        var options = {
            module: config.appName,
            root: moduleName
        };
        return gulp.src([config.appPath + config.modulesPath + moduleName +"/**/*.html" ])
            .pipe(ngtemplates(options))
            //.pipe(angularTemplates())
            .pipe(uglify())
            .pipe(gulp.dest(CompileName  + "/"+config.modulesPath+moduleName));
    });
    return merge(tasks);
});



//模块路由
gulp.task("modules:routes:"+config.dev,function () {
    return gulp.src([config.appPath + config.modulesPath  + "**/Routes/**/*.js"])
        .pipe(plumber())
        .pipe(concat('routes.js'))
        .pipe(gulp.dest(CompileName +  "/scripts" ));
});
gulp.task("modules:routes:"+config.dist,function () {
    return gulp.src([config.appPath + config.modulesPath  + "**/Routes/**/*.js"])
        .pipe(plumber())
        .pipe(concat('routes.js'))
        .pipe(uglify())
        .pipe(gulp.dest(CompileName +  "/scripts" ));
});

//监听
var watchType = "";
function watchPlay( event ){
    developServer.UpdateStart({url:event.path,title:"开始更新"});
};
function watchEnd( event ) {
    developServer.UpdateComplete({url:event.path,title:"更新完成"});
};


gulp.task("watch",function () {

    //框架js
   watch([config.appPath+'Lib/**.js',config.appPath+"**/*.js","!"+config.appPath + config.modulesPath + "**/*.*"], function (ev) {
       watchPlay( ev );
       gulpSequence("app:"+config.dev,function () {
           watchEnd( ev );
       });
   });
    //插件css
    watch(cssPlug, function (ev) {
        watchPlay( ev );
        gulpSequence("plug:css:"+config.dev,function () {
            watchEnd( ev );
        });
    });

    //公共指令
    watch([config.appPath+'Common/**/*.less',config.appPath+'Static/Style/frame.less'], function (ev) {
        watchPlay( ev );
        gulpSequence("directives:css:"+config.dev,function () {
            watchEnd( ev );
        });
    });

   //框架模板
    watch([config.appPath + "Common/**/*.html",config.appPath + "Develop/**/*.html"], function (ev) {
        watchPlay( ev );
        gulpSequence("ngtemplates:"+config.dev,function () {
            watchEnd(ev);
        });
    });

    //模块js
    watch([config.appPath + config.modulesPath + "/**/*.js","!"+config.appPath + config.modulesPath + "**/Routes/**/*.*"], function (ev) {
        watchPlay( ev );
        gulpSequence("modules","modules:js:"+config.dev,function () {
            watchEnd(ev);
        });
    });

    //模块css
    watch([config.appPath + config.modulesPath +"/**/*.less" ], function (ev) {
        watchPlay( ev );
        gulpSequence("modules","modules:css:"+config.dev,function () {
            watchEnd(ev);
        });
    });

    //模块模板
    watch([config.appPath + config.modulesPath +"/**/*.html" ], function (ev) {
        watchPlay( ev );
        gulpSequence("modules","modules:Templates:"+config.dev,function () {
         watchEnd(ev);
         });
    });

    //模块图片
    watch([
        config.modulesPath+"**/Static/images/**/*.*"
    ], {
        cwd: config.appPath,
        dot: true,
        base: config.appPath
    }, function (ev) {
        watchPlay( ev );
        gulpSequence("modules","modules:images",function () {
            watchEnd(ev);
        });
    });

    //模块路由
    watch([config.appPath + config.modulesPath  + "**/Routes/**/*.js"], function (ev) {
        watchPlay( ev );
        gulpSequence("modules","modules:routes:"+config.dev,function () {
            watchEnd(ev);
        });
    });

});

//开发者服务
var developServer;
gulp.task("develop",function () {
    developServer = adminmanage.server(config);
});

gulp.task("webServer",function () {
    connect.server({
        root: 'dev',
        port: 20189
    });
});

gulp.task("autoopen",function(){
    open("http://localhost:20189/index_dev.html","chrome");
});
