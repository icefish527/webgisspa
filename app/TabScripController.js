/**
 * Created by SYS on 2016/4/26.
 */
define(['app', 'pubsub', '../data/testchartdata'], function (appModule, pubsub, testchartdata) {
    var resultInfos = [
        {
            Person: "张三",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "李四",
            State: "下线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "王五",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "张三",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "李四",
            State: "下线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "王五",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "张三",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "李四",
            State: "下线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "王五",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "张三",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "李四",
            State: "下线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "王五",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "张三",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "李四",
            State: "下线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "王五",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "张三",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "李四",
            State: "下线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "王五",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }];
    //sousuoController
    appModule.controller("sousuoController", ['$scope', function ($scope) {
        $scope.keyWord = "";
        $scope.search = function () {
            alert($scope.keyWord);
        };
        $scope.source = new kendo.data.DataSource({
            data: resultInfos
        });
        $scope.Options = ({
            dataSource: {
                data: messages,
                schema: {
                    model: {
                        fields: {
                            Person: { type: "string" },
                            State: { type: "string" },
                            DateTime: { type: "string" },
                        }
                    }
                }
            },
            scrollable: true,
            sortable: true,
            filterable: false,
            pageable: false,
            columns: [
                { field: "Person", title: "人员", width: 25 },
                { field: "State", title: "上下线状态", width: 35 },
                { field: "DateTime", title: "上下线时间", width: 40 },
            ]
        });
        $scope.onListViewChanged = function (kendoEvent, dataItem) {
            alert(dataItem.Person + ' : ' + dataItem.State);
        }
    }]);
    //GridView
    var callInfos = [
        {
            callPerson: "张三",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "李四",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "王五",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "张三",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "李四",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "王五",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "张三",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "李四",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "王五",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "张三",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "李四",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "王五",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "张三",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "李四",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }, {
            callPerson: "王五",
            callDescription: "呼叫事项描述",
            callDateTime: "2016.03.28 09:05:58"
        }];
    appModule.controller("hujiaoController", ['$scope', function ($scope) {
        function onChange(selectItem) {
            var selected = $.map(selectItem.sender.select(), function (item) {
                return $(item).text();
            });
            alert("Selected: " + selected.length + " item(s), [" + selected.join(", ") + "]");
        }

        $scope.Options = ({
            dataSource: {
                data: callInfos,
                schema: {
                    model: {
                        fields: {
                            callPerson: { type: "string" },
                            callDescription: { type: "string" },
                            callDateTime: { type: "string" },
                        }
                    }
                }
            },
            scrollable: true,
            sortable: true,
            filterable: false,
            pageable: false,
            selectable: "simple row", // "multiple cell"
            change: onChange,
            columns: [
                { field: "callPerson", title: "呼叫人", width: 25 },
                { field: "callDescription", title: "描述", width: 35 },
                { field: "callDateTime", title: "呼叫时间", width: 40 },
            ]
        });
        $scope.Click = function (event) {
            alert(event);
        }
    }]);
    var messages = [
        {
            Person: "张三",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "李四",
            State: "下线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "王五",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "张三",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "李四",
            State: "下线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "王五",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "张三",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "李四",
            State: "下线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "王五",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "张三",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "李四",
            State: "下线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "王五",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "张三",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "李四",
            State: "下线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "王五",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "张三",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "李四",
            State: "下线",
            DateTime: "2016.03.28 09:05:58"
        }, {
            Person: "王五",
            State: "上线",
            DateTime: "2016.03.28 09:05:58"
        }];
    appModule.controller("lineController", ['$scope', function ($scope) {
        function onChange(selectItem) {
            var selected = $.map(selectItem.sender.select(), function (item) {
                return $(item).text();
            });
            alert("Selected: " + selected.length + " item(s), [" + selected.join(", ") + "]");
        }

        $scope.Options = ({
            dataSource: {
                data: messages,
                schema: {
                    model: {
                        fields: {
                            Person: { type: "string" },
                            State: { type: "string" },
                            DateTime: { type: "string" },
                        }
                    }
                }
            },
            scrollable: true,
            sortable: true,
            filterable: false,
            pageable: false,
            selectable: "simple row", // "multiple cell"
            change: onChange,
            columns: [
                { field: "Person", title: "人员", width: 25 },
                { field: "State", title: "上下线状态", width: 35 },
                { field: "DateTime", title: "上下线时间", width: 40 },
            ]
        });
    }]);

    appModule.controller("RenShuController", ['$scope', function ($scope) {
        $scope.onLineNum = 1637;
        $scope.outLineNum = 726;
        $scope.sumNum = 2363;
        require(['echarts', 'echarts/theme/macarons', 'echarts/chart/pie'], function (ec, theme) {
            var myChart = ec.init(document.getElementById('RenShuTongJi'));

            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}:<br/> {c} ({d}%)",
                    textStyle: {
                        'fontsize': 12,
                    }
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: ['上线人数', '下线人数'],
                    selectedMode: false,
                    textStyle: {
                        'color': 'white'
                    },
                    padding: 10
                },
                legendHoverLink: true,
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['30%', '40%'],
                        data: [
                            { value: 1637, name: '上线人数' },
                            { value: 726, name: '下线人数' }
                        ]
                    }
                ]
            };
            // 为echarts对象加载数据
            myChart.setOption(option);
            myChart.setTheme(theme);

            timeTicket = setInterval(function () {
                myChart.resize();
            }, 1000);
        });
    }]);
    //QuickNavigation
    var venueInfos = [
        {
            venueId: 1,
            venueName: "场馆一"
        }, {
            venueId: 2,
            venueName: "场馆二"
        }, {
            venueId: 3,
            venueName: "场馆三"
        }, {
            venueId: 4,
            venueName: "场馆四"
        }, {
            venueId: 5,
            venueName: "场馆五"
        }, {
            venueId: 6,
            venueName: "场馆六"
        }, {
            venueId: 7,
            venueName: "场馆七"
        }, {
            venueId: 8,
            venueName: "场馆八"
        }, {
            venueId: 9,
            venueName: "场馆九"
        }, {
            venueId: 10,
            venueName: "场馆十"
        }, {
            venueId: 11,
            venueName: "场馆十一"
        }, {
            venueId: 12,
            venueName: "场馆十二"
        }, {
            venueId: 13,
            venueName: "场馆十三"
        }, {
            venueId: 14,
            venueName: "场馆十四"
        }, {
            venueId: 15,
            venueName: "场馆十五"
        }, {
            venueId: 16,
            venueName: "场馆十六"
        }, {
            venueId: 17,
            venueName: "场馆十七"
        }, {
            venueId: 18,
            venueName: "场馆十八"
        }, {
            venueId: 19,
            venueName: "场馆十九"
        }, {
            venueId: 20,
            venueName: "场馆二十"
        }, {
            venueId: 21,
            venueName: "场馆二十一"
        }, {
            venueId: 22,
            venueName: "场馆二十二"
        }, {
            venueId: 23,
            venueName: "场馆二十三"
        }, {
            venueId: 24,
            venueName: "场馆二十四"
        }, {
            venueId: 25,
            venueName: "场馆二十五"
        }];
    appModule.controller("QuickNavigationController", ['$scope', function ($scope) {
        $scope.venueSource = new kendo.data.DataSource({
            scrollable: true,
            data: venueInfos
        });
        $scope.onListViewChanged = function (kendoEvent, dataItem) {
            alert(dataItem.venueId + ' : ' + dataItem.venueName);
        }
    }]);


    //区域统计控制器
    appModule.controller("QuYuTongJiController", ['$scope', function ($scope) {
        //todo:这里调接口
        var bendizongliang = testchartdata.quyutongji.bendizongliang;
        var bendizhengchang = testchartdata.quyutongji.bendizhengchang;
        var bendiyichang = testchartdata.quyutongji.bendiyichang;
        var yidizongliang = testchartdata.quyutongji.yidizongliang;
        var yidizhengchang = testchartdata.quyutongji.yidizhengchang;
        var yidiyichang = testchartdata.quyutongji.yidiyichang;
        $scope.bendizongliangNum = bendizongliang;
        $scope.bendizhengchangNum = bendizhengchang;
        $scope.bendiyichangNum = bendiyichang;
        $scope.yidizongliangNum = yidizongliang;
        $scope.yidizhengchangNum = yidizhengchang;
        $scope.yidiyichangNum = yidiyichang;
        require(['echarts', 'echarts/theme/macarons', 'echarts/chart/pie'], function (ec, theme) {
            var myChart = ec.init(document.getElementById('bendiChart'));

            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}:<br/> {c} ({d}%)",
                    textStyle: {
                        'fontsize': 12,
                    }
                },
                series: [
                    {
                        name: '本地总量',
                        type: 'pie',
                        radius: ['80%', '90%'],
                        data: [
                            { value: bendizhengchang, name: '本地正常' },
                            { value: bendiyichang, name: '本地异常' }
                        ],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                },
                                color: function (params) {
                                    //自定义颜色
                                    var colorList = [
                                        'green', 'red'
                                    ];
                                    return colorList[params.dataIndex]
                                }
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                position: 'center',
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        }
                    }
                ]
            };
            // 为echarts对象加载数据
            myChart.setOption(option);
            myChart.setTheme(theme);

            timeTicket = setInterval(function () {
                myChart.resize();
            }, 1000);

            //异地图表
            var myChart2 = ec.init(document.getElementById('yidiChart'));

            var option2 = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}:<br/> {c} ({d}%)",
                    textStyle: {
                        'fontsize': 12,
                    }
                },
                series: [
                    {
                        name: '异地总量',
                        type: 'pie',
                        radius: ['80%', '90%'],
                        data: [
                            { value: yidizhengchang, name: '异地正常' },
                            { value: yidiyichang, name: '异地异常' }
                        ],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                },
                                color: function (params) {
                                    //自定义颜色
                                    var colorList = [
                                        'green', 'red'
                                    ];
                                    return colorList[params.dataIndex]
                                }
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                position: 'center',
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        }
                    }
                ]
            };
            // 为echarts对象加载数据
            myChart2.setOption(option2);
            myChart2.setTheme(theme);

            timeTicket = setInterval(function () {
                myChart2.resize();
            }, 1000);



        });
    }]);


    //车辆检测控制器
    appModule.controller("CheLiangJianCeController", ['$scope', function ($scope) {
        //todo:这里调接口
        var cheliangjianceData = testchartdata.cheliangjiancepaihang;
        require(['echarts', 'echarts/theme/macarons', 'echarts/chart/line'], function (ec, theme) {
            var myChart = ec.init(document.getElementById('cheliangjianceChart'));

            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                calculable: true,
                grid: {
                    borderWidth: 0
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: cheliangjianceData.name,
                        axisLabel: {
                            textStyle: {
                                color: "white"
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        splitArea: {
                            show: false
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                color: "white"
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        splitArea: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '车辆数',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: 'default',
                                    color: 'green'
                                }
                            }
                        },
                        data: cheliangjianceData.value,
                    }
                ]
            };
            // 为echarts对象加载数据
            myChart.setOption(option);
            myChart.setTheme(theme);

            timeTicket = setInterval(function () {
                myChart.resize();
            }, 1000);
        });
    }]);
});