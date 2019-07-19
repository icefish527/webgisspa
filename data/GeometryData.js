define(['jquery'],function ($) {

     var values=new Array();
    $.getJSON("data/polygon.json",function (data) {
        values=data;
    });


    return {
        pointData:
            {
                "value": [
                    {
                        "Name": "0001",
                        "Lon": 114.566972,
                        "Lat": 37.978427,
                        "Alt": 0,
                        "Region":"石家庄",
                        "Type": "固定监测站"
                    },
                    {
                        "Name": "0002",
                        "Lon": 114.626575,
                        "Lat": 37.901228,
                        "Alt": 0,
                        "Region":"沧州",
                        "Type": "遥感监测站"
                    }
                    ,
                    {
                        "Name": "0004",
                        "Lon": 114.124051,
                        "Lat": 38.020158,
                        "Alt": 0,
                        "Region":"保定",
                        "Type": "黑烟监测站"
                    },
                    {
                        "Name": "0003",
                        "Lon": 114.385495,
                        "Lat": 38.03858,
                        "Alt": 0,
                        "Region":"雄安",
                        "Type": "移动监测站"
                    }

                ]
            },
        LineData:
            {
                "value": [
                    {
                        "Name": "0001",
                        "Lon": 114.566972,
                        "Lat": 37.978427,
                        "Alt": 0,
                        "Type": "固定监测站"
                    },
                    {
                        "Name": "0002",
                        "Lon": 114.626575,
                        "Lat": 37.901228,
                        "Alt": 0,
                        "Type": "固定监测站"
                    }
                    ,
                    {
                        "Name": "0004",
                        "Lon": 114.124051,
                        "Lat": 38.020158,
                        "Alt": 0,
                        "Type": "固定监测站"
                    },
                    {
                        "Name": "0003",
                        "Lon": 114.385495,
                        "Lat": 38.03858,
                        "Alt": 0,
                        "Type": "固定监测站"
                    }

                ]
            },
        polygonData:
            {
               "value":values
            }

    }

});