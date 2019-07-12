'use strict';

define(['FlatsunToTruesun', 'angular', 'kendo', 'jquery'], function (flattotrue, angular, kendo, $) {


    /**
     * 初始化一个DADApp的Angular实例
     * @type {module}
     */
    var appModule = angular.module('XXSPA', ['kendo.directives']);


    window.CurrentMapFlag = '二维';
    // 地图窗口放缩按钮标识 0表示正常态，1表示最大化
    window.CurrentMapWindowFlag = 0;

    /***********************************
     * 页头的控制器
     ***********************************/
    appModule.controller('headerController', ['$scope', function ($scope) {


        $scope.sysName = '河北省汽车尾气监测系统';

        // 定义时钟对象
        $scope.clock = {
            currentTime: '00:00:00',
            currentDate: '2015-01-01',
            astronomyTime: '00:00:00',
            astronomyDate: '2015-01-01'
        };

        var getFormatNumber = function (number) {
            var result = number.toString();
            if (number < 10) {
                result = '0' + result;
            }
            return result;
        };
        var getDateString = function (date) {
            var year = date.getFullYear();
            year = year.toString();

            var month = date.getMonth() + 1;
            month = getFormatNumber(month);

            var day = date.getDate();
            day = getFormatNumber(day);

            var hour = date.getHours();
            hour = getFormatNumber(hour);

            var minutes = date.getMinutes();
            minutes = getFormatNumber(minutes);

            var seconds = date.getSeconds();
            seconds = getFormatNumber(seconds);

            return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
        };

        // 更新时钟
        var updateClock = function () {
            //日期
            var now = new Date(); //获取系统日期，即Sat Jul 29 08:24:48 UTC+0800 2006
            var year = now.getFullYear(); //截取年，即2006
            var month = now.getMonth() + 1; //截取月，即07
            if (month < 10) month = '0' + month; //字符串
            var day = now.getDate(); //截取日，即29
            if (day < 10) day = '0' + day; //字符串

            //取时间
            var hh = now.getHours(); //截取小时，即8
            var mm = now.getMinutes(); //截取分钟，即34
            //var ss = now.getTime() % 60000; //获取时间，因为系统中时间是以毫秒计算的，所以秒要通过余60000得到。
            //ss = (ss - (ss % 1000)) / 1000; //然后，将得到的毫秒数再处理成秒
            var ss = now.getSeconds();

            // 拼接时间到字符串
            var time = hh + ':'; //将得到的各个部分连接成一个日期时间
            if (mm < 10) time += '0'; //字符串
            time += mm + ':';
            if (ss < 10) time += '0';
            time += ss;
            $scope.clock.currentTime = time;

            // 拼接当前日期到字符串
            //var week = ['日', '一', '二', '三', '四', '五', '六'];
            var date = year + '-' + month + '-' + day;

            $scope.clock.currentDate = date;

            var week = ['日', '一', '二', '三', '四', '五', '六'];
            var weekNum = now.getDay();
            $scope.clock.currentWeek ='星 期 '+ week[weekNum];

            // 计算天文时间
            /*        var astronomy = new Date(now);
                    var tDay = date.substr(5, 5);
                    var delta = flattotrue[tDay];
                    var deltaMinutes = delta.minutes;
                    var deltaSeconds = delta.seconds;
                    astronomy.setSeconds(astronomy.getSeconds() + deltaSeconds);
                    astronomy.setMinutes(astronomy.getMinutes() + deltaMinutes);
                    // 拼接天文时间
                    var astronomyString = getDateString(astronomy);
                    $scope.clock.astronomyDate = astronomyString.substr(0, 10);
                    $scope.clock.astronomyTime = astronomyString.substr(11, 8);*/
        };

        // 设置更新周期
        setInterval(function () {
            $scope.$apply(updateClock);
        }, 1000);

        // 首次更新
        updateClock();

        // 菜单栏按钮点击事件
        $scope.menuClick = function () {
            if (confirm("您确定退出当前应用程序么？")) {
                window.opener = null;
                window.open('', '_self');
                window.close();
            }
            else {
            }

        };

    }]);


    return appModule;
});
