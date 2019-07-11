/**
 * Created by peng on 2015/9/12.
 */
define([], function () {

    var randomNodeSvgCategory = function () {
        var result = '0';
        var index = Math.random() * 15;
        index = Math.floor(index);
        switch (index) {
            case 1:
                result = '1';
                break;
            case 2:
                result = '2';
                break;
            case 3:
                result = 'NII_1';
                break;
            case 4:
                result = 'NII_2';
                break;
            case 5:
                result = 'NII_3';
                break;
            case 6:
                result = 'NII_4';
                break;
            case 7:
                result = 'NII_5';
                break;
            case 8:
                result = 'CBN_1_1';
                break;
            case 9:
                result = 'CBN_1_2';
                break;
            case 10:
                result = 'CBN_1_3';
                break;
            case 11:
                result = 'CBN_1_4';
                break;
            case 12:
                result = 'CBN_1_5';
                break;
            case 13:
                result = 'CBN_3_3';
                break;
            case 14:
                result = 'CBN_3_4';
                break;
        }
        return result;
    };

    this.Node = function (data) {
        this.id = data.t_id;
        this.idShow = data.id_show;
        this.title = data.title;
        this.alias = data.alias;
        this.area = data.area;
        this.enname = data.enname;
        this.location = data.location;
        this.countryImage = 'http://10.1.0.127/nvs_public/Public/Home/icons/flags/' + this.enname + '.png';
        this.longitude = data.longitude;
        this.latitude = data.latitude;
        this.category = data.category;
        this.cateicon = 'http://10.1.0.127/nvs_public/Public/Home/icons/' + data.cateicon + '.png';
        this.tLevel = data.t_level;
        this.tLevelID = data.t_level_id;
        this.tLevelInfo = data.t_level_info;
        this.tDescription = data.t_description;
        this.image = data.image;
        this.keywords = data.keywords;
        this.attachements = data.attachments;
        this.infoSource = data.info_source;
        this.classiLevel = data.classi_level;
        this.updateTime = data.update_time;
        this.time = data.c_time;
        this.cLevel = data.c_level;
        this.cLevelID = data.c_level_id;
        this.status = data.c_status;
        this.unit = data.c_unit;
        this.staff = data.c_staff;
        this.contact = data.c_contact;
        this.nDescription = data.n_description;
        this.domain = data.n_domain;
        this.ipv4 = data.n_ipv4;
        this.ipv6 = data.n_ipv6;
        this.struct = data.n_struct;
        this.relations = data.relations;
        this.info = data.s_info;
        this.recordINputTime = data.record_input_time;
        this.effect = data.a_effect;
        this.imagePath = 'http://10.1.0.127/nvs_public/Uploads' + data.imagepath;
        this.defaultImage = 'http://10.1.0.127/nvs_public/Uploads/default_image/nopic.jpg';
        this.svgicon = data.catesvgcode;
    };

    this.NodeSum = function (groupItem) {
        this.country = groupItem.value;
        this.image = groupItem.items[0].countryImage;
        this.count = groupItem.items.length;
    };

    this.Filter = function (name, values) {
        this.action = 'filter';
        this.name = name;
        this.type = 'checkbox-group-filter';

        var conditions = [];
        for (var i = 0; i < values.length; i++) {
            conditions.push('.' + values[i]);
        }

        this.data = {
            'filterType': 'pathGroup',
            'pathGroup': conditions
        };

        this.inAnimation = 'true';
        this.inDeepLinking = 'true';
        this.inStorage = 'true';
        this.isAnimateToTop = 'true';
    };

    return this;
});