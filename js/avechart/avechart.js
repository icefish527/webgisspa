/**
 * @returns {{setServerAddress 设置服务器地址和端口, getSolutionUrl 获取加载solution的接口地址, getDataUrl 获取加载数据的接口地址, 
 * getSolution 加载solution的方法, setLinkage 设置图表控件的分组联动, cancelLinkage 取消图表控件的分组联动, createChartController 构建图表控件的方法, dataLoader 数据加载器}}
 */
define(function () {
    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 最基础的工具类
     * @constructor
     */
    function Utils() {

    }

    /**
     * 对于自定义对象的克隆
     * @param obj
     * @returns {*}
     */
    Utils.customObjectClone = function (obj) {
        var o;
        switch (typeof obj) {
            case 'undefined':
                break;
            case 'string'   :
                o = obj + '';
                break;
            case 'number'   :
                o = obj - 0;
                break;
            case 'boolean'  :
                o = obj;
                break;
            case 'object'   :
                if (obj === null) {
                    o = null;
                } else {
                    if (obj instanceof Array) {
                        o = [];
                        for (var i = 0, len = obj.length; i < len; i++) {
                            o.push(Utils.customObjectClone(obj[i]));
                        }
                    } else {
                        o = {};
                        for (var k in obj) {
                            o[k] = Utils.customObjectClone(obj[k]);
                        }
                    }
                }
                break;
            default:
                o = obj;
                break;
        }
        return o;
    };

    /**
     * 将 updateObject 的所有属性值赋给 baseObject
     * @param baseObject
     * @param updateObject
     * @returns {*}
     */
    Utils.customUpdateObject = function (baseObject, updateObject) {
        if (baseObject == null) {
            return Utils.customObjectClone(updateObject);
        }

        if (updateObject == null) {
            return Utils.customObjectClone(baseObject);
        }

        var o;
        if (typeof baseObject == 'object' && typeof baseObject == typeof updateObject) {
            if (baseObject instanceof Array) {
                o = Utils.customObjectClone(baseObject);
                for (var i = 0; i < baseObject.length; i++) {
                    o[i] = Utils.customUpdateObject(o[i], updateObject[i]);
                }
            } else {
                o = Utils.customObjectClone(baseObject);
                for (var k in updateObject) {
                    o[k] = Utils.customUpdateObject(o[k], updateObject[k]);
                }
            }
        } else {
            o = Utils.customObjectClone(updateObject);
        }
        return o;
    };

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 自定义的List类型，封装常用的List方法
     * @param inArray {Array} 一个数组
     * @constructor
     */
    function List(inArray) {
        this.pArray = Utils.customObjectClone(inArray);
    }

    /**
     * 查找所有满足条件的元素下标的集合
     * @param predicate {function(item)} 一个必须返回 true or false 的方法
     * @returns {Array}
     */
    List.prototype.customFindAllIndex = function (predicate) {
        if (this.pArray == null) {
            throw new TypeError('数组为空');
        }

        var resultArray = [];
        for (var i = 0; i < this.pArray.length; i++) {
            var item = this.pArray[i];
            if (predicate(item)) {
                resultArray.push(i);
            }
        }
        return resultArray;
    };

    /**
     * 查找所有满足条件的元素的集合
     * @param predicate {function(item)} 一个必须返回 true or false 的方法
     * @returns {Array}
     */
    List.prototype.customFindAll = function (predicate) {
        var tArray = this.customFindAllIndex(predicate);
        var resultArray = [];
        for (var i = 0; i < tArray.length; i++) {
            var index = tArray[i];
            resultArray.push(this.pArray[index]);
        }
        return resultArray;
    };

    /**
     * 查找第一个满足条件的元素（没有找到则为null）
     * @param predicate {function(item)} 一个必须返回 true or false 的方法
     * @returns {*}
     */
    List.prototype.customFind = function (predicate) {
        var tArray = this.customFindAll(predicate);
        if (tArray.length > 0) {
            return tArray[0];
        } else {
            return null;
        }
    };

    /**
     * 移除所有满足条件的元素
     * @param predicate {function(item)} 一个必须返回 true or false 的方法
     */
    List.prototype.customRemoveAll = function (predicate) {
        var tArray = this.customFindAllIndex(predicate);
        if (tArray.length > 0) {
            for (var i = tArray.length - 1; i >= 0; i--) {
                var index = tArray[i];
                this.pArray.splice(index, 1);
            }
        }
    };

    /**
     * 查找最值的元素
     * @param predicate {function(item)} 一个必须返回可以比较的值的方法
     * @param inMaxOrMin 1表示最大值，0表示最小值
     * @returns {*}
     */
    List.prototype.customMaxOrMin = function (predicate, inMaxOrMin) {
        if (this.pArray == null) {
            throw new TypeError('数组为空');
        }

        if (this.pArray.length == 0) {
            return null;
        }

        var tArray = [];
        for (var i = 0; i < this.pArray.length; i++) {
            var item = this.pArray[i];
            tArray.push(predicate(item));
        }

        var tValue = null;
        if (inMaxOrMin == 1) {
            tValue = Math.max.apply(null, tArray);
        } else {
            tValue = Math.min.apply(null, tArray);
        }

        var tIndex = $.inArray(tValue, tArray); // 返回下标
        return this.pArray[tIndex];
    };

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 用于处理颜色的帮助类
     * @constructor
     */
    function SeriesColorGetter() {

    }

    /**
     * 将颜色字符串（'#rrggbb'或者'#aarrggbb'）转换为{a,r,g,b}的存储结构
     * @param inColorString
     * @returns {{a,r,g,b}}
     */
    SeriesColorGetter.getColorStructureFromString = function (inColorString) {
        // 格式：'#rrggbb'或者'#aarrggbb'
        var result = InitHelper.initColorStructure();
        if (inColorString.length == 7) {
            var rString = inColorString.substr(1, 2);
            var gString = inColorString.substr(3, 2);
            var bString = inColorString.substr(5, 2);
            result.r = parseInt(rString, 16);
            result.g = parseInt(gString, 16);
            result.b = parseInt(bString, 16);
        } else if (inColorString.length == 9) {
            var aString = inColorString.substr(1, 2);
            var rString = inColorString.substr(3, 2);
            var gString = inColorString.substr(5, 2);
            var bString = inColorString.substr(7, 2);
            result.r = parseInt(rString, 16);
            result.g = parseInt(gString, 16);
            result.b = parseInt(bString, 16);
            result.a = parseInt(aString, 16) / 255.0;
        }
        return result;
    };

    /**
     * 获取一个颜色结构体
     * @param inSeriesNumber {int}
     * @param inColorNumber {int}
     * @returns {{a,r,g,b}}
     */
    SeriesColorGetter.getColorStructure = function (inSeriesNumber, inColorNumber) {
        var tColorMatrix = [
            ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed', '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0'],
            ['#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700', '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0']];

        var rowIndex = inSeriesNumber % tColorMatrix.length;
        var columnIndex = inColorNumber % tColorMatrix[rowIndex].length;
        var tColorString = tColorMatrix[rowIndex][columnIndex];
        var result = SeriesColorGetter.getColorStructureFromString(tColorString);
        return result;
    };

    /**
     * 将{a,r,g,b}转换为浏览器支持的颜色字符串：'rgba(*,*,*,*)'
     * @param inColorStructure {{a,r,g,b}}
     * @returns {string}
     */
    SeriesColorGetter.getRGBAStringByColorStructure = function (inColorStructure) {
        var result = 'rgba(' + inColorStructure.r + ',' + inColorStructure.g + ',' + inColorStructure.b + ',' + inColorStructure.a + ')';
        return result;
    };

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 用于初始化自定义类型的帮助类
     * @constructor
     */
    function InitHelper() {

    }

    /**
     * 返回一个初始化的条件模型
     * @returns {{SpliceType, Column, JudgmentType, JudgmentObject, CompoundConditions}}
     */
    InitHelper.initAdapterConditionModel = function () {
        var result = {};
        result.SpliceType = 1;
        result.Column = null;
        result.JudgmentType = 3;
        result.JudgmentObject = null;
        result.CompoundConditions = [];
        return result;
    };

    /**
     * 返回一个颜色结构体
     * @returns {{a,r,g,b}}
     */
    InitHelper.initColorStructure = function () {
        var result = {};
        result.r = 255;
        result.g = 0;
        result.b = 0;
        result.a = 1;
        return result;
    };

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 处理DataTable的帮助类
     * @constructor
     */
    function DataTableHelper() {

    }

    /**
     * 获取数据中某一列的列值枚举
     * @param inDataTable 属于表格
     * @param columnName 列名
     * @returns {Array}
     */
    DataTableHelper.getValueArrayFromTableWithColumnName = function (inDataTable, columnName) {
        var result = [];
        if (inDataTable != null && inDataTable.rows != null) {
            for (var i = 0; i < inDataTable.rows.length; i++) {
                var item = inDataTable.rows[i];
                var tempIndex = $.inArray(item[columnName], result); // 返回下标
                if (tempIndex == -1) {
                    result.push(item[columnName]);
                }
            }
        }
        return result;
    };

    /**
     * 获取数据中特定图例和特定维度的指标的值
     * @param inDataTable 数据表格
     * @param inMeasureName 指标列名称
     * @param inLegendName 图例列名称
     * @param inLegendValue 图例的值
     * @param inDimensionName 维度列名称
     * @param inDimensionValue 维度的值
     * @returns {number}
     */
    DataTableHelper.getValueFromTableByMeasureAndLegendAndDimension = function (inDataTable, inMeasureName, inLegendName, inLegendValue, inDimensionName, inDimensionValue) {
        var tResult = 0;
        for (var i = 0; i < inDataTable.rows.length; i++) {
            var item = inDataTable.rows[i];
            if (item[inDimensionName] == inDimensionValue) {
                if (inLegendName != null) {
                    if (item[inLegendName] != inLegendValue) {
                        continue;
                    }
                }
                tResult = item[inMeasureName];
                break;
            }
        }
        return tResult;
    };

    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 处理层级维度的帮助类
     * @constructor
     */
    function LevelDimensionHelper() {

    }

    /**
     * 获取层级维度中的最大层级(1)或者最小层级(0)
     * @param inDataViewModel 视图模型
     * @param inMaxOrMin 1表示最大层级，0表示最小层级
     * @returns {number}
     */
    LevelDimensionHelper.getMaxOrMinDimensionLevel = function (inDataViewModel, inMaxOrMin) {
        var tList = new List(inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.DimensionList);
        var tLevelColumns = tList.customFindAll(function (inItem) {
            return inItem.LevelType != 0;
        });

        if (tLevelColumns.length == 0) {
            return 0;
        }

        tList = new List(tLevelColumns);
        var tResultColumn = tList.customMaxOrMin(function (inItem) {
            return inItem.Level;
        }, inMaxOrMin);
        return tResultColumn.Level;
    };

    /**
     * 获取跟视图同等级的列
     * @param inDataViewModel 视图模型
     * @returns {*}
     */
    LevelDimensionHelper.getSameLevelColumn = function (inDataViewModel) {
        var result = null;
        var tCurrentLevel = inDataViewModel.CurrentLevel;

        if (tCurrentLevel == 0) {
            return result;
        }
        if (tCurrentLevel == -1) {
            tCurrentLevel = LevelDimensionHelper.getMaxOrMinDimensionLevel(inDataViewModel, 1);
        }

        var tList = new List(inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.DimensionList);
        result = tList.customFind(function (inItem) {
            return inItem.LevelType != 0 && inItem.Level == tCurrentLevel;
        });
        return result;
    };

    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // ########################################################################

    /**
     * 定义了许多静态方法，用于生成查询模型
     * @constructor
     */
    function QueryModelBuilder() {

    }

    /**
     * 根据视图模型和联动条件，生成查询模型，并返回查询模型
     * @param inDataViewModel
     * @param inLinkageCondition
     * @returns {{measure: *, source: *, condition: *, group: *}}
     */
    QueryModelBuilder.getQueryModel = function (/** DataViewModel */ inDataViewModel, /** AdapterConditionModel */ inLinkageCondition) {
        var tMeasures = QueryModelBuilder.getMeasures(inDataViewModel);
        var tDataViewKey = QueryModelBuilder.getDataSourceCode(inDataViewModel);
        var tCondition = QueryModelBuilder.getTheCondition(inDataViewModel, inLinkageCondition);
        var tGroups = QueryModelBuilder.getGroups(inDataViewModel);
        var tQueryModel = {
            'Measure': tMeasures,
            'Token': SolutionGetter.pToken,
            'DataViewKey': tDataViewKey,
            'Condition': tCondition,
            'Group': tGroups
        };
        //alert(JSON.stringify(tQueryModel));
        return tQueryModel;
    };

    // 获取指标的部分 #########################################################

    /**
     * 获取指标列集合
     * @param inDataViewModel
     * @returns {array}
     */
    QueryModelBuilder.getMeasures = function (inDataViewModel) {
        var tArray = inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.MeasureList;
        if (tArray == null || !(tArray instanceof Array)) {
            tArray = [];
        }

        var tList = new List(tArray);
        tList.customRemoveAll(function (inItem) {
            return inItem.CountMode == 6;
        });
        return tList.pArray;
    };

    // 获取数据源编码部分 ##################################################

    /**
     * 获取视图模型使用到的数据源的唯一标识
     * @param inDataViewModel
     * @returns {string}
     */
    QueryModelBuilder.getDataSourceCode = function (inDataViewModel) {
        var result = inDataViewModel.Key;
        return result;
    };

    // 获取限制条件的部分 ########################################################

    /**
     * 将多个条件封装成一个条件
     * @param inConditions
     * @returns {*}
     */
    QueryModelBuilder.getConditionByConditions = function (inConditions) {
        var result = null;
        if (inConditions != null && inConditions.length != 0) {
            if (inConditions.length == 1) {
                result = inConditions[0];
            } else {
                result = InitHelper.initAdapterConditionModel();
                for (var i = 0; i < inConditions.length; i++) {
                    var tCondition = inConditions[i];
                    result.compoundConditions.push(tCondition);
                }
            }
        }
        return result;
    };

    /**
     * 将联动筛选模型转换为等价的条件
     * @param inLinkages
     * @returns {*}
     */
    QueryModelBuilder.getLinkageCondition = function (inLinkages) {
        var tConditionArray = [];
        if (inLinkages != null && inLinkages instanceof Array) {
            for (var i = 0; i < inLinkages.length; i++) {
                var tLinkage = inLinkages[i];
                var tCondition = InitHelper.initAdapterConditionModel();
                tCondition.column = tLinkage.TargetColumn;
                tCondition.judgmentObject = tLinkage.ConditionString;
                tConditionArray.push(tCondition);
            }
        }
        return QueryModelBuilder.getConditionByConditions(tConditionArray);
    };

    /**
     * 获取层级维度的条件
     * @param inDataViewModel
     * @param inLevel
     * @returns {*}
     */
    QueryModelBuilder.getLevelLimitCondition = function (inDataViewModel, inLevel) {
        var tCurrentPathList = new List(inDataViewModel.CurrentPath);
        var tItems = tCurrentPathList.customFindAll(function (cItem) {
            return cItem.TargetColumn.Level < inLevel;
        });
        return QueryModelBuilder.getLinkageCondition(tItems);
    };

    /**
     * 根据视图模型和联动条件，整合为一个条件，并返回
     * @param inDataViewModel
     * @param inLinkageCondition
     * @returns {*}
     */
    QueryModelBuilder.getTheCondition = function (/** DataViewModel */inDataViewModel, /** AdapterConditionModel */inLinkageCondition) {
        var tConditions = [];
        var tPageCondition = inDataViewModel.AdapterConditionModel;
        var tLevelLimitCondition = QueryModelBuilder.getLevelLimitCondition(inDataViewModel, inDataViewModel.CurrentLevel);
        if (tPageCondition != null && (tPageCondition.Column != null || tPageCondition.CompoundConditions.length != 0)) {
            tConditions.push(tPageCondition);
        }
        if (tLevelLimitCondition != null) {
            tConditions.push(tLevelLimitCondition);
        }
        if (inLinkageCondition != null && (inLinkageCondition.Column != null || inLinkageCondition.CompoundConditions.length != 0)) {
            tConditions.push(inLinkageCondition);
        }
        return QueryModelBuilder.getConditionByConditions(tConditions);
    };

    // 获取分组的部分 ###############################################################################

    /**
     * 根据视图模型生成并返回 group by 所需要的列的集合
     * @param inDataViewModel
     * @returns {Array}
     */
    QueryModelBuilder.getGroups = function (inDataViewModel) {
        var result = [];

        var tList1 = new List(inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.DimensionList);
        tList1.customRemoveAll(function (inItem) {
            return inItem.LevelType != 0 && inItem.Level != inDataViewModel.CurrentLevel;
        });
        var tSameLevelColumn = LevelDimensionHelper.getSameLevelColumn(inDataViewModel);
        if (tSameLevelColumn != null) {
            tList1.pArray.push(tSameLevelColumn);
        }
        for (var i = 0; i < tList1.pArray.length; i++) {
            var item = tList1.pArray[i];
            result.push(item);
        }

        var tList2 = new List(inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.MeasureList);
        var tOriginalValueColumns = tList2.customFindAll(function (inItem) {
            return inItem.CountMode == 6; // 该列的统计模式为：原始值
        });
        for (var i = 0; i < tOriginalValueColumns.length; i++) {
            var item = tOriginalValueColumns[i];
            result.push(item);
        }

        result = QueryModelBuilder.getGroupsWithLegendsAndDimensions(inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.LegendList, result);
        return result;
    };

    /**
     * 将合并两个列集合，返回集合不为空，可能包含0个元素
     * @param inLegends
     * @param inDimensions
     * @returns {*}
     */
    QueryModelBuilder.getGroupsWithLegendsAndDimensions = function (inLegends, inDimensions) {
        var result = Utils.customObjectClone(inDimensions);
        if (result == null) {
            result = [];
        }

        if (inLegends != null && inLegends.length != 0) {
            for (var i = 0; i < inLegends.length; i++) {
                var item = inLegends[i];
                if (QueryModelBuilder.hasSameNameColumn(result, item.ColumnName) == false) {
                    var copyItem = Utils.customObjectClone(item);
                    result.push(copyItem);
                }
            }
        }
        return result;
    };

    /**
     * 在列集合中，是否包含有指定列名的列
     * @param inColumns 列集合
     * @param columnName 指定的列名
     * @returns {boolean}
     */
    QueryModelBuilder.hasSameNameColumn = function (inColumns, columnName) {
        var result = false;
        if (inColumns != null && inColumns.length != 0) {
            for (var i = 0; i < inColumns.length; i++) {
                var item = inColumns[i];
                if (item.ColumnName == columnName) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    };

    // ######################################################################################

    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 用于异步从网络接口获取Solution的帮助类
     * @constructor
     */
    function SolutionGetter() {

    }

    /**
     * 异步加载 Solution
     * @param inUrl {string} 接口地址
     * @param inToken {string} Token
     * @param inCallback {function(response)} 加载成功后的回调
     */
    /*
    SolutionGetter.getSolution = function (inUrl, inToken, inCallback) {
        SolutionGetter.pToken = inToken;
        var tData = {
            token: inToken
        };
        $.ajax({
            type: 'POST',
            contentType: "application/x-www-form-urlencoded",
            url: inUrl,
            data: tData,
            success: function (response) {
                inCallback(response);
            },
            error: function (e) {
                alert('获取Solution失败了。');
            }
        });
    };
    */
    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 用于异步从网络接口获取数据的帮助类
     * @constructor
     */
    function DataLoader() {

    }

    /**
     * 异步加载数据
     * @param inUrl {string} 接口地址
     * @param inQueryModel 查询模型
     * @param inCallback {function(response)} 加载成功后的回调
     */
    //DataLoader.getData = function (inUrl, inQueryModel, inCallback) {
    //    var blob = new Blob([JSON.stringify(inQueryModel)], {"type": "text/plain"});
    //    var tData = new FormData();
    //    tData.append("uploadfile", blob, "uploadfile");

    //    $.ajax({
    //        type: 'POST',
    //        cache: false,
    //        contentType: false,
    //        processData: false,
    //        url: inUrl,
    //        data: tData,
    //        success: function (response) {
    //            if (response != "") {
    //                inCallback(response);
    //            }
    //        },
    //        error: function (e) {
    //            alert('获取数据失败了。');
    //        }
    //    });
    //};

    /**
     * 异步加载数据
     * @param inController 图标控件
     * @param inLinkage 条件模型
     * @param inCallback {function(response)} 加载成功后的回调
     */
    DataLoader.loadData = function (inController, inLinkage, inCallback) {
        var tQueryModel = QueryModelBuilder.getQueryModel(inController.pDataViewModel, inLinkage);
        DataLoader.getData(getDataUrl(), tQueryModel, function (response) {
            var tData = JSON.parse(response);
            inCallback(inController, tData);
        });
    };

    // --------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 用于记录服务器的类
     * @constructor
     */
    function UrlCache() {

    }

    /**
     * 设置服务器
     * @param serverAddress {string} 服务器 host 和 port
     */
    function setServerAddress(serverAddress) {
        UrlCache.pServerAddress = serverAddress;
    }

    /**
     * 获取加载 Solution 的地址
     * @returns {string}
     */
    function getSolutionUrl() {
        return UrlCache.pServerAddress + 'getSolution';
    }

    /**
     * 获取加载数据的地址
     * @returns {string}
     */
    function getDataUrl() {
        return UrlCache.pServerAddress + 'getData';
    }

    // --------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 图表基础类
     * @param inDiv {string} 形如：'#divId'
     * @param inChartType {string} 形如：'echarts/chart/bar'
     * @constructor
     */
    function ChartBase(inDiv, inChartType) {
        var obj = this;
        this.pDiv = inDiv;
        this.pChart = null;

        require(
            [
                'echarts',
                inChartType // 'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                obj.pChart = ec.init(inDiv);
                // 显示加载中的遮罩
                obj.pChart.showLoading();

                var tEChartsConfig = require('echarts/config');
                // 点击图表元素
                obj.pChart.on(tEChartsConfig.EVENT.CLICK, function (param) {
                    obj.onEChartClick(param);
                });
                // 点击图例
                obj.pChart.on(tEChartsConfig.EVENT.LEGEND_SELECTED, function (param) {
                    obj.onEChartLegendSelected(param);
                });

                // 注册尺寸改变事件
                $(inDiv).closest(".gridItem").bind("sizeChanged", function () {
                    obj.pChart.resize();
                });
            }
        );
    }

    ChartBase.prototype.onEChartClick = function (param) {
        if (this.ClickCallback != null) {
            this.ClickCallback(param.seriesIndex, param.dataIndex);
        }
    };

    ChartBase.prototype.onEChartLegendSelected = function (param) {
        if (this.LegendClickCallback != null) {
            // 图例的名字格式为：'legend@' + 图例名称
            var tLegendName = param.target;
            var tSelected = param.selected[tLegendName];
            tLegendName = tLegendName.substr(7, tLegendName.length - 7);
            this.LegendClickCallback(tLegendName, tSelected);
        }
    };

    // -------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 管理图表控件联动的连接器
     * @constructor
     */
    function ChartConnector() {
        /**
         * 控件列表
         * @type {Array}
         */
        this.pControllerArray = [];
    }

    /**
     * 添加一个需要联动的图表控件
     * @param inController
     */
    ChartConnector.prototype.addController = function (inController) {
        // 域标记
        var obj = this;

        // 注册控件的选中事件
        inController.pCheckCallback = function (cController, cLinkage) {
            obj.checkOtherControllers(cController, cLinkage);
        };

        // 注册控件的取消选中事件
        inController.pUncheckCallback = function (cController) {
            obj.uncheckOtherControllers(cController);
        };

        // 注册控件的图例选中事件
        inController.pLegendCheckCallback = function (cController, cLinkage) {
            obj.checkOtherControllers(cController, cLinkage);
        };

        // 注册控件的取消图例选中事件
        inController.pLegendUncheckCallback = function (cController) {
            obj.uncheckOtherControllers(cController);
        };

        // 向控件列表中追加控件
        this.pControllerArray.push(inController);
    };

    /**
     * 删除一个不需要联动的图表控件
     * @param inController
     */
    ChartConnector.prototype.removeController = function (inController) {
        // 返回下标
        var tIndex = $.inArray(inController, this.pControllerArray);
        if (tIndex != -1) {
            // inController在this.pControllerArray中存在
            var tController = this.pControllerArray[tIndex];

            // 注销选中事件和取消选中事件
            tController.pCheckCallback = null;
            tController.pUncheckCallback = null;

            // 从控件列表中移除控件
            this.pControllerArray.splice(tIndex, 1);
        }
    };

    /**
     * 把其它图表设置为被联动的状态
     * @param inController
     * @param inLinkage
     */
    ChartConnector.prototype.checkOtherControllers = function (/** ChartController */ inController, /** AdapterConditionModel */ inLinkage) {
        var obj = this;
        for (var i = 0; i < this.pControllerArray.length; i++) {
            var tController = this.pControllerArray[i];
            if (tController === inController) {
                continue;
            }
            DataLoader.loadData(tController, inLinkage, function (cController, cData) {
                obj.loadDataCallback(cController, cData);
            });
        }
    };

    /**
     * 异步从网络接口获取到数据后联动
     * @param inController
     * @param inData
     */
    ChartConnector.prototype.loadDataCallback = function (inController, inData) {
        inController.setToLinkage(inData);
    };

    /**
     * 把其它图表控件取消联动或选中
     * @param inController
     */
    ChartConnector.prototype.uncheckOtherControllers = function (inController) {
        for (var i = 0; i < this.pControllerArray.length; i++) {
            var tController = this.pControllerArray[i];
            if (tController === inController) {
                continue;
            }
            tController.backToOriginal();
        }
    };

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 单例模式的分组联动对象
     * 使用new来重复获取对象，保证是单例
     * @returns {ChartGroupPrivate|*}
     * @constructor
     */
    function ChartGroupPrivate() {
        // 确保只有单例
        if (ChartGroupPrivate.unique !== undefined) {
            return ChartGroupPrivate.unique;
        }

        this.pConnectorArray = {};

        ChartGroupPrivate.unique = this;
    }

    /**
     * 将一个图表控件添加到一个联动分组中
     * @param inController 图表控件
     * @param inGroupName {string} 联动分组名称
     */
    ChartGroupPrivate.prototype.setLinkage = function (inController, inGroupName) {
        if (this.pConnectorArray[inGroupName] == null) {
            this.pConnectorArray[inGroupName] = new ChartConnector();
            this.pConnectorArray[inGroupName].addController(inController);
        } else {
            var tConnector = this.pConnectorArray[inGroupName];
            // 返回下标
            var tIndex = $.inArray(inController, tConnector.pControllerArray);
            if (tIndex == -1) {
                tConnector.addController(inController);
            }
        }
    };

    /**
     * 将一个图表控件取消联动
     * @param inController 图表控件
     */
    ChartGroupPrivate.prototype.cancelLinkage = function (inController) {
        for (var i = 0; i < this.pConnectorArray.length; i++) {
            this.pConnectorArray[i].removeController(inController);
        }
    };

    // -----------------------------------------------------------------------------------------------------------------------------------

    /**
     * 分组联动
     * @constructor
     */
    function ChartGroup() {

    }

    /**
     * 将一个图表控件添加到一个联动分组中
     * @param inController 图表控件
     * @param inGroupName {string} 联动分组名称
     */
    ChartGroup.setLinkage = function (inController, inGroupName) {
        var tChartGroupPrivate = new ChartGroupPrivate();
        tChartGroupPrivate.setLinkage(inController, inGroupName);
    };

    /**
     * 将一个图表控件取消联动
     * @param inController 图表控件
     */
    ChartGroup.cancelLinkage = function (inController) {
        var tChartGroupPrivate = new ChartGroupPrivate();
        tChartGroupPrivate.cancelLinkage(inController);
    };

    // -------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 柱图控件
     * @param inDiv {string} 形如：'#divId'
     * @constructor
     */
    function BarChartController(inDiv) {
        var obj = this;
        this.pChartBase = new ChartBase(inDiv, 'echarts/chart/bar');
        this.pChartBase.ClickCallback = function (inSeriesIndex, inDataIndex) {
            obj.onEChartClick(inSeriesIndex, inDataIndex);
        };
        this.pChartBase.LegendClickCallback = function (cLegendName, cSelected) {
            obj.onLegendSelected(cLegendName, cSelected);
        };
    }

    BarChartController.prototype.firstLoad = function (inDataViewModel, inDataTable, inDisplayType, inDisplayMode, inOption) {
        var tMeasureColumns = inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.MeasureList;
        var tLegendColumns = inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.LegendList;
        var tDimensionColumns = inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.DimensionList;

        this.pMeasureColumns = tMeasureColumns;
        this.pLegendColumns = tLegendColumns;
        this.pDimensionColumns = tDimensionColumns;
        this.pDataViewModel = inDataViewModel;
        this.pOriginalDataTable = inDataTable;
        this.pCustomOption = inOption;

        var tOption = this.buildBarEChartsData(tMeasureColumns, tLegendColumns, tDimensionColumns, inDataTable, inDisplayType, inDisplayMode);
        this.pChartBase.pChart.setOption(tOption);
        this.pChartBase.pChart.hideLoading();

        // 虽然看上去比较多余，但目前这句代码，解决了标签显示异常的问题
        this.backToOriginal();
        // 以前用来查看QueryModel的生成是否正确而写的代码
        //var ttt = JSON.stringify(QueryModelBuilder.getQueryModel(inDataViewModel, null));
    };

    BarChartController.prototype.backToOriginal = function () {
        this.setLegendCancel();
        this.setBarCancel();
    };

    BarChartController.prototype.setToLinkage = function (inLinkageData) {
        this.setLegendCancel();
        this.setBarHighlight(inLinkageData);
        this.pSelectedItem = null;
    };

    BarChartController.prototype.setLabelDisplay = function (wantShow) {
        if (this.pSeries == null || this.pSeries.length == 0) {
            return;
        }
        for (var i = 0; i < this.pSeries.length; i++) {
            if (i % 3 == 0) {
                for (var j = 0; j < this.pSeries[i].data.length; j++) {
                    var item = this.pSeries[i].data[j];
                    if (item.value != 0) {
                        item.itemStyle.normal.label.show = wantShow;
                    } else {
                        item.itemStyle.normal.label.show = false;
                    }
                }
            }
        }
        this.pChartBase.pChart.setSeries(this.pSeries);
    };

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------

    BarChartController.prototype.buildBarEChartsData = function (inMeasureColumns, inLegendColumns, inDimensionColumns, inDataTable, inDisplayType, inDisplayMode) {
        // 标记
        var obj = this;

        if (inMeasureColumns == null || inMeasureColumns.length == 0 ||
            inDimensionColumns == null || inDimensionColumns.length != 1) {
            return null;
        }

        // 维度列名称
        var tDimensionName = inDimensionColumns[0].ColumnName;
        // 生成横轴
        var tDimensionValues = DataTableHelper.getValueArrayFromTableWithColumnName(inDataTable, tDimensionName);
        this.pDimensionValues = tDimensionValues;

        // 构造数据
        var tSeries = [];
        if (inLegendColumns == null || inLegendColumns.length == 0) {
            this.pMeasureNames = [];
            for (var i = 0; i < inMeasureColumns.length; i++) {
                var tMeasureColumn = inMeasureColumns[i];
                var tMeasureName = tMeasureColumn.ColumnName;
                this.pMeasureNames.push(tMeasureName);

                var tStack = 'stack';
                if (inDisplayMode == 'cluster') {
                    tStack = 'stack' + i;
                }

                // 颜色
                var tColor = SeriesColorGetter.getColorStructure(0, i);
                if (this.pCustomOption != null && this.pCustomOption.color != null) {
                    tColor = SeriesColorGetter.getColorStructureFromString(this.pCustomOption.color[i % this.pCustomOption.color.length]);
                }

                var tColorString = SeriesColorGetter.getRGBAStringByColorStructure(tColor);
                var tItemStyle1 = {
                    normal: {
                        color: tColorString
                    },
                    emphasis: {
                        barBorderWidth: 1,
                        barBorderColor: 'red',
                        color: 'rgba(0,0,0,0)'
                    }
                };
                var tItemStyle4 = {
                    normal: {
                        color: tColorString,
                        label: {
                            show: false,
                            position: 'inside'
                        }
                    },
                    emphasis: {
                        barBorderWidth: 1,
                        barBorderColor: 'red',
                        color: 'rgba(0,0,0,0)'
                    }
                };
                tColor.a = 0.3;
                tColorString = SeriesColorGetter.getRGBAStringByColorStructure(tColor);
                var tItemStyle2 = {
                    normal: {
                        color: tColorString
                    },
                    emphasis: {
                        barBorderWidth: 1,
                        barBorderColor: 'red',
                        color: 'rgba(0,0,0,0)'
                    }
                };
                var tItemStyle3 = {
                    normal: {
                        color: 'red'
                    },
                    emphasis: {
                        barBorderWidth: 0,
                        barBorderColor: 'red',
                        color: 'rgba(0,0,0,0)'
                    }
                };

                var tValueArray = this.getValueArrayForOneLegendOfAllDimension(inDataTable, tMeasureName, null, null, tDimensionName, tDimensionValues);
                var tDataArray = this.getDataArrayForOneLegendOfAllDimension(tValueArray, tItemStyle4);
                tSeries.push({
                    name: tMeasureName,
                    type: 'bar',
                    stack: tStack,
                    itemStyle: tItemStyle1,
                    data: tDataArray
                });
                tDataArray = this.getZeroDataArrayForOneLegendOfAllDimension(tValueArray, tItemStyle2);
                tSeries.push({
                    name: tMeasureName,
                    type: 'bar',
                    stack: tStack,
                    itemStyle: tItemStyle1,
                    data: tDataArray
                });
                tDataArray = this.getZeroDataArrayForOneLegendOfAllDimension(tValueArray, tItemStyle3);
                tSeries.push({
                    name: 'legend@' + tMeasureName,
                    type: 'bar',
                    stack: tStack,
                    itemStyle: tItemStyle1,
                    data: tDataArray
                });
            }
        } else {
            var tMeasureName = inMeasureColumns[0].ColumnName;
            var tLegendName = inLegendColumns[0].ColumnName;
            var tLegendValues = DataTableHelper.getValueArrayFromTableWithColumnName(inDataTable, tLegendName);
            this.pLengendValues = tLegendValues;
            for (var j = 0; j < tLegendValues.length; j++) {
                var tLegendValue = tLegendValues[j];

                var tStack = 'stack';
                if (inDisplayMode == 'cluster') {
                    tStack = 'stack' + j;
                }

                // 颜色
                var tColor = SeriesColorGetter.getColorStructure(0, j);
                if (this.pCustomOption != null && this.pCustomOption.color != null) {
                    tColor = SeriesColorGetter.getColorStructureFromString(this.pCustomOption.color[j % this.pCustomOption.color.length]);
                }

                var tColorString = SeriesColorGetter.getRGBAStringByColorStructure(tColor);
                var tItemStyle4 = {
                    normal: {
                        color: tColorString,
                        label: {
                            show: false,
                            position: 'inside'
                        }
                    },
                    emphasis: {
                        barBorderWidth: 1,
                        barBorderColor: 'red',
                        color: 'rgba(0,0,0,0)'
                    }
                };
                var tItemStyle1 = {
                    normal: {
                        color: tColorString
                    },
                    emphasis: {
                        barBorderWidth: 1,
                        barBorderColor: 'red',
                        color: 'rgba(0,0,0,0)'
                    }
                };
                tColor.a = 0.3;
                tColorString = SeriesColorGetter.getRGBAStringByColorStructure(tColor);
                var tItemStyle2 = {
                    normal: {
                        color: tColorString
                    },
                    emphasis: {
                        barBorderWidth: 1,
                        barBorderColor: 'red',
                        color: 'rgba(0,0,0,0)'
                    }
                };
                var tItemStyle3 = {
                    normal: {
                        color: 'red'
                    },
                    emphasis: {
                        barBorderWidth: 0,
                        barBorderColor: 'red',
                        color: 'rgba(0,0,0,0)'
                    }
                };

                var tValueArray = this.getValueArrayForOneLegendOfAllDimension(inDataTable, tMeasureName, tLegendName, tLegendValue, tDimensionName, tDimensionValues);
                var tDataArray = this.getDataArrayForOneLegendOfAllDimension(tValueArray, tItemStyle4);
                tSeries.push({
                    name: tLegendValue,
                    type: 'bar',
                    stack: tStack,
                    itemStyle: tItemStyle1,
                    data: tDataArray
                });
                tDataArray = this.getZeroDataArrayForOneLegendOfAllDimension(tValueArray, tItemStyle2);
                tSeries.push({
                    name: tLegendValue,
                    type: 'bar',
                    stack: tStack,
                    itemStyle: tItemStyle1,
                    data: tDataArray
                });
                tDataArray = this.getZeroDataArrayForOneLegendOfAllDimension(tValueArray, tItemStyle3);
                tSeries.push({
                    name: 'legend@' + tLegendValue,
                    type: 'bar',
                    stack: tStack,
                    itemStyle: tItemStyle1,
                    data: tDataArray
                });
            }
        }
        this.pSeries = tSeries;

        var tYAxis0 = [{
            type: 'value',
            splitArea: {
                show: true
            }
        }];
        var tXAxis0 = [{
            type: 'category',
            data: tDimensionValues,
            splitLine: {
                show: false
            }
        }];
        var tYAxis = tYAxis0;
        var tXAxis = tXAxis0;
        if (inDisplayType == 'strip') {
            tYAxis = tXAxis0;
            tXAxis = tYAxis0;
        }

        var tOptionLegendData = [];
        if (this.pLengendValues != null) {
            for (var i = 0; i < this.pLengendValues.length; i++) {
                tOptionLegendData.push('legend@' + this.pLengendValues[i]);
            }
        } else {
            if (this.pMeasureColumns.length > 1) {
                for (var i = 0; i < this.pMeasureNames.length; i++) {
                    tOptionLegendData.push('legend@' + this.pMeasureNames[i]);
                }
            }
        }
        var tOptionLegendFormatter = function (inOriginalName) {
            var tNameLength = inOriginalName.length;
            return inOriginalName.substr(7, tNameLength - 7);
        };

        var option = {
            calculable: false,
            tooltip: {},
            yAxis: tYAxis,
            legend: {
                data: tOptionLegendData,
                formatter: function (cLegendName) {
                    return tOptionLegendFormatter(cLegendName)
                },
                orient: 'vertical',
                x: 'right',
                y: 'top'
            },
            xAxis: tXAxis,
            series: tSeries,
            grid: {
                x2: '18%',
                borderWidth: 0
            }
        };
        option = Utils.customUpdateObject(option, this.pCustomOption);
        return option;
    };

    BarChartController.prototype.getDataArrayForOneLegendOfAllDimension = function (inValueArray, inItemStyle) {
        var tResult = [];
        for (var i = 0; i < inValueArray.length; i++) {
            var tValue = inValueArray[i];
            var tData = {
                value: tValue,
                itemStyle: inItemStyle
            };
            tResult.push(tData);
        }
        return tResult;
    };

    BarChartController.prototype.getZeroDataArrayForOneLegendOfAllDimension = function (inValueArray, inItemStyle) {
        var tResult = [];
        for (var i = 0; i < inValueArray.length; i++) {
            var tData = {
                value: 0,
                itemStyle: inItemStyle
            };
            tResult.push(tData);
        }
        return tResult;
    };

    BarChartController.prototype.getValueArrayForOneLegendOfAllDimension = function (inDataTable, inMeasureName, inLegendName, inLegendValue, inDimensionName, inDimensionValues) {
        var tResult = [];
        for (var i = 0; i < inDimensionValues.length; i++) {
            var item = inDimensionValues[i];
            var value = DataTableHelper.getValueFromTableByMeasureAndLegendAndDimension(inDataTable, inMeasureName, inLegendName, inLegendValue, inDimensionName, item);
            tResult.push(value);
        }
        return tResult;
    };

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    BarChartController.prototype.onEChartClick = function (inSeriesIndex, inDataIndex) {
        // 取消图例选中
        this.setLegendCancel();

        // 判断当前被点击的部分是构造图例的占位系列，不做任何处理
        if (inSeriesIndex % 3 == 2) {
            return;
        }

        // 两次点击的是同一个部分，应该取消当前图表的选中状态
        if (this.pSelectedItem != null &&
            this.pSelectedItem.pSeriesIndex == inSeriesIndex &&
            this.pSelectedItem.pDataIndex == inDataIndex) {
            this.setBarCancel();
            // 调用取消选中的外部委托
            if (this.pUncheckCallback != null) {
                this.pUncheckCallback(this);
            }
            return;
        }

        this.pSelectedItem = {
            pSeriesIndex: inSeriesIndex,
            pDataIndex: inDataIndex
        };
        var tBarHighlightTable = this.getBarHighlightDataTable(this.pOriginalDataTable, inSeriesIndex, inDataIndex);
        this.setBarHighlight(tBarHighlightTable);
        if (this.pCheckCallback != null) {
            var tLinkage = this.getLinkageConditionBySeriesAndDataNumber(inSeriesIndex, inDataIndex);
            this.pCheckCallback(this, tLinkage);
        }
    };

    BarChartController.prototype.setBarHighlight = function (inLinkageData) {
        this.pSeries = this.getLinkageSeries(this.pSeries, this.pOriginalDataTable, inLinkageData);
        this.pChartBase.pChart.setSeries(this.pSeries);
    };

    BarChartController.prototype.setBarCancel = function () {
        this.setBarHighlight(this.pOriginalDataTable);
        this.pSelectedItem = null;
    };

    BarChartController.prototype.getBarHighlightDataTable = function (inOriginalTable, inSeriesIndex, inDataIndex) {
        var tOriginalTable = Utils.customObjectClone(inOriginalTable);
        var tSeriesIndex = parseInt(inSeriesIndex / 3);
        if (this.pLegendColumns != null && this.pLegendColumns.length > 0) {
            for (var i1 = 0; i1 < tOriginalTable.rows.length; i1++) {
                var row1 = tOriginalTable.rows[i1];
                var tDimensionName1 = this.pDimensionColumns[0].ColumnName;
                var tLegendName1 = this.pLegendColumns[0].ColumnName;
                var tDimensionValue1 = this.pDimensionValues[inDataIndex];
                var tLegendValue1 = this.pLengendValues[tSeriesIndex];
                var tMeasureName1 = this.pMeasureColumns[0].ColumnName;
                if (row1[tDimensionName1] != tDimensionValue1 || row1[tLegendName1] != tLegendValue1) {
                    row1[tMeasureName1] = 0;
                }
            }
        } else {
            for (var i2 = 0; i2 < tOriginalTable.rows.length; i2++) {
                var row2 = tOriginalTable.rows[i2];
                var tDimensionName2 = this.pDimensionColumns[0].ColumnName;
                var tDimensionValue2 = this.pDimensionValues[inDataIndex];
                if (row2[tDimensionName2] != tDimensionValue2) {
                    for (var j2 = 0; j2 < this.pMeasureNames.length; j2++) {
                        var tMeasureName2 = this.pMeasureNames[j2];
                        row2[tMeasureName2] = 0;
                    }
                }
            }
        }
        return tOriginalTable;
    };

    BarChartController.prototype.getLinkageSeries = function (inSeries, inOriginalData, inLinkageData) {
        var tSeries = Utils.customObjectClone(inSeries);
        for (var i = 0; i < tSeries.length; i++) {
            var tSeriesItem = tSeries[i];
            for (var j = 0; j < tSeriesItem.data.length; j++) {
                var tDataItem = tSeriesItem.data[j];
                var tOriginalValue = this.getValueBySeriesAndDataNumber(inOriginalData, i, j);
                var tLinkageValue = 0;
                if (inLinkageData != null) {
                    tLinkageValue = this.getValueBySeriesAndDataNumber(inLinkageData, i, j);
                }
                if (i % 3 == 0) {
                    tDataItem.value = tLinkageValue;
                } else if (i % 3 == 1) {
                    tDataItem.value = tOriginalValue - tLinkageValue;
                }
            }
        }
        return tSeries;
    };

    BarChartController.prototype.getValueBySeriesAndDataNumber = function (inDataTable, inSeriesNumber, inDataNumber) {
        var tResult = 0;
        var tSeriesIndex = parseInt(inSeriesNumber / 3);
        if (this.pLegendColumns == null || this.pLegendColumns.length == 0) {
            var tMeasureName = this.pMeasureNames[tSeriesIndex];
            var tDimensionName = this.pDimensionColumns[0].ColumnName;
            var tDimensionValue = this.pDimensionValues[inDataNumber];
            tResult = DataTableHelper.getValueFromTableByMeasureAndLegendAndDimension(inDataTable, tMeasureName, null, null, tDimensionName, tDimensionValue);
        } else {
            var tMeasureName = this.pMeasureColumns[0].ColumnName;
            var tLegendName = this.pLegendColumns[0].ColumnName;
            var tDimensionName = this.pDimensionColumns[0].ColumnName;
            var tLegendValue = this.pLengendValues[tSeriesIndex];
            var tDimensionValue = this.pDimensionValues[inDataNumber];
            tResult = DataTableHelper.getValueFromTableByMeasureAndLegendAndDimension(inDataTable, tMeasureName, tLegendName, tLegendValue, tDimensionName, tDimensionValue);
        }
        return tResult;
    };

    BarChartController.prototype.getLinkageConditionBySeriesAndDataNumber = function (inSeriesNumber, inDataNumber) {
        var result = null;
        var tSeriesIndex = parseInt(inSeriesNumber / 3);
        if (this.pLegendColumns != null && this.pLegendColumns.length > 0 &&
            this.pLegendColumns[0].ColumnName != this.pDimensionColumns[0].ColumnName) {
            // 标准的：1指标，1图例，1维度
            var tCondition1 = InitHelper.initAdapterConditionModel();
            tCondition1.Column = this.pLegendColumns[0];
            tCondition1.JudgmentObject = this.pLengendValues[tSeriesIndex];

            var tCondition2 = InitHelper.initAdapterConditionModel();
            tCondition2.Column = this.pDimensionColumns[0];
            tCondition2.JudgmentObject = this.pDimensionValues[inDataNumber];

            result = InitHelper.initAdapterConditionModel();
            result.CompoundConditions.push(tCondition1);
            result.CompoundConditions.push(tCondition2);
        } else {
            // 其它的情况：都使用维度进行联动
            result = InitHelper.initAdapterConditionModel();
            result.Column = this.pDimensionColumns[0];
            result.JudgmentObject = this.pDimensionValues[inDataNumber];
        }
        return result;
    };

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    BarChartController.prototype.onLegendSelected = function (inLegendName, inSelected) {
        // 排除由于清空图例选中导致的重复调用
        if (this.pLegendLockNumber > 0) {
            this.pLegendLockNumber--;
            return;
        }

        // 排除因为没有图例而直接调用方法导致的空值bug
        if (this.pLegendColumns == null || this.pLegendColumns.length == 0) {
            return;
        }

        // 两次点击相同的图例，应该取消图例选中
        if (this.pSelectedLegend != null && this.pSelectedLegend == inLegendName) {
            this.setLegendCancel();
            this.setBarCancel();
            if (this.pLegendUncheckCallback != null) {
                this.pLegendUncheckCallback(this);
            }
            return;
        }

        // 选中图例
        this.pSelectedLegend = inLegendName;
        this.setLegendHighlight(inLegendName);
        this.setLegendSelectSeries(this.pOriginalDataTable, inLegendName);
        if (this.pLegendCheckCallback != null) {
            var tLinkage = this.getLinkageConditionByLegendName(inLegendName);
            this.pLegendCheckCallback(this, tLinkage);
        }
    };

    BarChartController.prototype.setLegendHighlight = function (inLegendName) {
        this.pLegendLockNumber = this.pLengendValues.length;
        for (var i = 0; i < this.pLengendValues.length; i++) {
            var tLegendName = this.pLengendValues[i];
            var tTargetStatus = false;
            if (tLegendName == inLegendName) {
                tTargetStatus = true;
            }
            tLegendName = 'legend@' + tLegendName;
            this.pChartBase.pChart.component.legend.setSelected(tLegendName, tTargetStatus);
        }
    };

    BarChartController.prototype.setLegendCancel = function () {
        if (this.pSelectedLegend == null) {
            return;
        }
        this.pLegendLockNumber = this.pLengendValues.length;
        for (var i = 0; i < this.pLengendValues.length; i++) {
            var tLegendName = this.pLengendValues[i];
            tLegendName = 'legend@' + tLegendName;
            this.pChartBase.pChart.component.legend.setSelected(tLegendName, true);
        }
        this.pSelectedLegend = null;
    };

    BarChartController.prototype.setLegendSelectSeries = function (inOriginalTable, inLegendName) {
        if (this.pLegendColumns != null && this.pLegendColumns.length > 0) {
            var tOriginalTable = Utils.customObjectClone(inOriginalTable);
            var tLegendName = this.pLegendColumns[0].ColumnName;
            var tMeasureName = this.pMeasureColumns[0].ColumnName;
            for (var i = 0; i < tOriginalTable.rows.length; i++) {
                var row = tOriginalTable.rows[i];
                if (row[tLegendName] != inLegendName) {
                    row[tMeasureName] = 0;
                }
            }
            this.setBarHighlight(tOriginalTable);
            this.pSelectedItem = null;
        }
    };

    BarChartController.prototype.getLinkageConditionByLegendName = function (inLegendName) {
        var result = null;
        if (this.pLegendColumns != null && this.pLegendColumns.length > 0) {
            result = InitHelper.initAdapterConditionModel();
            result.Column = this.pLegendColumns[0];
            result.JudgmentObject = inLegendName;
        }
        return result;
    };

    // -------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 饼图（环图）控件
     * @param inDiv {string} 形如：'#divId'
     * @constructor
     */
    function PieChartController(inDiv) {
        var obj = this;
        this.pChartBase = new ChartBase(inDiv, 'echarts/chart/pie');
        this.pChartBase.ClickCallback = function (inSeriesIndex, inDataIndex) {
            obj.onEChartClick(inSeriesIndex, inDataIndex);
        };
        this.pChartBase.LegendClickCallback = function (cLegendName, cSelected) {
            obj.onLegendSelected(cLegendName, cSelected);
        }
    }

    PieChartController.prototype.firstLoad = function (inDataViewModel, inDataTable, /** string */ inPieOrRing, inOption) {
        var tMeasureColumns = inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.MeasureList;
        var tLegendColumns = inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.LegendList;
        var tDimensionColumns = inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.DimensionList;

        this.pMeasureColumns = tMeasureColumns;
        this.pLegendColumns = tLegendColumns;
        this.pDimensionColumns = tDimensionColumns;
        this.pDataViewModel = inDataViewModel;
        this.pOriginalDataTable = inDataTable;
        this.pPieOrRing = inPieOrRing;
        this.pCustomOption = inOption;

        var tOption = this.buildPieEChartsOption(tMeasureColumns, tLegendColumns, tDimensionColumns, inDataTable);
        this.pChartBase.pChart.setOption(tOption);
        this.pChartBase.pChart.hideLoading();
    };

    PieChartController.prototype.buildPieEChartsOption = function (inMeasureColumns, inLegendColumns, inDimensionColumns, inDataTable) {
        // 判断不满足生成饼图的条件
        if (inDimensionColumns == null || inDimensionColumns.length != 1 || inMeasureColumns == null || inMeasureColumns.length != 1) {
            return null;
        }

        // 维度列名称
        var tDimensionName = inDimensionColumns[0].ColumnName;
        // 生成横轴
        var tDimensionValues = DataTableHelper.getValueArrayFromTableWithColumnName(inDataTable, tDimensionName);
        this.pDimensionValues = tDimensionValues;

        // 构造数据
        var tSeries = [];
        var tMeasureName = inMeasureColumns[0].ColumnName;

        var tRadius = '80%';
        if (this.pPieOrRing == 'ring') {
            tRadius = ['40%', '80%'];
        }

        tSeries.push({
            name: tDimensionName,
            type: 'pie',
            radius: tRadius,
            selectedMode: 'single',
            center: ['40%', '50%'],
            data: this.getValueArrayForOneLegendOfAllDimensionPie(inDataTable, tMeasureName, null, null, tDimensionName, tDimensionValues)
        });
        this.pSeries = tSeries;

        // 图例
        var tOptionLegendData = [];
        for (var i = 0; i < tDimensionValues.length; i++) {
            tOptionLegendData.push('legend@' + tDimensionValues[i]);
        }
        var tOptionLegendFormatter = function (inOriginalName) {
            var tNameLength = inOriginalName.length;
            return inOriginalName.substr(7, tNameLength - 7);
        };

        // option
        var option = {
            calculable: false,
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                data: tOptionLegendData,
                formatter: function (cLegendName) {
                    return tOptionLegendFormatter(cLegendName)
                },
                orient: 'vertical',
                x: 'right',
                y: 'top'
            },
            series: tSeries
        };
        option = Utils.customUpdateObject(option, this.pCustomOption);
        return option;
    };

    PieChartController.prototype.getValueArrayForOneLegendOfAllDimensionPie = function (inDataTable, inMeasureName, inLegendName, inLegendValue, inDimensionName, inDimensionValues) {
        var tResult = [];
        for (var i = 0; i < inDimensionValues.length; i++) {
            var tDimensionValue = inDimensionValues[i];
            var value = DataTableHelper.getValueFromTableByMeasureAndLegendAndDimension(inDataTable, inMeasureName, inLegendName, inLegendValue, inDimensionName, tDimensionValue);

            // 颜色
            var tColor = SeriesColorGetter.getColorStructure(0, i);
            if (this.pCustomOption != null && this.pCustomOption.color != null) {
                tColor = SeriesColorGetter.getColorStructureFromString(this.pCustomOption.color[i % this.pCustomOption.color.length]);
            }

            var tColorString = SeriesColorGetter.getRGBAStringByColorStructure(tColor);
            var tItemStyle1 = {
                normal: {
                    color: tColorString,
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    borderWidth: 1,
                    borderColor: 'red',
                    color: 'rgba(0,0,0,0)'
                }
            };
            tColor.a = 0.3;
            tColorString = SeriesColorGetter.getRGBAStringByColorStructure(tColor);
            var tItemStyle2 = {
                normal: {
                    color: tColorString,
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    borderWidth: 1,
                    borderColor: 'red',
                    color: 'rgba(0,0,0,0)'
                }
            };
            tColor.a = 1;
            tColorString = SeriesColorGetter.getRGBAStringByColorStructure(tColor);
            var tItemStyle3 = {
                normal: {
                    color: tColorString,
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    borderWidth: 0,
                    borderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)'
                }
            };

            tResult.push({
                'value': value,
                'name': tDimensionValue,
                'itemStyle': tItemStyle1,
                'customMark': 'solidItem'
            });
            tResult.push({
                'value': 0,
                'name': tDimensionValue,
                'itemStyle': tItemStyle2
            });
            tResult.push({
                'value': 0,
                'name': 'legend@' + tDimensionValue,
                'itemStyle': tItemStyle3
            });
        }
        return tResult;
    };

    PieChartController.prototype.getLinkageSeries = function (inSeries, inOriginalData, inLinkageData) {
        var tSeries = Utils.customObjectClone(inSeries);
        var tSeriesItem = tSeries[0];
        for (var j = 0; j < tSeriesItem.data.length; j++) {
            var tDataItem = tSeriesItem.data[j];
            var tOriginalValue = this.getValueByDataNumber(inOriginalData, j);
            var tLinkageValue = 0;
            if (inLinkageData != null) {
                tLinkageValue = this.getValueByDataNumber(inLinkageData, j);
            }
            if (j % 3 == 0) {
                tDataItem.value = tLinkageValue;
            } else if (j % 3 == 1) {
                tDataItem.value = tOriginalValue - tLinkageValue;
            }
        }
        return tSeries;
    };

    PieChartController.prototype.backToOriginal = function () {
        this.setLegendCancel();
        this.setPieCancel();
        this.pSelectedItem = null;
    };

    PieChartController.prototype.setToLinkage = function (inLinkageData) {
        this.setLegendCancel();
        this.setPieHighlight(inLinkageData);
        this.pSelectedItem = null;
    };

    PieChartController.prototype.getSelectedHighlightSeries = function (inSeries, inDataIndex) {
        var tSeries = Utils.customObjectClone(inSeries);

        var tSolidDataIndex = null;
        var tTransparentDataIndex = null;
        if (inDataIndex % 3 == 0) {
            tSolidDataIndex = inDataIndex;
            tTransparentDataIndex = inDataIndex + 1;
        } else if (inDataIndex % 3 == 1) {
            tSolidDataIndex = inDataIndex - 1;
            tTransparentDataIndex = inDataIndex;
        } else if (inDataIndex % 3 == 2) {
            return tSeries;
        }

        var tSelectedValue = this.getValueByDataNumber(this.pOriginalDataTable, inDataIndex);
        tSeries[0].data[tSolidDataIndex].value = tSelectedValue;
        tSeries[0].data[tTransparentDataIndex].value = 0;
        return tSeries;
    };

    PieChartController.prototype.getValueByDataNumber = function (inDataTable, inDataNumber) {
        var tResult = 0;
        var tDataIndex = parseInt(inDataNumber / 3);
        var tMeasureName = this.pMeasureColumns[0].ColumnName;
        var tDimensionName = this.pDimensionColumns[0].ColumnName;
        var tDimensionValue = this.pDimensionValues[tDataIndex];
        tResult = DataTableHelper.getValueFromTableByMeasureAndLegendAndDimension(inDataTable, tMeasureName, null, null, tDimensionName, tDimensionValue);
        return tResult;
    };

    PieChartController.prototype.onEChartClick = function (inSeriesIndex, inDataIndex) {
        // 取消图例选中
        this.setLegendCancel();

        if (this.pSelectedItem != null &&
            this.pSelectedItem.pSeriesIndex == inSeriesIndex &&
            this.pSelectedItem.pDataIndex == inDataIndex) {
            // 两次点击的是同一个部分
            // 取消当前图表的选中状态
            this.backToOriginal();

            // 调用取消选中的外部委托
            if (this.pUncheckCallback != null) {
                this.pUncheckCallback(this);
            }
            return;
        }

        this.pSelectedItem = {
            pSeriesIndex: inSeriesIndex,
            pDataIndex: inDataIndex
        };
        this.pSeries = this.getLinkageSeries(this.pSeries, this.pOriginalDataTable, null);
        this.pSeries = this.getSelectedHighlightSeries(this.pSeries, inDataIndex);
        this.pChartBase.pChart.setSeries(this.pSeries);

        if (this.pCheckCallback != null) {
            var tLinkage = this.getLinkageConditionBySeriesAndDataNumber(inSeriesIndex, inDataIndex);
            this.pCheckCallback(this, tLinkage);
        }
    };

    PieChartController.prototype.getLinkageConditionBySeriesAndDataNumber = function (inSeriesNumber, inDataNumber) {
        var result = null;
        var tSeriesIndex = parseInt(inDataNumber / 3);
        result = InitHelper.initAdapterConditionModel();
        result.Column = this.pDimensionColumns[0];
        result.JudgmentObject = this.pDimensionValues[tSeriesIndex];
        return result;
    };

    PieChartController.prototype.setPieHighlight = function (inLinkageData) {
        this.pSeries = this.getLinkageSeries(this.pSeries, this.pOriginalDataTable, inLinkageData);
        this.pChartBase.pChart.setSeries(this.pSeries);
    };

    PieChartController.prototype.setPieCancel = function () {
        this.setPieHighlight(this.pOriginalDataTable);
        this.pSelectedItem = null;
    };

    PieChartController.prototype.setLabelDisplay = function (wantShow) {
        if (this.pSeries == null || this.pSeries.length == 0) {
            return;
        }
        for (var i = 0; i < this.pSeries[0].data.length; i++) {
            var item = this.pSeries[0].data[i];
            if (item.customMark == 'solidItem') {
                item.itemStyle.normal.label.show = wantShow;
                item.itemStyle.normal.labelLine.show = wantShow;
            }
        }
        this.pChartBase.pChart.setSeries(this.pSeries);
    };

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    PieChartController.prototype.onLegendSelected = function (inLegendName, inSelected) {
        // 排除由于清空图例选中导致的重复调用
        if (this.pLegendLockNumber > 0) {
            this.pLegendLockNumber--;
            return;
        }

        // 两次点击相同的图例，应该取消图例选中
        if (this.pSelectedLegend != null && this.pSelectedLegend == inLegendName) {
            this.setLegendCancel();
            this.setPieCancel();
            if (this.pLegendUncheckCallback != null) {
                this.pLegendUncheckCallback(this);
            }
            return;
        }

        // 选中图例
        this.pSelectedLegend = inLegendName;
        this.setLegendHighlight(inLegendName);
        this.setLegendSelectSeries(this.pOriginalDataTable, inLegendName);
        if (this.pLegendCheckCallback != null) {
            var tLinkage = this.getLinkageConditionByLegendName(inLegendName);
            this.pLegendCheckCallback(this, tLinkage);
        }
    };

    PieChartController.prototype.setLegendHighlight = function (inLegendName) {
        this.pLegendLockNumber = this.pDimensionValues.length;
        for (var i = 0; i < this.pDimensionValues.length; i++) {
            var tLegendName = this.pDimensionValues[i];
            var tTargetStatus = false;
            if (tLegendName == inLegendName) {
                tTargetStatus = true;
            }
            tLegendName = 'legend@' + tLegendName;
            this.pChartBase.pChart.component.legend.setSelected(tLegendName, tTargetStatus);
        }
    };

    PieChartController.prototype.setLegendCancel = function () {
        if (this.pSelectedLegend == null) {
            return;
        }
        this.pLegendLockNumber = this.pDimensionValues.length;
        for (var i = 0; i < this.pDimensionValues.length; i++) {
            var tLegendName = this.pDimensionValues[i];
            tLegendName = 'legend@' + tLegendName;
            this.pChartBase.pChart.component.legend.setSelected(tLegendName, true);
        }
        this.pSelectedLegend = null;
    };

    PieChartController.prototype.setLegendSelectSeries = function (inOriginalTable, inLegendName) {
        if (this.pDimensionValues != null && this.pDimensionValues.length > 0) {
            var tOriginalTable = Utils.customObjectClone(inOriginalTable);
            var tLegendName = this.pDimensionColumns[0].ColumnName;
            var tMeasureName = this.pMeasureColumns[0].ColumnName;
            for (var i = 0; i < tOriginalTable.rows.length; i++) {
                var row = tOriginalTable.rows[i];
                if (row[tLegendName] != inLegendName) {
                    row[tMeasureName] = 0;
                }
            }
            this.setPieHighlight(tOriginalTable);
            this.pSelectedItem = null;
        }
    };

    PieChartController.prototype.getLinkageConditionByLegendName = function (inLegendName) {
        var result = null;
        if (this.pDimensionValues != null && this.pDimensionValues.length > 0) {
            result = InitHelper.initAdapterConditionModel();
            result.Column = this.pDimensionColumns[0];
            result.JudgmentObject = inLegendName;
        }
        return result;
    };

    // -------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 折线图控件
     * @param inDiv {string} 形如：'#divId'
     * @constructor
     */
    function LineChartController(inDiv) {
        var obj = this;
        this.pChartBase = new ChartBase(inDiv, 'echarts/chart/line');
        /*
         this.pChartBase.ClickCallback = function (inSeriesIndex, inDataIndex) {
         obj.onEChartClick(inSeriesIndex, inDataIndex);
         };
         */
        this.pChartBase.LegendClickCallback = function (cLegendName, cSelected) {
            obj.onLegendSelected(cLegendName, cSelected);
        };
    }

    LineChartController.prototype.firstLoad = function (inDataViewModel, inDataTable, inDisplayType, inDisplayMode, inOption) {
        var tMeasureColumns = inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.MeasureList;
        var tLegendColumns = inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.LegendList;
        var tDimensionColumns = inDataViewModel.DataViewDefinitionModel.DataDescriptionModel.DimensionList;

        this.pMeasureColumns = tMeasureColumns;
        this.pLegendColumns = tLegendColumns;
        this.pDimensionColumns = tDimensionColumns;
        this.pDataViewModel = inDataViewModel;
        this.pOriginalDataTable = inDataTable;
        this.pCustomOption = inOption;

        var tOption = this.buildBarEChartsData(tMeasureColumns, tLegendColumns, tDimensionColumns, inDataTable, inDisplayType, inDisplayMode);
        this.pOriginalOption = tOption;
        this.pChartBase.pChart.setOption(tOption);
        this.pChartBase.pChart.hideLoading();
    };

    LineChartController.prototype.backToOriginal = function () {
        this.setLegendCancel();
        this.setBarCancel();
    };

    LineChartController.prototype.setToLinkage = function (inLinkageData) {
        this.setLegendCancel();
        this.setBarHighlight(inLinkageData);
        this.pSelectedItem = null;
    };

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------

    LineChartController.prototype.buildBarEChartsData = function (inMeasureColumns, inLegendColumns, inDimensionColumns, inDataTable, inDisplayType, inDisplayMode) {
        // 标记
        var obj = this;

        if (inMeasureColumns == null || inMeasureColumns.length == 0 ||
            inDimensionColumns == null || inDimensionColumns.length != 1) {
            return null;
        }

        // 维度列名称
        var tDimensionName = inDimensionColumns[0].ColumnName;
        // 生成横轴
        var tDimensionValues = DataTableHelper.getValueArrayFromTableWithColumnName(inDataTable, tDimensionName);
        this.pDimensionValues = tDimensionValues;

        // 构造数据
        var tSeries = [];
        if (inLegendColumns == null || inLegendColumns.length == 0) {
            this.pMeasureNames = [];
            for (var i = 0; i < inMeasureColumns.length; i++) {
                var tMeasureColumn = inMeasureColumns[i];
                var tMeasureName = tMeasureColumn.ColumnName;
                this.pMeasureNames.push(tMeasureName);

                var tStack = 'stack';
                if (inDisplayMode == 'cluster') {
                    tStack = 'stack' + i;
                }

                // 颜色
                var tColor = SeriesColorGetter.getColorStructure(0, i);
                if (this.pCustomOption != null && this.pCustomOption.color != null) {
                    tColor = SeriesColorGetter.getColorStructureFromString(this.pCustomOption.color[i % this.pCustomOption.color.length]);
                }

                var tColorString = SeriesColorGetter.getRGBAStringByColorStructure(tColor);
                var tItemStyle1 = {
                    normal: {
                        color: tColorString,
                        lineStyle: {
                            color: tColorString
                        }
                    },
                    emphasis: {
                        color: 'rgba(0,0,0,0)'
                    }
                };
                tColor.a = 0.3;
                tColorString = SeriesColorGetter.getRGBAStringByColorStructure(tColor);
                var tItemStyle2 = {
                    normal: {
                        color: tColorString,
                        lineStyle: {
                            color: tColorString
                        }
                    },
                    emphasis: {
                        color: 'rgba(0,0,0,0)'
                    }
                };

                var tValueArray = this.getValueArrayForOneLegendOfAllDimension(inDataTable, tMeasureName, null, null, tDimensionName, tDimensionValues);
                var tDataArray = this.getDataArrayForOneLegendOfAllDimension(tValueArray, tItemStyle1);
                tSeries.push({
                    name: tMeasureName,
                    type: 'line',
                    stack: tStack,
                    itemStyle: tItemStyle1,
                    data: tDataArray
                });
                tDataArray = this.getZeroDataArrayForOneLegendOfAllDimension(tValueArray, tItemStyle2);
                tSeries.push({
                    name: tMeasureName,
                    type: 'line',
                    stack: tStack,
                    itemStyle: tItemStyle2,
                    data: tDataArray
                });
                tDataArray = this.getEmptyDataArrayForOneLegendOfAllDimension(tValueArray, null);
                tSeries.push({
                    name: 'legend@' + tMeasureName,
                    type: 'line',
                    stack: tStack,
                    itemStyle: tItemStyle1,
                    data: tDataArray
                });
            }
        } else {
            var tMeasureName = inMeasureColumns[0].ColumnName;
            var tLegendName = inLegendColumns[0].ColumnName;
            var tLegendValues = DataTableHelper.getValueArrayFromTableWithColumnName(inDataTable, tLegendName);
            this.pLengendValues = tLegendValues;
            for (var j = 0; j < tLegendValues.length; j++) {
                var tLegendValue = tLegendValues[j];

                var tStack = 'stack';
                if (inDisplayMode == 'cluster') {
                    tStack = 'stack' + j;
                }

                // 颜色
                var tColor = SeriesColorGetter.getColorStructure(0, j);
                if (this.pCustomOption != null && this.pCustomOption.color != null) {
                    tColor = SeriesColorGetter.getColorStructureFromString(this.pCustomOption.color[j % this.pCustomOption.color.length]);
                }

                var tColorString = SeriesColorGetter.getRGBAStringByColorStructure(tColor);
                var tItemStyle1 = {
                    normal: {
                        color: tColorString,
                        lineStyle: {
                            color: tColorString
                        }
                    },
                    emphasis: {
                        color: 'rgba(0,0,0,0)'
                    }
                };
                tColor.a = 0.3;
                tColorString = SeriesColorGetter.getRGBAStringByColorStructure(tColor);
                var tItemStyle2 = {
                    normal: {
                        color: tColorString,
                        lineStyle: {
                            color: tColorString
                        }
                    },
                    emphasis: {
                        color: 'rgba(0,0,0,0)'
                    }
                };

                var tValueArray = this.getValueArrayForOneLegendOfAllDimension(inDataTable, tMeasureName, tLegendName, tLegendValue, tDimensionName, tDimensionValues);
                var tDataArray = this.getDataArrayForOneLegendOfAllDimension(tValueArray, tItemStyle1);
                tSeries.push({
                    name: tLegendValue,
                    type: 'line',
                    stack: tStack,
                    itemStyle: tItemStyle1,
                    data: tDataArray
                });
                tDataArray = this.getZeroDataArrayForOneLegendOfAllDimension(tValueArray, tItemStyle2);
                tSeries.push({
                    name: tLegendValue,
                    type: 'line',
                    stack: tStack,
                    itemStyle: tItemStyle2,
                    data: tDataArray
                });
                tDataArray = this.getEmptyDataArrayForOneLegendOfAllDimension(tValueArray, null);
                tSeries.push({
                    name: 'legend@' + tLegendValue,
                    type: 'line',
                    stack: tStack,
                    itemStyle: tItemStyle1,
                    data: tDataArray
                });
            }
        }
        this.pSeries = tSeries;

        var tYAxis0 = [{
            type: 'value',
            splitArea: {
                show: true
            }
        }];
        var tXAxis0 = [{
            type: 'category',
            boundaryGap: false,
            data: tDimensionValues,
            splitLine: {
                show: false
            }
        }];
        var tYAxis = tYAxis0;
        var tXAxis = tXAxis0;
        if (inDisplayType == 'strip') {
            tYAxis = tXAxis0;
            tXAxis = tYAxis0;
        }

        var tOptionLegendData = [];
        if (this.pLengendValues != null) {
            for (var i = 0; i < this.pLengendValues.length; i++) {
                tOptionLegendData.push('legend@' + this.pLengendValues[i]);
            }
        } else {
            if (this.pMeasureColumns.length > 1) {
                for (var i = 0; i < this.pMeasureNames.length; i++) {
                    tOptionLegendData.push('legend@' + this.pMeasureNames[i]);
                }
            }
        }
        var tOptionLegendFormatter = function (inOriginalName) {
            var tNameLength = inOriginalName.length;
            return inOriginalName.substr(7, tNameLength - 7);
        };

        var option = {
            calculable: false,
            tooltip: {},
            yAxis: tYAxis,
            legend: {
                data: tOptionLegendData,
                formatter: function (cLegendName) {
                    return tOptionLegendFormatter(cLegendName)
                },
                orient: 'vertical',
                x: 'right',
                y: 'top'
            },
            xAxis: tXAxis,
            series: tSeries,
            grid: {
                x2: '18%',
                borderWidth: 0
            }
        };
        option = Utils.customUpdateObject(option, this.pCustomOption);
        return option;
    };

    LineChartController.prototype.getDataArrayForOneLegendOfAllDimension = function (inValueArray, inItemStyle) {
        var tResult = [];
        for (var i = 0; i < inValueArray.length; i++) {
            var tValue = inValueArray[i];
            var tData = {
                value: tValue,
                itemStyle: inItemStyle
            };
            tResult.push(tData);
        }
        return tResult;
    };

    LineChartController.prototype.getZeroDataArrayForOneLegendOfAllDimension = function (inValueArray, inItemStyle) {
        var tResult = [];
        for (var i = 0; i < inValueArray.length; i++) {
            var tData = {
                value: 0,
                itemStyle: inItemStyle
            };
            tResult.push(tData);
        }
        return tResult;
    };

    LineChartController.prototype.getEmptyDataArrayForOneLegendOfAllDimension = function (inValueArray, inItemStyle) {
        var tResult = [];
        for (var i = 0; i < inValueArray.length; i++) {
            var tData = {
                value: '-',
                itemStyle: inItemStyle
            };
            tResult.push(tData);
        }
        return tResult;
    };

    LineChartController.prototype.getValueArrayForOneLegendOfAllDimension = function (inDataTable, inMeasureName, inLegendName, inLegendValue, inDimensionName, inDimensionValues) {
        var tResult = [];
        for (var i = 0; i < inDimensionValues.length; i++) {
            var item = inDimensionValues[i];
            var value = DataTableHelper.getValueFromTableByMeasureAndLegendAndDimension(inDataTable, inMeasureName, inLegendName, inLegendValue, inDimensionName, item);
            tResult.push(value);
        }
        return tResult;
    };

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    LineChartController.prototype.onEChartClick = function (inSeriesIndex, inDataIndex) {
        // 取消图例选中
        this.setLegendCancel();

        // 判断当前被点击的部分是构造图例的占位系列，不做任何处理
        if (inSeriesIndex % 3 == 2) {
            return;
        }

        // 两次点击的是同一个部分，应该取消当前图表的选中状态
        if (this.pSelectedItem != null &&
            this.pSelectedItem.pSeriesIndex == inSeriesIndex &&
            this.pSelectedItem.pDataIndex == inDataIndex) {
            this.setBarCancel();
            // 调用取消选中的外部委托
            if (this.pUncheckCallback != null) {
                this.pUncheckCallback(this);
            }
            return;
        }

        this.pSelectedItem = {
            pSeriesIndex: inSeriesIndex,
            pDataIndex: inDataIndex
        };
        var tBarHighlightTable = this.getBarHighlightDataTable(this.pOriginalDataTable, inSeriesIndex, inDataIndex);
        this.setBarHighlight(tBarHighlightTable);
        if (this.pCheckCallback != null) {
            var tLinkage = this.getLinkageConditionBySeriesAndDataNumber(inSeriesIndex, inDataIndex);
            this.pCheckCallback(this, tLinkage);
        }
    };

    LineChartController.prototype.setBarHighlight = function (inLinkageData) {
        this.pSeries = this.getLinkageSeries(this.pSeries, this.pOriginalDataTable, inLinkageData);
        this.pChartBase.pChart.setSeries(this.pSeries);
    };

    LineChartController.prototype.setBarCancel = function () {
        this.setBarHighlight(this.pOriginalDataTable);
        this.pSelectedItem = null;
    };

    LineChartController.prototype.getBarHighlightDataTable = function (inOriginalTable, inSeriesIndex, inDataIndex) {
        var tOriginalTable = Utils.customObjectClone(inOriginalTable);
        var tSeriesIndex = parseInt(inSeriesIndex / 3);
        if (this.pLegendColumns != null && this.pLegendColumns.length > 0) {
            for (var i1 = 0; i1 < tOriginalTable.rows.length; i1++) {
                var row1 = tOriginalTable.rows[i1];
                var tDimensionName1 = this.pDimensionColumns[0].ColumnName;
                var tLegendName1 = this.pLegendColumns[0].ColumnName;
                var tDimensionValue1 = this.pDimensionValues[inDataIndex];
                var tLegendValue1 = this.pLengendValues[tSeriesIndex];
                var tMeasureName1 = this.pMeasureColumns[0].ColumnName;
                if (row1[tDimensionName1] != tDimensionValue1 || row1[tLegendName1] != tLegendValue1) {
                    row1[tMeasureName1] = 0;
                }
            }
        } else {
            for (var i2 = 0; i2 < tOriginalTable.rows.length; i2++) {
                var row2 = tOriginalTable.rows[i2];
                var tDimensionName2 = this.pDimensionColumns[0].ColumnName;
                var tDimensionValue2 = this.pDimensionValues[inDataIndex];
                if (row2[tDimensionName2] != tDimensionValue2) {
                    for (var j2 = 0; j2 < this.pMeasureNames.length; j2++) {
                        var tMeasureName2 = this.pMeasureNames[j2];
                        row2[tMeasureName2] = 0;
                    }
                }
            }
        }
        return tOriginalTable;
    };

    LineChartController.prototype.getLinkageSeries = function (inSeries, inOriginalData, inLinkageData) {
        var tSeries = Utils.customObjectClone(inSeries);
        for (var i = 0; i < tSeries.length; i++) {
            var tSeriesItem = tSeries[i];
            for (var j = 0; j < tSeriesItem.data.length; j++) {
                var tDataItem = tSeriesItem.data[j];
                var tOriginalValue = this.getValueBySeriesAndDataNumber(inOriginalData, i, j);
                var tLinkageValue = 0;
                if (inLinkageData != null) {
                    tLinkageValue = this.getValueBySeriesAndDataNumber(inLinkageData, i, j);
                }
                if (i % 3 == 0) {
                    tDataItem.value = tLinkageValue;
                } else if (i % 3 == 1) {
                    tDataItem.value = tOriginalValue - tLinkageValue;
                }
            }
        }
        return tSeries;
    };

    LineChartController.prototype.getValueBySeriesAndDataNumber = function (inDataTable, inSeriesNumber, inDataNumber) {
        var tResult = 0;
        var tSeriesIndex = parseInt(inSeriesNumber / 3);
        if (this.pLegendColumns == null || this.pLegendColumns.length == 0) {
            var tMeasureName = this.pMeasureNames[tSeriesIndex];
            var tDimensionName = this.pDimensionColumns[0].ColumnName;
            var tDimensionValue = this.pDimensionValues[inDataNumber];
            tResult = DataTableHelper.getValueFromTableByMeasureAndLegendAndDimension(inDataTable, tMeasureName, null, null, tDimensionName, tDimensionValue);
        } else {
            var tMeasureName = this.pMeasureColumns[0].ColumnName;
            var tLegendName = this.pLegendColumns[0].ColumnName;
            var tDimensionName = this.pDimensionColumns[0].ColumnName;
            var tLegendValue = this.pLengendValues[tSeriesIndex];
            var tDimensionValue = this.pDimensionValues[inDataNumber];
            tResult = DataTableHelper.getValueFromTableByMeasureAndLegendAndDimension(inDataTable, tMeasureName, tLegendName, tLegendValue, tDimensionName, tDimensionValue);
        }
        return tResult;
    };

    LineChartController.prototype.getLinkageConditionBySeriesAndDataNumber = function (inSeriesNumber, inDataNumber) {
        var result = null;
        var tSeriesIndex = parseInt(inSeriesNumber / 3);
        if (this.pLegendColumns != null && this.pLegendColumns.length > 0 &&
            this.pLegendColumns[0].ColumnName != this.pDimensionColumns[0].ColumnName) {
            // 标准的：1指标，1图例，1维度
            var tCondition1 = InitHelper.initAdapterConditionModel();
            tCondition1.Column = this.pLegendColumns[0];
            tCondition1.JudgmentObject = this.pLengendValues[tSeriesIndex];

            var tCondition2 = InitHelper.initAdapterConditionModel();
            tCondition2.Column = this.pDimensionColumns[0];
            tCondition2.JudgmentObject = this.pDimensionValues[inDataNumber];

            result = InitHelper.initAdapterConditionModel();
            result.CompoundConditions.push(tCondition1);
            result.CompoundConditions.push(tCondition2);
        } else {
            // 其它的情况：都使用维度进行联动
            result = InitHelper.initAdapterConditionModel();
            result.Column = this.pDimensionColumns[0];
            result.JudgmentObject = this.pDimensionValues[inDataNumber];
        }
        return result;
    };

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    LineChartController.prototype.onLegendSelected = function (inLegendName, inSelected) {
        // 排除由于清空图例选中导致的重复调用
        if (this.pLegendLockNumber > 0) {
            this.pLegendLockNumber--;
            return;
        }

        // 排除因为没有图例而直接调用方法导致的空值bug
        if (this.pLegendColumns == null || this.pLegendColumns.length == 0) {
            return;
        }

        // 两次点击相同的图例，应该取消图例选中
        if (this.pSelectedLegend != null && this.pSelectedLegend == inLegendName) {
            this.setLegendCancel();
            this.setBarCancel();
            if (this.pLegendUncheckCallback != null) {
                this.pLegendUncheckCallback(this);
            }
            return;
        }

        // 选中图例
        this.pSelectedLegend = inLegendName;
        this.setLegendHighlight(inLegendName);
        this.setLegendSelectSeries(this.pOriginalDataTable, inLegendName);
        if (this.pLegendCheckCallback != null) {
            var tLinkage = this.getLinkageConditionByLegendName(inLegendName);
            this.pLegendCheckCallback(this, tLinkage);
        }
    };

    LineChartController.prototype.setLegendHighlight = function (inLegendName) {
        this.pLegendLockNumber = this.pLengendValues.length;
        for (var i = 0; i < this.pLengendValues.length; i++) {
            var tLegendName = this.pLengendValues[i];
            var tTargetStatus = false;
            if (tLegendName == inLegendName) {
                tTargetStatus = true;
            }
            tLegendName = 'legend@' + tLegendName;
            this.pChartBase.pChart.component.legend.setSelected(tLegendName, tTargetStatus);
        }
    };

    LineChartController.prototype.setLegendCancel = function () {
        if (this.pSelectedLegend == null) {
            return;
        }
        this.pLegendLockNumber = this.pLengendValues.length;
        for (var i = 0; i < this.pLengendValues.length; i++) {
            var tLegendName = this.pLengendValues[i];
            tLegendName = 'legend@' + tLegendName;
            this.pChartBase.pChart.component.legend.setSelected(tLegendName, true);
        }
        this.pSelectedLegend = null;
    };

    LineChartController.prototype.setLegendSelectSeries = function (inOriginalTable, inLegendName) {
        if (this.pLegendColumns != null && this.pLegendColumns.length > 0) {
            var tOption = Utils.customObjectClone(this.pOriginalOption);
            for (var i = 0; i < tOption.series.length; i++) {
                if (i % 3 == 0) {
                    var tSeriesItem = tOption.series[i];
                    var tLightSeriesItem = tOption.series[i + 1];
                    if (tSeriesItem.name != inLegendName) {
                        for (var j = 0; j < tSeriesItem.data.length; j++) {
                            var tDataItem = tSeriesItem.data[j];
                            var tLightDataItem = tLightSeriesItem.data[j];
                            tLightDataItem.value = tDataItem.value;
                            tDataItem.value = '-';
                        }
                    }
                }
            }
            this.pChartBase.pChart.setSeries(tOption.series);
            this.pSelectedItem = null;
        }
    };

    LineChartController.prototype.getLinkageConditionByLegendName = function (inLegendName) {
        var result = null;
        if (this.pLegendColumns != null && this.pLegendColumns.length > 0) {
            result = InitHelper.initAdapterConditionModel();
            result.Column = this.pLegendColumns[0];
            result.JudgmentObject = inLegendName;
        }
        return result;
    };

    // -------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 图表工厂
     * @constructor
     */
    function ChartFactory() {

    }

    /**
     * 构建一个图表控件
     * @param inDataViewModel 视图模型
     * @param inDiv 形如：'#divId'
     * @param inOption 附加设置
     * @returns {*} 图表控件
     */
    ChartFactory.createChartController = function (inDataViewModel, inDiv, inOption) {
        // 初始化controller -------------------------------------------------------------------------------------------------------------------------------------
        var tChartType = inDataViewModel.ChartType.toLowerCase();
        var tDisplayMode = inDataViewModel.DisplayMode.toLowerCase();
        var result = null;
        if (tChartType.indexOf('bar') != -1 ||
            tChartType.indexOf('strip') != -1) {
            // 柱图、条图
            result = new BarChartController(inDiv);
        } else if (tChartType.indexOf('pie') != -1 ||
            tChartType.indexOf('ring') != -1) {
            // 饼图、环图
            result = new PieChartController(inDiv);
        } else if (tChartType.indexOf('line') != -1) {
            // 折线图
            result = new LineChartController(inDiv);
        }

        // 异步加载数据 --------------------------------------------------------------------------------------------------------------------------------------------
        var tQueryModel = QueryModelBuilder.getQueryModel(inDataViewModel, null);
        DataLoader.getData(getDataUrl(), tQueryModel, function (dataString) {
            var tData = JSON.parse(dataString);
            if (tChartType.indexOf('bar') != -1) {
                // 柱图
                if (tDisplayMode == 'stack') {
                    setTimeout(function () {
                        result.firstLoad(inDataViewModel, tData, 'bar', 'stack', inOption);
                    }, 2200);
                } else if (tDisplayMode == 'cluster') {
                    setTimeout(function () {
                        result.firstLoad(inDataViewModel, tData, 'bar', 'cluster', inOption);
                    }, 2200);
                }
            }
            if (tChartType.indexOf('strip') != -1) {
                // 条图
                if (tDisplayMode == 'stack') {
                    setTimeout(function () {
                        result.firstLoad(inDataViewModel, tData, 'strip', 'stack', inOption);
                    }, 2200);
                } else if (tDisplayMode == 'cluster') {
                    setTimeout(function () {
                        result.firstLoad(inDataViewModel, tData, 'strip', 'cluster', inOption);
                    }, 2200);
                }
            } else if (tChartType.indexOf('pie') != -1) {
                // 饼图
                setTimeout(function () {
                    result.firstLoad(inDataViewModel, tData, 'pie', inOption);
                }, 2200);
            } else if (tChartType.indexOf('ring') != -1) {
                // 环图
                setTimeout(function () {
                    result.firstLoad(inDataViewModel, tData, 'ring', inOption);
                }, 2200);
            } else if (tChartType.indexOf('line') != -1) {
                // 线图
                if (tDisplayMode == 'stack') {
                    setTimeout(function () {
                        result.firstLoad(inDataViewModel, tData, 'bar', 'stack', inOption);
                    }, 2200);
                } else if (tDisplayMode == 'cluster') {
                    setTimeout(function () {
                        result.firstLoad(inDataViewModel, tData, 'bar', 'cluster', inOption);
                    }, 2200);
                }
            }
        });

        // 立即返回controller --------------------------------------------------------------------------------------------------------------------------------------
        return result;
    };

    // -------------------------------------------------------------------------------------------------------------------------------------------

    return {
        'setServerAddress': setServerAddress,
        'getSolutionUrl': getSolutionUrl,
        'getDataUrl': getDataUrl,
        // -------------------------------------------
        'getSolution': SolutionGetter.getSolution,
        // -------------------------------------------
        'setLinkage': ChartGroup.setLinkage,
        'cancelLinkage': ChartGroup.cancelLinkage,
        // -------------------------------------------
        'createChartController': ChartFactory.createChartController,
        // -----------------------------------------------
        'dataLoader': DataLoader
    };
});
