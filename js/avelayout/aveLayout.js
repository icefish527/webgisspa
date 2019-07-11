if ("undefined" == typeof jQuery || "undefined" == typeof jQuery)throw new Error('"dad web layout requires jquery reference"');
var AVELayout = {}, namespace = {
    reg: function (a) {
        for (var b = a.split("."), c = window, d = 0, e = b.length; e > d; d++)"undefined" == typeof c[b[d]] && (c[b[d]] = {}), c = c[b[d]]
    }, del: function (a) {
        for (var b = a.split("."), c = window, d = 0, e = b.length; e > d; d++) {
            if ("undefined" == typeof c[b[d]])return;
            if (e == d + 1)return void delete c[b[d]];
            c = c[b[d]]
        }
    }
};
namespace.reg("AVELayout"), AVELayout.eval = function (a) {
    window.attachEvent && !window.opera ? execScript(a) : window.eval(a)
}, AVELayout.RowDefinition = function (a, b, c) {
    this.height = a, this.minHeight = null == b || 100 > b ? 100 : b, this.maxHeight = c, this.clone = function () {
        return new AVELayout.RowDefinition(this.height, this.minHeight, this.maxHeight)
    }
}, AVELayout.ColDefinition = function (a, b, c) {
    this.width = a, this.minWidth = null == b || 100 > b ? 100 : b, this.maxWidth = c, this.clone = function () {
        return new AVELayout.ColDefinition(this.width, this.minWidth, this.maxWidth)
    }
}, AVELayout.Layout = function (a, b, c, d, e, f) {
    this.row = a, this.col = b, this.rowspan = c, this.colspan = d, this.id = e, this.canCollapse = null == f ? !1 : f
}, AVELayout.Layout.sort = function (a, b) {
    return a.row == b.row ? a.col - b.col : a.row - b.row
}, AVELayout.LayoutTemplate = function (a, b, c, d) {
    if (!(a instanceof Array && b instanceof Array && c instanceof Array))throw new TypeError;
    this.rowDefinitions = a, this.colDefinitions = b, this.layouts = c, this.id = d, this.rows = this.rowDefinitions.length, this.cols = this.colDefinitions.length, this.clone = function () {
        for (var a = this.rowDefinitions.length, b = new Array(a), c = 0; a > c; c++)b[c] = this.rowDefinitions[c].clone();
        a = this.colDefinitions.length;
        for (var d = new Array(a), c = 0; a > c; c++)d[c] = this.colDefinitions[c].clone();
        return new AVELayout.LayoutTemplate(b, d, this.layouts, this.id)
    }
}, AVELayout.LayoutTemplate.__generateLayoutTemplates = function (a) {
    if (!(a instanceof Array))throw new TypeError("json instance must be instanceof array");
    for (var b = [], c = a.length, d = 0; c > d; d++) {
        for (var e = a[d], f = [], g = [], h = [], i = e.rows.length, j = 0; i > j; j++) {
            var k = e.rows[j];
            try {
                var l = new AVELayout.RowDefinition(k.height)
            } catch (m) {
                console.log(m.message), console.log("load json file error");
                continue
            }
            f.push(l)
        }
        i = e.cols.length;
        for (var j = 0; i > j; j++) {
            var n = e.cols[j], o = new AVELayout.ColDefinition(n.width);
            g.push(o)
        }
        i = e.layouts.length;
        for (var j = 0; i > j; j++) {
            var p = e.layouts[j], q = new AVELayout.Layout(p.row, p.column, p.rowspan, p.colspan, p.id, p.canCollapse);
            h.push(q)
        }
        h.sort(AVELayout.Layout.sort);
        var r = new AVELayout.LayoutTemplate(f, g, h, e.backgroundLayoutID);
        b.push(r)
    }
    return b
}, AVELayout.LayoutTemplate.getLayoutTemplatesFromUrl = function (a, b) {
    $.getJSON(a, function (a) {
        var c = AVELayout.LayoutTemplate.__generateLayoutTemplates(a);
        null != b && b(c)
    })
}, AVELayout.LayoutViewType = {selector: 0, html: 1, text: 2, url: 3}, AVELayout.LayoutViewSeed = function (a, b) {
    this.type = a, this.value = b
}, AVELayout.LayoutViewFactory = function () {
    this.__createBySelector = function (a) {
        return $(a).clone().css("display", "block")
    }, this.__createByHtml = function (a) {
        return $(a)
    }, this.__createByText = function (a) {
        return $("<p>" + a + "</P>")
    }, this.__createFromUrl = function (a, b) {
        $.ajax({
            type: "GET", url: a, dataType: "html", success: function (a) {
                null != b && b($(a))
            }, error: function () {
                null != b && b(null)
            }
        })
    }, this.create = function (a, b, c) {
        var d = null, e = !0;
        switch (a) {
            case AVELayout.LayoutViewType.selector:
                d = this.__createBySelector(b);
                break;
            case AVELayout.LayoutViewType.text:
                d = this.__createByText(b);
                break;
            case AVELayout.LayoutViewType.html:
                d = this.__createByHtml(b);
                break;
            case AVELayout.LayoutViewType.url:
                this.__createFromUrl(b, c), e = !1
        }
        null != c && e && c(d)
    }
}, AVELayout.SizeChangedEvent = function () {
}, AVELayout.SizeChangedEvent.event = null, AVELayout.SizeChangedEvent.createEvent = function () {
    if (null == AVELayout.SizeChangedEvent.event) {
        var a, b = "sizeChanged";
        return document.createEvent ? (a = document.createEvent("HTMLEvents"), a.initEvent(b, !0, !1)) : (a = document.createEventObject(), a.eventType = b), a.eventName = b, AVELayout.SizeChangedEvent.event = a, a
    }
}, AVELayout.SizeChangedEvent.trigger = function (a, b) {
    var c = AVELayout.SizeChangedEvent.event;
    c.data = {isMaximize: b}, document.createEvent ? a.dispatchEvent(c) : a.fireEvent("on" + c.eventType, c)
}, AVELayout.Size = function (a, b) {
    this.width = a, this.height = b
}, AVELayout.Space = function (a, b, c, d, e, f, g, h, i, j, k, l) {
    this.left = a + b + c, this.right = d + e + f, this.top = g + h + i, this.bottom = j + k + l, this.leftBorder = c + b, this.rightBorder = f + e, this.topBorder = i + h, this.bottomBorder = l + k, this.marginLeft = a, this.marginTop = g
}, AVELayout.Position = function (a, b) {
    this.left = a, this.top = b
}, AVELayout.UIContext = function (a, b) {
    this.leftItem = a, this.topItem = b
}, AVELayout.DIVElement = function () {
    this.__calcSpaces = function (a) {
        var b = parseFloat(a.css("margin-top")), c = parseFloat(a.css("margin-bottom")), d = parseFloat(a.css("margin-right")), e = parseFloat(a.css("margin-left")), f = parseFloat(a.css("padding-top")), g = parseFloat(a.css("padding-bottom")), h = parseFloat(a.css("padding-right")), i = parseFloat(a.css("padding-left")), j = parseFloat(a.css("border-top-width")), k = parseFloat(a.css("border-bottom-width")), l = parseFloat(a.css("border-right-width")), m = parseFloat(a.css("border-left-width"));
        return new AVELayout.Space(e, m, i, d, l, h, b, j, f, c, k, g)
    }
}, AVELayout.GridItem = function (a, b, c, d, e) {
    var f = this;
    this.__measure = function () {
        for (var a = 0, b = 0, c = this.layout.row + this.layout.rowspan, d = this.layout.row; c > d && !(d >= this.grid.layoutTemplate.rowDefinitions.length); d++)a += this.grid.layoutTemplate.rowDefinitions[d].height;
        for (var c = this.layout.col + this.layout.colspan, d = this.layout.col; c > d && !(d >= this.grid.layoutTemplate.colDefinitions.length); d++)b += this.grid.layoutTemplate.colDefinitions[d].width;
        b = b - this.space.left - this.space.right, a = a - this.space.top - this.space.bottom, this.size = new AVELayout.Size(b, a);
        var e = 0, g = 0;
        null != this.uiContext.leftItem && (e = this.uiContext.leftItem.size.width + this.uiContext.leftItem.position.left + this.uiContext.leftItem.space.right + this.space.left), null != this.uiContext.topItem && (g = this.uiContext.topItem.size.height + this.uiContext.topItem.position.top + this.uiContext.topItem.space.bottom + this.space.top), this.position = new AVELayout.Position(e, g), this.$element.height(this.size.height).width(this.size.width), this.$element.css(this.position), AVELayout.SizeChangedEvent.trigger(f.$element[0])
    }, this.__createDomElement = function () {
        var a = $("<div></div>");
        if (null != this.grid.layoutTemplate.id && this.layout.id == this.grid.layoutTemplate.id) {
            if (a.addClass("background-gridItem"), null != this.backgroundGridItemClasses)for (var b = this.backgroundGridItemClasses.length, c = 0; b > c; c++)a.addClass(this.backgroundGridItemClasses[c])
        } else if (a.addClass("gridItem"), null != this.gridItemClasses)for (var b = this.gridItemClasses.length, c = 0; b > c; c++)a.addClass(this.gridItemClasses[c]);
        return a
    }, this.onSizeChanged = function () {
        f.__measure()
    }, this.hideContent = function () {
        f.$element.children(":not(.ui-resizable-handle)").hide()
    }, this.showContent = function () {
        f.$element.children(":not(.ui-resizable-handle)").show()
    }, this.hideRowSplitter = function () {
        null != this.rowSplitter && this.rowSplitter.$splitter.hide()
    }, this.hideColSplitter = function () {
        null != this.colSplitter && this.colSplitter.$splitter.hide()
    }, this.showRowSplitter = function () {
        null != this.rowSplitter && this.rowSplitter.$splitter.show()
    }, this.showColSplitter = function () {
        null != this.colSplitter && this.colSplitter.$splitter.show()
    }, this.layout = a, this.grid = b, this.uiContext = c, this.gridItemClasses = d, this.backgroundGridItemClasses = e, this.size = null, this.space = null, this.position = null, this.rowSplitter = null, this.colSplitter = null, this.$element = this.__createDomElement(), this.grid.addChild(this), this.space = this.__calcSpaces(this.$element), this.__measure(), a.row > 0 && (this.rowSplitter = new AVELayout.GridSplitter(this.grid, this, "row", null)), a.col > 0 && (this.colSplitter = new AVELayout.GridSplitter(this.grid, this, "col", null))
}, AVELayout.GridItem.prototype = new AVELayout.DIVElement, AVELayout.GridSplitter = function (a, b, c, d) {
    this.__initUI = function () {
        "row" === this.category ? this.$splitter.addClass("ui-resizable-r") : "col" === this.category && this.$splitter.addClass("ui-resizable-c")
    }, this.__mousemove = function (a) {
        if (0 != e) {
            var b = 0, c = 0;
            "row" == g.category ? (c = a.pageY - f, f = a.pageY) : "col" == g.category && (b = a.pageX - f, f = a.pageX), null != g.grid.resize && g.grid.resize(g.gridItem, b, c)
        }
    }, this.__mouseup = function () {
        e = !1, $(document).unbind("mousemove").unbind("mouseup"), $(".gridItem").removeClass("on-mouse-move"), f = null, $("body").css("cursor", "default")
    }, this.__onSplitterMouseDown = function (a) {
        null == g.grid.miniCols[g.layout.col] && null == g.grid.miniRows[g.layout.row] && (e = !0, $(document).bind("mousemove", g.__mousemove).bind("mouseup", g.__mouseup), $(".gridItem").addClass("on-mouse-move"), "row" == g.category ? (f = a.pageY, $("body").css("cursor", "row-resize")) : "col" == g.category && (f = a.pageX, $("body").css("cursor", "col-resize")))
    }, this.__bindEvents = function () {
        this.$splitter.mousedown(this.__onSplitterMouseDown)
    }, this.grid = a, this.gridItem = b, this.layout = b.layout, this.category = c, this.onResize = d, this.$splitter = $("<div></div>").addClass("ui-resizable-handle"), this.gridItem.$element.append(this.$splitter);
    var e = !1, f = null, g = this;
    this.__initUI(), this.__bindEvents()
}, AVELayout.LayoutFactory = function (a, b, c) {
    var d = this;
    this.__createBackground = function () {
        var a = $("<div><div>").addClass("background");
        if (null != this.backgroundClasses)for (var b = this.backgroundClasses.length, c = 0; b > c; c++)a.addClass(this.backgroundClasses[c]);
        return a
    }, this.__generateGridLayout = function () {
        for (var a = [], b = 0; b < this.layoutTemplate.layouts.length; b++)this.layoutTemplate.id == this.layoutTemplate.layouts[b].id && (this.backgroundLayout = this.layoutTemplate.layouts[b], this.$backgroundView = this.__createBackground(), this.$element.append(this.$backgroundView));
        for (var c = this.layoutTemplate.layouts.length, b = 0; c > b; b++) {
            var d = this.layoutTemplate.layouts[b], e = null, f = null;
            d.row > 0 && (f = this.matrix[d.row - 1][d.col]), d.col > 0 && (e = this.matrix[d.row][d.col - 1]);
            var g = new AVELayout.GridItem(d, this, new AVELayout.UIContext(e, f), this.gridItemClasses, this.backgroundGridItemClasses), h = null;
            h = this.layoutTemplate.id == d.id ? new AVELayout.BackgroundLayoutContext(d, g.$element, this.$backgroundView) : new AVELayout.LayoutContext(d, g.$element), a.push(h);
            for (var i = d.row + d.rowspan, j = d.col + d.colspan, k = d.row; i > k; k++)for (var l = d.col; j > l; l++)this.matrix[k][l] = g
        }
        return a
    }, this.__measureBackgroundView = function () {
        if (null != this.$backgroundView) {
            var a = this.space.leftBorder + this.space.rightBorder, b = this.space.topBorder + this.space.bottomBorder, c = this.$element.width() - a - this.backgroundSpace.left - this.backgroundSpace.right, d = this.$element.height() - b - this.backgroundSpace.top - this.backgroundSpace.bottom;
            this.$backgroundView.width(c).height(d)
        }
    }, this.__calcSize = function () {
        if (!this.$element.is(":hidden")) {
            var a = new AVELayout.Size(this.$element.width(), this.$element.height());
            if (0 != a.width && 0 != a.height) {
                var b = null == this.size ? 1 : a.height / this.size.height, c = null == this.size ? 1 : a.width / this.size.width;
                this.size = a;
                for (var d = this.size.width, e = this.size.height, f = 0, g = 0, h = 0, i = 0, j = this.layoutTemplate.rowDefinitions.length, k = 0; j > k; k++) {
                    var l = this.layoutTemplate.rowDefinitions[k];
                    if (l.height > 0) {
                        var m = l.height * b;
                        l.height = m, e -= m, h += l.height
                    } else f++
                }
                j = this.layoutTemplate.colDefinitions.length;
                for (var k = 0; j > k; k++) {
                    var n = this.layoutTemplate.colDefinitions[k];
                    if (n.width > 0) {
                        var o = n.width * c;
                        n.width = o, d -= o, i += n.width
                    } else g++
                }
                var p = 0 == f ? 0 : e / f, q = 0 == g ? 0 : d / g;
                b = this.size.height / h, c = this.size.width / i;
                for (var j = this.layoutTemplate.rowDefinitions.length, k = 0; j > k; k++)0 == f ? this.layoutTemplate.rowDefinitions[k].height *= b : 0 == this.layoutTemplate.rowDefinitions[k].height && (this.layoutTemplate.rowDefinitions[k].height = p);
                j = this.layoutTemplate.colDefinitions.length;
                for (var k = 0; j > k; k++)0 == g ? this.layoutTemplate.colDefinitions[k].width *= c : 0 == this.layoutTemplate.colDefinitions[k].width && (this.layoutTemplate.colDefinitions[k].width = q)
            }
        }
    }, this.__triggerChildrenResize = function () {
        for (var a = this.children.length, b = 0; a > b; b++) {
            var c = this.children[b];
            null != c.onSizeChanged && c.onSizeChanged()
        }
    }, this.resize = function (a, b, c, e) {
        if (0 != b || 0 != c) {
            if (0 != c) {
                for (var f = a.layout.row, g = d.matrix[f - 1][a.layout.col].layout, h = a.layout.rowspan, i = new Array(h), j = c / h, k = 0; h > k; k++) {
                    var l = d.layoutTemplate.rowDefinitions[a.layout.row + k], m = l.height - j;
                    if ((c > 0 && m <= l.minHeight || 0 > c && m >= l.maxHeight) && !e)return;
                    i[k] = m
                }
                h = g.rowspan, j = c / h;
                for (var n = new Array(h), k = 0; h > k; k++) {
                    var l = d.layoutTemplate.rowDefinitions[g.row + k], m = l.height + j;
                    if ((0 > c && m <= l.minHeight || c > 0 && m >= l.maxHeight) && !e)return;
                    n[k] = m
                }
                h = a.layout.rowspan;
                for (var k = 0; h > k; k++) {
                    var l = d.layoutTemplate.rowDefinitions[a.layout.row + k];
                    l.height = i[k]
                }
                h = g.rowspan;
                for (var k = 0; h > k; k++) {
                    var l = d.layoutTemplate.rowDefinitions[g.row + k];
                    l.height = n[k]
                }
            } else {
                for (var o = a.layout.col, p = d.matrix[a.layout.row][o - 1].layout, h = a.layout.colspan, q = new Array(h), r = b / h, k = 0; h > k; k++) {
                    var s = d.layoutTemplate.colDefinitions[a.layout.col + k], t = s.width - r;
                    if ((b > 0 && t <= s.minWidth || 0 > b && t >= s.maxWidth) && !e)return;
                    q[k] = t
                }
                h = p.colspan, r = b / h;
                for (var u = new Array(h), k = 0; h > k; k++) {
                    var s = d.layoutTemplate.colDefinitions[p.col + k], t = s.width + r;
                    if ((0 > b && t <= s.minWidth || b > 0 && t >= s.maxWidth) && !e)return;
                    u[k] = t
                }
                h = a.layout.colspan;
                for (var k = 0; h > k; k++) {
                    var s = d.layoutTemplate.colDefinitions[a.layout.col + k];
                    s.width = q[k]
                }
                h = p.colspan;
                for (var k = 0; h > k; k++) {
                    var s = d.layoutTemplate.colDefinitions[p.col + k];
                    s.width = u[k]
                }
            }
            d.__triggerChildrenResize()
        }
    }, this.directions = {
        north: "north",
        south: "south",
        west: "west",
        east: "east"
    }, this.resizeByLayout = function (a, b, c, e) {
        if (0 != c || 0 != e) {
            if (0 != e) {
                var f = b;
                if (a == this.directions.north)var g = b + 1; else var g = b - 1;
                var h = d.layoutTemplate.rowDefinitions[f];
                for (h.height = h.height - e; ;) {
                    var i = d.layoutTemplate.rowDefinitions[g];
                    {
                        if (!(i.height + e <= 0)) {
                            i.height = i.height + e;
                            break
                        }
                        a == this.directions.north ? g++ : g--
                    }
                }
            } else {
                var j = b;
                if (a == this.directions.west)var k = b + 1; else var k = b - 1;
                var l = d.layoutTemplate.colDefinitions[j];
                for (l.width = l.width - c; ;) {
                    var m = d.layoutTemplate.colDefinitions[k];
                    {
                        if (!(m.width + c <= 0)) {
                            m.width = m.width + c;
                            break
                        }
                        a == this.directions.west ? k++ : k--
                    }
                }
            }
            d.__triggerChildrenResize()
        }
    }, this.__getDirection = function (a, b) {
        var c = null;
        return a ? b >= this.backgroundLayout.row + this.backgroundLayout.rowspan ? c = this.directions.south : b <= this.backgroundLayout.row && (c = this.directions.north) : b >= this.backgroundLayout.col + this.backgroundLayout.colspan ? c = this.directions.east : b <= this.backgroundLayout.col && (c = this.directions.west), c
    }, this.minimizeRow = function (a) {
        if (null == this.miniRows[a]) {
            for (var b = this.__getDirection(!0, a), c = 0; c < this.layoutTemplate.cols; c++) {
                var d = this.matrix[a][c];
                d.layout.row != a || d.layout.rowspan > 1 || (d.hideContent(), b == this.directions.north ? this.matrix[a + 1][c].hideRowSplitter() : d.hideRowSplitter())
            }
            var e = 1, f = this.layoutTemplate.rowDefinitions[d.layout.row].height, g = f - e;
            this.miniRows[a] = f, this.resizeByLayout(b, a, 0, g)
        }
    }, this.minimizeCol = function (a) {
        if (null == this.miniCols[a]) {
            for (var b = this.__getDirection(!1, a), c = 0; c < this.layoutTemplate.rows; c++) {
                var d = this.matrix[c][a];
                d.layout.col != a || d.layout.colspan > 1 || (d.hideContent(), b == this.directions.west ? this.matrix[c][a + 1].hideColSplitter() : d.hideColSplitter())
            }
            var e = 1, f = this.layoutTemplate.colDefinitions[a].width, g = f - e;
            this.miniCols[a] = f, this.resizeByLayout(b, a, g, 0)
        }
    }, this.maximizeRow = function (a) {
        if (null != this.miniRows[a]) {
            for (var b = this.__getDirection(!0, a), c = 0; c < this.layoutTemplate.cols; c++) {
                var d = this.matrix[a][c];
                d.layout.row != a || d.layout.rowspan > 1 || (d.showContent(), b == this.directions.north ? this.matrix[a + 1][c].showRowSplitter() : d.showRowSplitter())
            }
            var e = 1, f = this.miniRows[a], g = e - f;
            this.miniRows[a] = null, this.resizeByLayout(b, a, 0, g)
        }
    }, this.maximizeCol = function (a) {
        if (null != this.miniCols[a]) {
            for (var b = this.__getDirection(!1, a), c = 0; c < this.layoutTemplate.rows; c++) {
                var d = this.matrix[c][a];
                d.layout.col != a || d.layout.colspan > 1 || (d.showContent(), b == this.directions.west ? this.matrix[c][a + 1].showColSplitter() : d.showColSplitter())
            }
            var e = 1, f = this.miniCols[a], g = e - f;
            this.miniCols[a] = null, this.resizeByLayout(b, a, g, 0)
        }
    }, this.addChild = function (a) {
        this.children.push(a), this.$element.append(a.$element)
    }, this.onSizeChanged = function () {
        d.__calcSize(), d.__measureBackgroundView(), d.__triggerChildrenResize()
    }, this.create = function () {
        null != c ? (this.gridItemClasses = c.gridItemClasses instanceof Array ? c.gridItemClasses : null, this.backgroundGridItemClasses = c.backgroundGridItemClasses instanceof Array ? c.backgroundGridItemClasses : null, this.backgroundClasses = c.backgroundClasses instanceof Array ? c.backgroundClasses : null) : (this.gridItemClasses = null, this.backgroundGridItemClasses = null, this.backgroundClasses = null), this.$element.empty(), this.space = this.__calcSpaces(this.$element), this.__calcSize();
        var a = this.__generateGridLayout();
        return null != this.$backgroundView && (this.backgroundSpace = this.__calcSpaces(this.$backgroundView), this.__measureBackgroundView()), $(window).resize(d.onSizeChanged), a
    }, this.close = function () {
        $(window).unbind("resize", d.onSizeChanged), this.$element.empty()
    }, this.children = [], this.size = null, this.space = null, this.$element = b, this.layoutTemplate = a, this.$backgroundView = null, this.backgroundSpace = null, this.backgroundLayout = null, this.miniRows = new Array(this.layoutTemplate.rows), this.miniCols = new Array(this.layoutTemplate.cols), this.matrix = new Array(a.rows);
    for (var e = 0; e < a.rows; e++)this.matrix[e] = new Array(a.cols)
}, AVELayout.LayoutFactory.prototype = new AVELayout.DIVElement, AVELayout.ThumbnailFactory = function (a) {
    this.$layoutContainer = null, this.layoutTemplate = a, this.__createTable = function () {
        return $("<table></table>").addClass("thumbnail-table")
    }, this.__createTableRow = function () {
        return $("<tr></tr>")
    }, this.__createTableCell = function (a) {
        var b = $("<td></td>");
        return b.attr("rowspan", a.rowspan), b.attr("colspan", a.colspan), b
    }, this.__createColDefinition = function (a) {
        var b = $("<col/>"), c = 1 / a * 100;
        return b.attr("width", c + "%"), b
    }, this.__createThumbnailLayout = function () {
        for (var a = this.__createTable(), b = [], c = 0; c < this.layoutTemplate.rows; c++) {
            var d = this.__createTableRow();
            b.push(d)
        }
        for (var c = 0; c < this.layoutTemplate.cols; c++) {
            var e = this.__createColDefinition(this.layoutTemplate.cols);
            a.append(e)
        }
        for (var f = this.layoutTemplate.layouts.length, g = 0, h = b[0], c = 0; f > c; c++) {
            var i = this.layoutTemplate.layouts[c], j = i.row;
            if (g != j && (g = j, h = b[j]), null == h)throw new Error("create layout error, row is undefined");
            var k = this.__createTableCell(i);
            h.append(k)
        }
        for (var c = 0; c < this.layoutTemplate.rows; c++)d = b.shift(), a.append(d);
        this.$layoutContainer.append(a)
    }, this.create = function () {
        var b = $(".layout-thumbnail-template").clone().removeClass("layout-thumbnail-template").addClass("layout-thumbnail").data("layoutTemplate", a);
        return this.$layoutContainer = b.find(".layout-thumbnail-container"), this.__createThumbnailLayout(), b
    }
}, AVELayout.LayoutContext = function (a, b, c) {
    this.name = null, this.$view = null, this.viewType = null, this.viewValue = null, this.onViewChanged = null, this.onNameChanged = null, this.viewFactory = new AVELayout.LayoutViewFactory;
    var d = this;
    this.setName = function (a) {
        this.name = a, null != this.onNameChanged && this.onNameChanged(this.name)
    }, this.setView = function (a, b, c, e) {
        d.$scope = c, d.$compile = e, this.viewFactory.create(a, b, function (c) {
            d.$view = c, d.viewType = a, d.viewValue = b, null != d.onViewChanged && d.onViewChanged(d.$view, d.$scope, d.$compile)
        })
    }, this.layout = a, this.$cell = b, this.setName(c)
}, AVELayout.LayoutContext.sortByLayoutID = function (a, b) {
    return a.id - b.id
}, AVELayout.LayoutContext.sortByLayout = function (a, b) {
    return AVELayout.Layout.sort(a.layout, b.layout)
}, AVELayout.BackgroundLayoutContext = function (a, b, c) {
    this.name = null, this.$view = null, this.viewType = null, this.viewValue = null, this.onViewChanged = null, this.onNameChanged = null, this.viewFactory = new AVELayout.LayoutViewFactory;
    var d = this;
    this.setName = function (a) {
        this.name = a, null != this.onNameChanged && this.onNameChanged(this.name)
    }, this.setView = function (a, b, c, e) {
        d.$scope = c, d.$compile = e, this.viewFactory.create(a, b, function (c) {
            d.$view = c, d.viewType = a, d.viewValue = b, null != d.onViewChanged && d.onViewChanged(d.$view, d.$scope, d.$compile)
        })
    }, this.layout = a, this.$cell = b, this.$background = c
}, AVELayout.BackgroundLayoutContext.prototype = new AVELayout.LayoutContext, AVELayout.LayoutView = function () {
    this.$view = null, this.templateClassName = null, this.viewClassName = null, this.dataContext = null, this.$cell = null, this.__onLoad = null, this.updateView = null, this.onShowView = null, this.onHideView = null, this.onSizeChanged = null, this.createView = function () {
        this.$view = $("." + this.templateClassName).clone().removeClass(this.templateClassName).addClass(this.viewClassName).data("dataContext", this.dataContext)
    }, this.__emptyChildren = function (a) {
        a.each(function (a, b) {
            for (var c = [], d = b.children.length, e = 0; d > e; e++)c.push(b.children[e]);
            for (var e = 0; d > e; e++)b.removeChild(c[e])
        })
    }, this.__removeComments = function (a) {
        return a.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, "\n").replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, "\n")
    }, this.__appendChildren = function (a, b) {
        if (!(a.length < 1 || null == b || null == a)) {
            for (var c = new Array(b.length), d = b.length, e = 0; d > e; e++)c[e] = b[e];
            for (var f = a[0], e = 0; d > e; e++) {
                var g = c[e];
                if (null != g.parentElement) {
                    var h = g.parentElement;
                    h.removeChild(g)
                }
                if (f.appendChild(g), "script" == g.tagName || "SCRIPT" == g.tagName)try {
                    AVELayout.eval(g.innerHTML)
                } catch (i) {
                    console.error("执行动态脚本错误！\r\n" + i + "\r\n" + g.innerHTML)
                }
            }
        }
    }
}, AVELayout.GridItemLayoutView = function (a, b, c, d, e) {
    this.$view = null, this.$contentContainer = null, this.$cell = c.$cell, this.templateClassName = a, this.viewClassName = b, this.dataContext = c, this.onMaximize = d, this.onClose = e;
    var f = this;
    this.__onViewChanged = function (a, b, c) {
        null != f.$contentContainer && (null != a ? (null != b && null != c && (a = c(a)(b), f.dataContext.$view = a), f.__emptyChildren(f.$contentContainer), f.__appendChildren(f.$contentContainer, f.dataContext.$view)) : f.__emptyChildren(f.$contentContainer))
    }, this.__onNameChanged = function (a) {
        null != f.$view && f.$view.find(".layout-item-name").text(f.dataContext.name)
    }, this.__onLoad = function () {
        this.createView(), this.$view.find(".layout-item-name").text(this.dataContext.name), this.$view.find(".layout-item-button-snap").bind("click", this, this.onMaximize), this.$view.find(".layout-item-button-close").bind("click", this, this.onClose), this.$contentContainer = this.$view.find(".layout-item-container"), this.__emptyChildren(this.$contentContainer), this.__appendChildren(this.$contentContainer, this.dataContext.$view), this.__appendChildren(this.$cell, this.$view), this.dataContext.onViewChanged = this.__onViewChanged, this.dataContext.onNameChanged = this.__onNameChanged
    }, this.onShowView = function () {
        null != this.$contentContainer && this.__appendChildren(this.$contentContainer, this.dataContext.$view)
    }, this.onHideView = function () {
        null != this.$contentContainer && this.__emptyChildren(this.$contentContainer)
    }, this.__onLoad()
}, AVELayout.GridItemLayoutView.prototype = new AVELayout.LayoutView, AVELayout.GridBackgroundItemView = function (a, b, c, d, e) {
    this.$view = null, this.$contentContainer = c.$background, this.$cell = c.$cell, this.templateClassName = a, this.viewClassName = b, this.dataContext = c, this.onMaximize = d, this.onClose = e;
    var f = this;
    this.__onViewChanged = function (a, b, c) {
        null != f.$contentContainer && (null != a ? (null != b && null != c && (a = c(a)(b), f.dataContext.$view = a), f.__emptyChildren(f.$contentContainer), f.__appendChildren(f.$contentContainer, f.dataContext.$view)) : f.__emptyChildren(f.$contentContainer))
    }, this.__onNameChanged = function (a) {
        null != f.$view && f.$view.find(".layout-backgrounditem-name").text(f.dataContext.name)
    }, this.__onLoad = function () {
        this.createView(), this.$view.find(".layout-backgrounditem-name").text(this.dataContext.name), this.$view.find(".layout-backgrounditem-button-snap").bind("click", this, this.onMaximize), this.$view.find(".layout-backgrounditem-button-close").bind("click", this, this.onClose), this.__emptyChildren(this.$contentContainer), this.__appendChildren(this.$contentContainer, this.dataContext.$view), this.__appendChildren(this.$view), this.dataContext.onViewChanged = this.__onViewChanged, this.dataContext.onNameChanged = this.__onNameChanged
    }, this.onShowView = function () {
        null != this.$contentContainer && this.__appendChildren(this.$contentContainer, this.dataContext.$view)
    }, this.onHideView = function () {
        null != this.$contentContainer && this.__emptyChildren(this.$contentContainer)
    }, this.__onLoad()
}, AVELayout.GridBackgroundItemView.prototype = new AVELayout.LayoutView, AVELayout.SnapMaximizeView = function (a, b, c, d, e, f, g) {
    this.$view = null, this.$cell = d, this.$contentContainer = null, this.templateClassName = a, this.viewClassName = b, this.dataContext = c, this.onResize = e, this.onClose = f, this.onConfig = g, this.__onLoad = function () {
        this.createView(), this.$view.find(".snap-curview-name").text(this.dataContext.name), this.$view.find(".snap-curview-button-close").bind("click", this, this.onClose), this.$view.find(".snap-curview-button-resize").bind("click", this, this.onResize), this.$view.find(".snap-curview-button-config").bind("click", this, this.onConfig), this.$contentContainer = this.$view.find(".snap-curview-container"), this.__emptyChildren(this.$contentContainer), this.__appendChildren(this.$contentContainer, this.dataContext.$view), this.__emptyChildren(this.$cell), this.__appendChildren(this.$cell, this.$view)
    }, this.updateView = function (a) {
        this.dataContext = a, this.$cell.find(".snap-curview-name").text(this.dataContext.name), this.__emptyChildren(this.$contentContainer), this.__appendChildren(this.$contentContainer, this.dataContext.$view), this.dataContext instanceof AVELayout.BackgroundLayoutContext ? AVELayout.SizeChangedEvent.trigger(this.dataContext.$cell[0], !0) : AVELayout.SizeChangedEvent.trigger(this.dataContext.$cell[0], !1)
    }, this.onShowView = function () {
        null != this.$contentContainer && this.__appendChildren(this.$contentContainer, this.dataContext.$view)
    }, this.onHideView = function () {
        null != this.$contentContainer && this.__emptyChildren(this.$contentContainer)
    }, this.__onLoad()
}, AVELayout.SnapMaximizeView.prototype = new AVELayout.LayoutView, AVELayout.SnapMiniView = function (a, b, c, d, e) {
    this.$view = null, this.templateClassName = a, this.viewClassName = b, this.dataContext = c, this.$cell = d, this.exchangeCallback = e, this.__onLoad = function () {
        this.createView(), this.$view.find(".snap-miniview-name").text(this.dataContext.name), this.$view.find(".snap-miniview-button-exchange").bind("click", this, this.exchangeCallback), this.__appendChildren(this.$cell, this.$view)
    }, this.updateView = function (a) {
        this.dataContext = a, this.$view.find(".snap-miniview-name").text(this.dataContext.name)
    }, this.__onLoad()
}, AVELayout.SnapMiniView.prototype = new AVELayout.LayoutView, AVELayout.ViewType = function () {
    this.$cell = null, this.application = null, this.__initialize = null, this.show = null, this.hide = null
}, AVELayout.GridView = function (a) {
    this.$cell = a, this.gridItemViews = [];
    this.__initialize = function () {
        for (var a = this.application.dataContexts.length, b = 0; a > b; b++) {
            var c = this.application.dataContexts[b], d = null;
            d = c instanceof AVELayout.BackgroundLayoutContext ? new AVELayout.GridBackgroundItemView("layout-backgrounditem-template", "layout-backgrounditem", c, this.application.onLayoutItemMaximize, this.application.onLayoutItemClose) : new AVELayout.GridItemLayoutView("layout-item-template", "layout-item", c, this.application.onLayoutItemMaximize, this.application.onLayoutItemClose), this.gridItemViews.push(d)
        }
    }, this.show = function () {
        if (null != this.$cell)if (this.$cell.show(), 0 == this.gridItemViews.length)this.__initialize(); else for (var a = this.gridItemViews.length, b = 0; a > b; b++) {
            var c = this.gridItemViews[b];
            c.onShowView()
        }
    }, this.hide = function () {
        if (null != this.$cell) {
            if (this.gridItemViews.length > 0)for (var a = this.gridItemViews.length, b = 0; a > b; b++) {
                var c = this.gridItemViews[b];
                c.onHideView()
            }
            this.$cell.hide()
        }
    }
}, AVELayout.GridView.prototype = new AVELayout.ViewType, AVELayout.SnapView = function (a) {
    this.$cell = a, this.$snapMiniViews = this.$cell.find(".viewList").empty(), this.maxView = null, this.miniViews = [], this.maxDataContext = null;
    var b = this;
    this.__onExchangeView = function (a) {
        var c = a.data, d = b.maxView.dataContext, e = c.dataContext;
        b.maxView.updateView(e), c.updateView(d)
    }, this.__initialize = function () {
        for (var a = this.application.dataContexts.length, b = 0; a > b; b++) {
            var c = this.application.dataContexts[b];
            if (c === this.maxDataContext)this.maxView = new AVELayout.SnapMaximizeView("snap-curview-template", "snap-curview", c, this.$cell.find(".currentView"), this.application.onLayoutItemResize, this.application.onLayoutItemClose); else {
                var d = new AVELayout.SnapMiniView("snap-miniview-template", "snap-miniview", c, this.$snapMiniViews, this.__onExchangeView);
                this.miniViews.push(d)
            }
        }
    }, this.__orderContexts = function () {
        for (var a = this.application.dataContexts.length, b = 0, c = 0; a > b; b++) {
            var d = this.application.dataContexts[b];
            d === this.maxDataContext ? this.maxView.updateView(this.maxDataContext) : (this.miniViews[c].updateView(d), c++)
        }
    }, this.show = function (a) {
        this.maxDataContext = a, null != this.$cell && (this.$cell.show(), 0 == this.miniViews.length && null == this.maxView ? this.__initialize() : this.__orderContexts())
    }, this.hide = function () {
        null != this.$cell && (this.miniViews.length > 0 && null != this.maxView && this.maxView.onHideView(), this.$cell.hide())
    }, this.close = function () {
        null != this.maxView && this.maxView.$contentContainer.empty(), this.$snapMiniViews.empty()
    }
}, AVELayout.SnapView.prototype = new AVELayout.ViewType, AVELayout.LayoutDetail = function (a, b, c, d) {
    this.layoutid = a, this.viewType = b, this.viewValue = c, this.name = d
}, AVELayout.LayoutStorage = function (a, b) {
    this.layoutTemplate = a, this.details = b
}, AVELayout.LayoutApplication = function (a, b, c, d) {
    var e = this;
    this._onLoad = function (a) {
        a.clone ? this.layoutTemplate = a.clone() : this.layoutTemplate = a, this.option = c, this.$container = b, this.$gridContainer = this.$container.find(".layout-grid-container"), this.$snapContainer = this.$container.find(".layout-maximize-container"), this.layoutFactory = new AVELayout.LayoutFactory(this.layoutTemplate, this.$gridContainer, c), this.dataContexts = this.layoutFactory.create(), this.gridView = new AVELayout.GridView(this.$gridContainer), this.snapView = new AVELayout.SnapView(this.$snapContainer), this.gridView.application = this, this.snapView.application = this, this.canSave = 1 == d || null == d, this.viewChangedCallback = null, this.gridView.show(), this.snapView.hide(), this.currentView = this.gridView, AVELayout.LayoutApplication.appDic[b.selector] = this
    }, this.switchToView = function (a, b) {
        a === this.gridView && null != a ? (this.gridView.show(), this.snapView.hide(), this.currentView = a) : a === this.snapView && null != a && (this.gridView.hide(), this.snapView.show(b), this.currentView = a)
    }, this.refreshLayout = function () {
        e.layoutFactory.onSizeChanged()
    }, this.saveLayout = function () {
        if (this.$container.selector && this.canSave) {
            var a = AVELayout.LayoutApplication.saveCurrentLayout(this);
            AVELayout.LayoutApplication.instanceDic[this.$container.selector] = a
        }
    }, this.miniSize = function (a, b) {
        for (var c = 0; c < a.length; c++)this.layoutFactory.minimizeRow(a[c]);
        for (var c = 0; c < b.length; c++)this.layoutFactory.minimizeCol(b[c])
    }, this.maxiSize = function (a, b) {
        for (var c = 0; c < a.length; c++)this.layoutFactory.maximizeRow(a[c]);
        for (var c = 0; c < b.length; c++)this.layoutFactory.maximizeCol(b[c])
    }, this.close = function () {
        this.layoutFactory.close(), this.snapView.close(), AVELayout.LayoutApplication.appDic[this.$container.selector] = null, delete AVELayout.LayoutApplication.appDic[this.$container.selector]
    }, this.onLayoutItemMaximize = function (a) {
        var b = a.data.dataContext;
        e.switchToView(e.snapView, b), null != e.viewChangedCallback && e.viewChangedCallback(!0)
    }, this.onLayoutItemResize = function (a) {
        var b = a.data.dataContext;
        e.switchToView(e.gridView, b), e.layoutFactory.onSizeChanged(), null != e.viewChangedCallback && e.viewChangedCallback(!1)
    }, this.onLayoutItemClose = function (a) {
        var b = a.data.dataContext;
        b.setView(null, null, null)
    };
    var f = AVELayout.LayoutApplication.instanceDic[b.selector];
    return f ? this._onLoad(f.layoutTemplate) : this._onLoad(a), this
}, AVELayout.LayoutApplication.appDic = {}, AVELayout.LayoutApplication.instanceDic = {}, AVELayout.LayoutApplication.saveCurrentLayout = function (a) {
    if (null == a)return null;
    for (var b = [], c = a.dataContexts.length, d = 0; c > d; d++) {
        var e = a.dataContexts[d], f = new AVELayout.LayoutDetail(e.layout.id, e.viewType, e.viewValue, e.name);
        b.push(f)
    }
    var g = new AVELayout.LayoutStorage(a.layoutTemplate, b);
    return g
}, AVELayout.LayoutApplication.__loadLayoutFromStorage = function (a, b) {
    var c = new AVELayout.LayoutApplication(a.layoutTemplate, b.empty());
    return c
}, AVELayout.LayoutApplication.addSaveLayoutListener = function (a, b, c, d) {
    null != a && a.bind("click", function () {
        var a = AVELayout.LayoutApplication.saveCurrentLayout(AVELayout.LayoutApplication.__currentApplication);
        if (null == a)return void(null != d && d(null, "save error", ""));
        var e = JSON.stringify(a);
        $.ajax({url: b, type: "POST", contentType: "text/json", data: e, success: c, error: d})
    })
}, AVELayout.LayoutApplication.removeSaveLayoutListener = function (a) {
    a.unbind("click")
}, AVELayout.LayoutApplication.addLoadLayoutListener = function (a, b, c, d, e) {
    null != a && null != c && a.unbind().bind("click", function () {
        $.ajax({
            url: c, type: "Get", dataType: "json", success: function (a) {
                var c = AVELayout.LayoutApplication.__loadLayoutFromStorage(a, b);
                null != d && d(a, c)
            }, error: e
        })
    })
}, AVELayout.LayoutApplication.removeLoadLayoutListener = function (a) {
    a.unbind("click")
}, !function () {
    "undefined" != typeof $ && "undefined" != typeof jQuery && (AVELayout.SizeChangedEvent.createEvent(), window.onbeforeunload = function () {
        for (var a in AVELayout.LayoutApplication.appDic) {
            var b = AVELayout.LayoutApplication.appDic[a];
            b.saveLayout()
        }
        var c = JSON.stringify(AVELayout.LayoutApplication.instanceDic);
        "{}" !== c && localStorage.setItem("avelayout", c)
    }, $(function () {
        var a = localStorage.getItem("avelayout");
        try {
            var b = JSON.parse(a);
            null != b ? AVELayout.LayoutApplication.instanceDic = b : AVELayout.LayoutApplication.instanceDic = {}
        } catch (c) {
            console.log(c), AVELayout.LayoutApplication.instanceDic = {}
        }
    }))
}();