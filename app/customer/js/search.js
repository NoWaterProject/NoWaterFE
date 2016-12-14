var host="http://123.206.100.98:16120";
var value = "Results for ";
var keyWord = GetQueryString("keyWord");
if (!keyWord) {
    keyWord = "test";
}

$("#noResult").hide();
$("#showMoreButton").click(getResult);

$(document).ready(function() {
    setText();
    $("#showMoreButton").hide();
    getResult();
});

// header添加事件
(function () {
    //headMenu添加事件
    var $headMenu = $("#headMenu");
    var navTimer;
    $headMenu.on("mouseover", function () {
        if (navTimer) clearTimeout(navTimer);
        $(this).find(".menuList").show();
    });
    $headMenu.on("mouseout", function () {
        var _this = $(this);
        navTimer = setTimeout(function () {
            _this.find(".menuList").hide();
        }, 400);
    });
    $headMenu.on("click", ".menuList li", function () {
        var pt = $(this).data("pt");
        location.href = "search.html?pt=" + pt;
    });
    $headMenu = null;

    //header随浏览器滚动而滚动
    $(window).on("scroll", function(){
        var header = $("header"),
            _this = $(this);
        header.css("left", -_this.scrollLeft());
    });

    function delCookie(name){
        var t = new Date();
        t.setTime(t.getTime()-1);
        document.cookie= name + "=null;path=/;expires="+t.toGMTString();
    }

    var quickMenu = $("#quickMenu");

    quickMenu.on("click", ".logout", function () {
        var _this = $(this);
        $.ajax({
            type: "post",
            url: host+"/customer/loginout",
            xhrFields: {
                withCredentials: true
            }
        }).done(function(){
            delCookie("token");
            location.reload();
        }).fail(function () {
            delCookie("token");
            location.reload();
        });
    });

    var $searchForm = $("#searchForm");
    $searchForm.on("submit", function(e){
        if (e && e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        var keyWord = this.keyWord.value;
        if(keyWord!=""){
            location.href = "search.html?keyWord="+ encodeURIComponent(keyWord);
        }
    });
    $searchForm.on("click", ".searchBtn", function(e){
        $searchForm.trigger("submit");
    });
})();

function getResult(shopId) {
    var shopId = arguments[1] ? arguments[1] : null;
    var startId = 0;
    if (!shopId) {
        shopId = 0;
    }
    var $adGoods = $("#adGoods");
    var count = 40;
    var sendData = "keyWord=" + keyWord + "&count=" + count +"&shopId=" + shopId + "&startId=" + startId;

    $.ajax({
        type: "post",
        url: host+"/customer/product/search",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        data: sendData
    }).done(function (result) {
        if(result.status==200){
            startId = result.startId;
            if (result.actualCount == 0) {
                $("#noResult").show();
                $("#adGoods").hide();
                return;
            }
            for(var i=0; i<result.data.length; i++){
                var goodItem = createGoodsItem(result.data[i]);
                $adGoods.append(goodItem);
            }
            if(startId != -1) {
                $("#showMoreButton").show();
            } else {
                $("#showMoreButton").hide();
            }
        }
        $adGoods = null;
    })
        .fail(function(result){
            result = {
                status: 200,
                actualCount: 10,
                data: [
                    {
                        product_id: 1,
                        shop_id: 1,
                        class_id: 1,
                        product_name: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        is_del: false
                    },
                    {
                        product_id: 2,
                        shop_id: 1,
                        class_id: 1,
                        product_name: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        is_del: false
                    },
                    {
                        product_id: 3,
                        shop_id: 1,
                        class_id: 1,
                        product_name: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        is_del: false
                    },
                    {
                        product_id: 4,
                        shop_id: 1,
                        class_id: 1,
                        product_name: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        is_del: false
                    },
                    {
                        product_id: 5,
                        shop_id: 1,
                        class_id: 1,
                        product_name: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        is_del: false
                    },
                    {
                        product_id: 6,
                        shop_id: 1,
                        class_id: 1,
                        product_name: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        is_del: false
                    },
                    {
                        product_id: 7,
                        shop_id: 1,
                        class_id: 1,
                        product_name: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        is_del: false
                    },
                    {
                        product_id: 8,
                        shop_id: 1,
                        class_id: 1,
                        product_name: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        is_del: false
                    },
                    {
                        product_id: 9,
                        shop_id: 1,
                        class_id: 1,
                        product_name: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        is_del: false
                    },
                    {
                        product_id: 10,
                        shop_id: 1,
                        class_id: 1,
                        product_name: "MOOGOO MILK SHAMPOO - SCALP FRIENDLY",
                        price: "998.00",
                        quantityStock: 11,
                        photo: ["imgs/product02a.jpg"],
                        is_del: false
                    }
                ],
                startId: -1
            };
            if(result.status==200){
                startId = result.startId;
                if (result.actualCount == 0) {
                    $("#noResult").show();
                    $("#adGoods").hide();
                    return;
                }
                for(var i=0; i<result.data.length; i++){
                    var goodItem = createGoodsItem(result.data[i]);
                    $adGoods.append(goodItem);
                }
                if(startId != -1) {
                    $("#showMoreButton").show();
                } else {
                    $("#showMoreButton").hide();
                }
            }
            $adGoods = null;
        });
}

function setText() {
    var pt = GetQueryString("pt");
    if (pt) {
        var productClass = getProductClass(pt);
        $("#tips").text(productClass);
    } else {
        $("#tips").text(value+"\'"+keyWord+"\'");
        $("#keyWord").val(keyWord);
    }

}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return decodeURIComponent(r[2]);
    return null;
}

function getProductClass(pt) {
    switch (pt) {
        case "1":
            return "TV & Home Theater";
        case "2":
            return "Computers & Tablets";
        case "3":
            return "Cell Phones";
        case "4":
            return "Cameras & Camcorders";
        case "5":
            return "Audio";
        case "6":
            return "Car Electronics & GPS";
        case "7":
            return "Video, Games, Movies & Music";
        case "8":
            return "Health, Fitness & Sports";
        case "9":
            return "Home & Office";
    }
}

function createGoodsItem(data) {
    return $('<li class="goods-item"> ' +
        '<div class="item-detail"> ' +
        '<div class="item-image"> ' +
        '<img src="'+data.photo[0]+'"> ' +
        '</div> ' +
        '<div class="item-name"> ' +
        data.product_name +
        '</div> ' +
        '</div> ' +
        '<div class="item-prices"> HK$' +
        data.price +
        '</div> ' +
        '<div class="item-operate"> ' +
        '<div class="add-to-cart"> ' +
        '<i></i><span>ADD TO CART</span> ' +
        '</div> ' +
        '<div class="add-to-favorites"> ' +
        '<i></i><span>ADD TO FAVORITES</span> ' +
        '</div> ' +
        '</div> ' +
        '</li>').data("goodId", data.product_id);
}