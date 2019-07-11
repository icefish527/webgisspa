define(['app', 'appCaches', 'angular', 'kendo'], function (appModule, appCaches, anglular, kendo) {
    // 构造导航栏数据
    var navigationBarData = [
        {
            "title": "交通",
            "kind": "1",
            "nodeId": 1,
            "parentId": null,
            "customSelected": false
        }, {
            "title": "航空",
            "kind": "2",
            "nodeId": 2,
            "parentId": 1,
            "customSelected": true
        }, {
            "title": "港口",
            "kind": "3",
            "nodeId": 3,
            "parentId": 1,
            "customSelected": false
        }, {
            "title": "城市交通",
            "kind": "2",
            "nodeId": 4,
            "parentId": 1,
            "customSelected": false
        }, {
            "title": "铁路",
            "kind": "3",
            "nodeId": 5,
            "parentId": 1,
            "customSelected": false
        }, {
            "title": "公路",
            "kind": "2",
            "nodeId": 6,
            "parentId": 1,
            "customSelected": false
        }, {
            "title": "能源",
            "kind": "1",
            "nodeId": 7,
            "parentId": null,
            "customSelected": false
        }, {
            "title": "电力",
            "kind": "3",
            "nodeId": 8,
            "parentId": 7,
            "customSelected": true
        }, {
            "title": "水利",
            "kind": "2",
            "nodeId": 9,
            "parentId": 7,
            "customSelected": false
        }, {
            "title": "石化",
            "kind": "3",
            "nodeId": 10,
            "parentId": 7,
            "customSelected": true
        }, {
            "title": "核能",
            "kind": "2",
            "nodeId": 11,
            "parentId": 7,
            "customSelected": true
        }, {
            "title": "金融",
            "kind": "1",
            "nodeId": 12,
            "parentId": null,
            "customSelected": false
        }, {
            "title": "银行",
            "kind": "3",
            "nodeId": 13,
            "parentId": 12,
            "customSelected": true
        }, {
            "title": "证券",
            "kind": "2",
            "nodeId": 14,
            "parentId": 12,
            "customSelected": true
        }, {
            "title": "保险",
            "kind": "3",
            "nodeId": 15,
            "parentId": 12,
            "customSelected": true
        }, {
            "title": "综合",
            "kind": "2",
            "nodeId": 16,
            "parentId": 12,
            "customSelected": false
        }
    ];

    // 找到节点
    var findNode = function (nodes, nodeId) {
        var result = null;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeId == nodeId) {
                result = nodes[i];
                break;
            }
        }
        return result;
    };
    // 查找所有子节点
    var findChildren = function (nodes, parentId) {
        if (parentId == null) {
            return [];
        }
        var result = [];
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].parentId == parentId) {
                result.push(nodes[i]);
            }
        }
        return result;
    };
    // 根据节点基本属性生成节点的其他属性
    var buildNodes = function (nodes, onCheck) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].background = 'background' + nodes[i].kind;

            if (nodes[i].kind == '1') {
                nodes[i].dot = 'dotItem0';
                nodes[i].titleStyle = 'titleStyle1';
            } else {
                nodes[i].dot = 'dotItem1';
                nodes[i].titleStyle = 'titleStyle2';
            }

            if (nodes[i].kind == '1') {
                if (nodes[i].customSelected == true) {
                    nodes[i].checkId = 'checkstyle1';
                } else {
                    nodes[i].checkId = 'checkstyle2';
                }
            } else {
                if (nodes[i].customSelected == true) {
                    nodes[i].checkId = 'checkstyle3';
                } else {
                    nodes[i].checkId = 'checkstyle4';
                }
            }

            nodes[i].onCheck = function (dataItem) {
                onCheck(dataItem);
            }
        }
    };
    // 返回一个初始化的Condition
    var initConditionModel = function () {
        var result = {};
        result.SpliceType = 1;
        result.Column = null;
        result.JudgmentType = 3;
        result.JudgmentObject = null;
        result.CompoundConditions = [];
        return result;
    };
    // 根据节点数据生成ConditionModel
    var getCondition = function (nodes) {
        var result = initConditionModel();
        for (var i = 0; i < nodes.length; i++) {
            var parent = findNode(nodes, nodes[i].parentId);
            if (parent != null && nodes[i].customSelected == true) {
                var condition = initConditionModel();
                condition.SpliceType = 2;
                condition.Column = {'ColumnName': 'category'};
                condition.JudgmentObject = nodes[i].title;
                result.CompoundConditions.push(condition);
            }
        }
        if (result.CompoundConditions.length == 0) {
            result = null;
        }
        return result;
    };

    // 导航栏controller
    appModule.controller("navigationBarController", ['$scope', '$compile', 'tempValues', 'filterDescriptionService', 'filterService',
        function ($scope, $compile, tempValues, filterDescriptionService, filterService) {
        // 绑定数据源
        var updateSource = function (dataSource) {
            buildNodes(dataSource, function (dataItem) {
                $scope.onCheckChanged(dataItem);
            });
            var tSource = new kendo.data.DataSource({data: dataSource});
            $scope.source = tSource;
        };

        var tData = [];
        if (tempValues.filterDescription != null) {
            tData = tempValues.filterDescription['category'];
            updateSource(tData);
        } else {
            filterDescriptionService.getFilterDescription(function (cFilter) {
                tData = cFilter['category'];
                updateSource(tData);
            });
        }

        // 响应界面上的切换事件
        $scope.onMapBaseLayerListChanged = function (event, dataItem) {
            if (dataItem.parentId == null) {
                // 说明是一个父级节点，应该收起或展开他的子节点
                var children = findChildren(tData, dataItem.nodeId);
                if (children.length > 0) {
                    if (children[0].kind != '4') {
                        // 当前节点是打开的，应该收起来
                        for (var i = 0; i < children.length; i++) {
                            children[i].kind = '4';
                        }
                    } else {
                        // 当前节点是收起来的，应该打开
                        for (var i = 0; i < children.length; i++) {
                            if (i % 2 == 0) {
                                children[i].kind = '2';
                            } else {
                                children[i].kind = '3';
                            }
                        }
                    }
                }
            } else {
                return;
            }
            updateSource(tData);
        };

        // 每一个节点的check事件
        $scope.onCheckChanged = function (dataItem) {
            // 改变自己的选中状态
            var node = findNode(tData, dataItem.nodeId);
            if (node != null) {
                node.customSelected = !node.customSelected;
            }

            if (node.parentId == null) {
                // 父级节点的check，还需要同步他的所有子节点的选中状态
                var children = findChildren(tData, node.nodeId);
                for (var i = 0; i < children.length; i++) {
                    children[i].customSelected = node.customSelected;
                }
            } else {
                // 子节点被check，还需要统计他的兄弟节点的状态，然后看是否需要修改他父节点的状态
                var children = findChildren(tData, node.parentId);
                var childrenSame = true;
                for (var i = 0; i < children.length; i++) {
                    if (children[i].customSelected != node.customSelected) {
                        childrenSame = false;
                        break;
                    }
                }
                var parent = findNode(tData, node.parentId);
                if (childrenSame == true && node.customSelected == true) {
                    parent.customSelected = true;
                } else {
                    parent.customSelected = false;
                }
            }
            updateSource(tData);

            appCaches.conditions['category'] = getCondition(tData);
            filterService.changeFilter(appCaches.conditions);
        };

        // 数据绑定后，就马上执行的方法
        $scope.onDataBound = function (e) {
            //var view = e.sender;
            //view.select(view.element.children().first());
        };
    }]);

    return appModule;
});
