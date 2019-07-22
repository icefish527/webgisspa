/**
 * Created by SYS on 2016/4/26.
 */
define(['app', 'pubsub', '../data/testchartdata','pictureSlider', 'kendo', 'jquery'], function (appModule, pubsub, testchartdata,pictureSlider,kendo,$) {


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
        var names = [];
        var valuesbd = [];
        var valuesyd = [];
        var cheliangjianceData = testchartdata.cheliangjiancepaihang;
        valuesbd = cheliangjianceData.valuebd;
        valuesyd = cheliangjianceData.valueyd;
        names = cheliangjianceData.name;
        var servicedatabd = [];
        var servicedatayd = [];
        for (var i = 0; i < names.length; i++) {
            var obj = new Object();
            obj.name = names[i];
            obj.value = valuesbd[i];
            servicedatabd[i] = obj;

        }
        for (var i = 0; i < names.length; i++) {
            var obj = new Object();
            obj.name = names[i];
            obj.value = valuesyd[i];
            servicedatayd[i] = obj;

        }
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
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    textStyle: {//图例文字的样式
                        color: '#fff',
                        fontSize: 12
                    },
                    data: ['本地车', '异地车'],
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
                        name: '本地车',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: 'default'
                                }
                            }
                        },
                        data: servicedatabd,
                    },
                    {
                        name: '异地车',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: 'default'
                                }
                            }
                        },
                        data: servicedatayd,
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

    //OBD控制器
    appModule.controller("OBDController", ['$scope', function ($scope) {
        //todo:这里调接口
        var names = [];
        var values = [];
        var obdfenlei = testchartdata.obdfenlei;
        values = obdfenlei.value;
        names = obdfenlei.name;
        var servicedata = [];
        for (var i = 0; i < names.length; i++) {
            var obj = new Object();
            obj.name = names[i];
            obj.value = values[i];
            servicedata[i] = obj;

        }


        require(['echarts', 'echarts/theme/macarons', 'echarts/chart/pie'], function (ec, theme) {
            var myChart = ec.init(document.getElementById('obdChart'));

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
                    data: names,
                    textStyle: {//图例文字的样式
                        color: '#fff',
                        fontSize: 12
                    }
                },
                series: [
                    {
                        name: 'OBD技术类型',
                        type: 'pie',
                        data: servicedata,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
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
        });
    }]);

    //黑烟车控制器
    appModule.controller("HeiYanCheController", ['$scope', function ($scope) {
        //todo:这里调接口
        var names = [];
        var valuesbd = [];
        var valuesyd = [];
        var heiyanche = testchartdata.heiyanche;
        valuesbd = heiyanche.valuebd;
        valuesyd = heiyanche.valueyd;
        names = heiyanche.name;
        var servicedatabd = [];
        var servicedatayd = [];
        for (var i = 0; i < names.length; i++) {
            var obj = new Object();
            obj.name = names[i];
            obj.value = valuesbd[i];
            servicedatabd[i] = obj;

        }
        for (var i = 0; i < names.length; i++) {
            var obj = new Object();
            obj.name = names[i];
            obj.value = valuesyd[i];
            servicedatayd[i] = obj;

        }

        require(['echarts', 'echarts/theme/macarons', 'echarts/chart/bar'], function (ec, theme) {
            var myChart = ec.init(document.getElementById('heiyancheChart'));

            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    borderWidth: 0
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: ['本地车', '异地车'],
                    textStyle: {//图例文字的样式
                        color: '#fff',
                        fontSize: 12
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: names,
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
                        }
                    }
                ],
                series: [
                    {
                        name: '本地车',
                        type: 'bar',
                        data: servicedatabd
                    },
                    {
                        name: '异地车',
                        type: 'bar',
                        data: servicedatayd
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


    //遥感监测控制器
    appModule.controller("YaoGanController", ['$scope', function ($scope) {
        //todo:这里调接口
        var names = [];
        var valuesbd = [];
        var valuesyd = [];
        var yaogan = testchartdata.yaogan;
        valuesbd = yaogan.valuebd;
        valuesyd = yaogan.valueyd;
        names = yaogan.name;
        var servicedatabd = [];
        var servicedatayd = [];
        for (var i = 0; i < names.length; i++) {
            var obj = new Object();
            obj.name = names[i];
            obj.value = valuesbd[i];
            servicedatabd[i] = obj;

        }
        for (var i = 0; i < names.length; i++) {
            var obj = new Object();
            obj.name = names[i];
            obj.value = valuesyd[i];
            servicedatayd[i] = obj;

        }

        require(['echarts', 'echarts/theme/macarons', 'echarts/chart/bar'], function (ec, theme) {
            var myChart = ec.init(document.getElementById('yaoganChart'));

            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    borderWidth: 0
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: ['本地车', '异地车'],
                    textStyle: {//图例文字的样式
                        color: '#fff',
                        fontSize: 12
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: names,
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
                        }
                    }
                ],
                color: ['#4ad2ff', 'orange'],
                series: [
                    {
                        name: '本地车',
                        type: 'bar',
                        data: servicedatabd
                    },
                    {
                        name: '异地车',
                        type: 'bar',
                        data: servicedatayd
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

    //报警数据控制器
    appModule.controller("BaoJingShujuController", ['$scope', function ($scope) {
        //todo:这里调接口
        var baojing=testchartdata.baojing;
        function onChange(selectItem) {
            var selected = $.map(selectItem.sender.select(), function (item) {
                return $(item).text();
            });
            //alert("Selected: " + selected.length + " item(s), [" + selected.join(", ") + "]");
        }

        $scope.Options = ({
            dataSource: {
                data: baojing,
                schema: {
                    model: {
                        fields: {
                            datetime: { type: "string" },
                            type: { type: "string" },
                            carNumber: { type: "string" },
                            description: { type: "string" },
                        }
                    }
                }
            },
            scrollable: true,
            sortable: true,
            filterable: false,
            pageable: false,
            resizable: true,
            selectable: "simple row", // "multiple cell"
            change: onChange,
            columns: [
                { field: "datetime", title: "报警时间", width: 80 },
                { field: "type", title: "报警类型", width: 80 },
                { field: "carNumber", title: "车辆牌照", width: 80 },
                { field: "description", title: "描述", width: 80 },
            ]
        });
        $scope.Click = function (event) {
            alert(event);
        }

        // $("#gridGJ").kendoTooltip({
        //     autoHide: true,
        //     showOn: "mouseenter",
        //     filter: ".k-grid-content",
        //     position: "center",
        //     content: function(e){
        //         var dataItem = $("#gridGJ").data("kendoGrid").dataItem(e.target.closest("tr"));
        //         var content = dataItem.description;
        //         return content;
        //     }
        // }).data("kendoTooltip");
    
    }]);
});