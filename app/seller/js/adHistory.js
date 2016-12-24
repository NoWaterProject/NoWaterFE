// header添加事件
(function () {
    function delCookie(name){
        var t = new Date();
        t.setTime(t.getTime()-1);
        document.cookie= name + "=null;path=/;expires="+t.toGMTString();
    }

    var quickMenu = $("#quickMenu");

    quickMenu.on("click", ".logout", function () {
        var _this = $(this);
        $.ajax({
            method: "post",
            url: "/proxy/customer/loginout"
        }).done(function(){
            delCookie("token");
            location.href = "../customer/index.html"
        }).fail(function () {
            delCookie("token");
            location.href = "../customer/index.html"
        });
    });
})();


function showLoading($relative) {
    var $tips = $relative.siblings(".loadingImg");
    if ($tips.length > 0) $tips.remove();
    $tips = $("<div class='loadingImg'></div>");
    if($relative.css("position")=="static") $relative.css('position', "relative");
    $tips.appendTo($relative)
        .ready(function () {
            $tips.css({
                "top": $relative.outerHeight() / 2,
                "left": $relative.outerWidth() / 2,
                "margin-left": -$tips.outerWidth() / 2,
                "margin-top": -$tips.outerHeight() / 2,
                "visibility": "visible"
            });
        });
    return $tips;
}

function tipsAlert(msg, callback){
    var $alert = $(".tipsAlert");
    if ($alert.length > 0) $alert.remove();
    $alert = $("<div class='tipsAlert'></div>");
    var $shadow = $("<div class='shadow'></div>");
    var $content = $("<div class='content'></div>");
    var $msg = $("<div class='msg'>"+ msg +"</div>");
    var $btn = $("<div class='btn'>OK</div>");
    $btn.on("click", function () {
        $(this).parents(".tipsAlert").remove();
        if(callback) callback();
    });
    $content.append($msg).append($btn);
    $alert.append($shadow);
    $alert.append($content);
    $alert.appendTo($("body"));
}

function tipsConfirm(msg, callback){
    var $confirm = $(".tipsConfirm");
    if ($confirm.length > 0) $confirm.remove();
    $confirm = $("<div class='tipsConfirm'></div>");
    var $shadow = $("<div class='shadow'></div>");
    var $content = $("<div class='content'></div>");
    var $msg = $("<div class='msg'>"+ msg +"</div>");
    var $btn = $('<div class="btn2"> ' +
        '<div class="cancel">Cancel</div> ' +
        '<div class="ok">Ok</div> </div>');

    $btn.on("click", ".cancel", function () {
        $(this).parents(".tipsConfirm").remove();
    });
    $btn.on("click", ".ok", function () {
        $(this).parents(".tipsConfirm").remove();
        if(callback) callback();
    });
    $content.append($msg).append($btn);
    $confirm.append($shadow)
        .append($content)
        .appendTo($("body"));
}

function showSpinner(msg, config){
    var $spinner = $(".spinner");
    if($spinner) $spinner.remove();
    $spinner = $('<div class="spinner"> ' +
        '<div class="tips"> ' +
        msg +
        '</div> ' +
        '</div>');
    var def = {
        timeout: 1500
    };
    $.extend(def, config);
    $spinner.appendTo($("body"))
        .ready(function () {
            $spinner.css({
                "margin-left": -$spinner.width() / 2,
                "margin-top": -$spinner.width() / 2,
                "visibility": "visible"
            });
        });
    setTimeout(function(){
        if($spinner) $spinner.remove();
        var callback = def.callback;
        if(callback) callback();
    }, def.timeout);
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return r[2]; return null; //返回参数值
}

var loginUrl = "../customer/login.html?redirectUrl="+encodeURIComponent(location.href);

function　createShowItem(data){
    var pendingPay = '<div class="timeTips">' +
        data.countdown +
        '</div>' +
        '<div class="payNow">' +
        'Pay now' +
        '</div> ' +
        '<div class="cancel">' +
        'Cancel order' +
        '</div> ';

    var operate = "";
    if(data.status==1){
        data.statusText = "Waiting for payment";
        operate  = pendingPay;
    } else if(data.status==2){
        data.statusText = "Waiting for delivery";
    } else if(data.status==3){
        data.statusText = "Waiting for receiving";
    } else if(data.status==4){
        data.statusText = "Waiting for comment";
    } else if(data.status==5){
        data.statusText = "Completed";
    } else if(data.status==10){
        data.statusText = "Closed";
    }
    var shop = data.shop;
    return $('<tbody class="showItem"> ' +
        '<tr class="mr20"></tr> ' +
        '<tr class="showHeader"> ' +
            '<td colspan="6">' +
                '<span class="showTime">'+data.time+'</span> ' +
                '<span class="showId">Bid ID: '+data.orderId+'</span> ' +
                '<span class="shopName"> ' +
                    '<a href="../customer/store.html?'+shop.shopId+'" target="_blank">'+shop.shopName+'</a> ' +
                '</span>' +
            '</td> ' +
        '</tr> ' +
        '<tr class="showData"> ' +
            '<td class="product"> ' +
                '<a href="'+data.photo[0]+'" target="_blank" class="pictureLink"> ' +
                    '<img src="'+data.photo[0]+'"> ' +
                '</a> ' +
            '</td> ' +
            '<td class="price">HK$'+data.price.toFixed(2)+'</td> ' +
            '<td class="displayTimee">'+data.displayTime+'</td> ' +
            '<td class="status"> ' +
                '<div class="showStatus">'+data.statusText+'</div> ' +
            '</td> ' +
            '<td class="operate"> ' +
                operate +
            '</td> ' +
        '</tr> ' +
        '</tbody>').data("bidId", data.bidId);
}

var postShow = (function(){
    var loading = null;
    return function (showStatus) {
        if(loading) return ;
        loading = showLoading($(".more"));
        var reqData = "status="+showStatus;
        $.ajax({
            method: "get",
            url: "/proxy/shop-owner/show/list",
            dataType: "json",
            data: reqData
        }).done(function(result){
            if(loading){
                loading.remove();
                loading = null;
            }
            var status = result.status;
            if(status==200){
                var len = result.data.length,
                    $showTable = $showList.find('.showTable');
                for(var i=0; i<len; i++){
                    if(showStatus!=0) { result.data[i].status=showStatus }
                    $showTable.append(createShowItem(result.data[i]));
                }
            } else if(status==300) {
                location.href = loginUrl;
            } else {
                tipsAlert("server error!");
            }
        }).fail(function(result){
            if(loading){
                loading.remove();
                loading = null;
            }
            //tipsAlert("server error!");
            result = {
                status: 200,
                data: [
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        targetId: 12,
                        status: 1,
                        countdown: "left 23 Hour",
                        shop: {
                            shopId: 2,
                            shopName: "Tom's shop"
                        },
                        photo: [
                          "../customer/imgs/adshop01.jpg"
                        ],
                        price: 333,
                        displayTime: "2016-09-06"
                    },
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        targetId: 12,
                        status: 2,
                        countdown: "left 23 Hour",
                        shop: {
                            shopId: 2,
                            shopName: "Tom's shop"
                        },
                        photo: [
                          "../customer/imgs/adshop01.jpg"
                        ],
                        price: 333,
                        displayTime: "2016-09-06"
                    },
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        targetId: 12,
                        status: 3,
                        countdown: "left 23 Hour",
                        shop: {
                            shopId: 2,
                            shopName: "Tom's shop"
                        },
                        photo: [
                          "../customer/imgs/adshop01.jpg"
                        ],
                        price: 333,
                        displayTime: "2016-09-06"
                    },
                    {
                        time: "2016-09-05 16:30:06",
                        orderId: "2662774641999118",
                        targetId: 12,
                        status: 4,
                        countdown: "left 23 Hour",
                        shop: {
                            shopId: 2,
                            shopName: "Tom's shop"
                        },
                        photo: [
                          "../customer/imgs/adshop01.jpg"
                        ],
                        price: 333,
                        displayTime: "2016-09-06"
                    }
                ]
            };
            var status = result.status;
            if (status == 200) {
                var len = result.data.length,
                    $showTable = $showList.find('.showTable');
                for (var i = 0; i < len; i++) {
                    if (showStatus != 0) {
                        result.data[i].status = showStatus
                    }
                    $showTable.append(createShowItem(result.data[i]));
                }
            } else if (status == 300) {
                location.href = loginUrl;
            } else {
                tipsAlert("server error!");
            }
        });
    };
})();

var $showList = $("#showList");

$showList.on("click", ".more .showMore", function(e){
    var _this = $(this);
    _this.addClass("hidden");
    postShow(showStatus);
});

$showList.on("click", ".showItem .alreadyDelivered", function(){
    var _this = $(this),
        $showItem = _this.parents(".showItem"),
        $deliverPop = $(".deliverPop"),
        $deliverForm = $("#deliverForm"),
        info = $showItem.data("info");
    $deliverForm[0].showId.value = info.showId;
    $deliverPop.show();
});

var $showMain = $("#showMain");
$showMain.on("click", ".showTab", function () {
    var _this = $(this);
    var i =_this.index();
    location.href = "adHistory.html?status="+i;
});

var showStatus = getUrlParam("status");

if(!!showStatus){
    showStatus = parseInt(showStatus);
    if(!showStatus || showStatus<=-1||showStatus>=5) showStatus = 0;
} else {
    showStatus = 0;
}

$showMain.find(".showTab")
    .eq(showStatus)
    .addClass("active");

postShow(showStatus);

var $deliverForm = $("#deliverForm");

//输入错误提示
function addError(item, msg){
    item.addClass("error")
        .find("input")
        .focus()
        .end()
        .find(".tips")
        .text(msg);
}

function deliverProduct(_this, loading){
    $.ajax({
        method: "post",
        url: "/proxy/shop-owner/show/delivery",
        dataType: "json",
        data: _this.serialize()
    }).done(function (result) {
        if (loading) loading.remove();
        _this.data("submit", false);
        var status = result.status;
        if(status == 200){
            showSpinner("Success", {
                callback: function(){
                    location.reload();
                }
            });
        } else if(status == 300) {
            location.href = loginUrl;
        } else {
            tipsAlert("server error!");
        }
    }).fail(function () {
        if (loading) loading.remove();
        _this.data("submit", false);
        tipsAlert("server error");
    });
}

$deliverForm.on("submit", function (e) {
    var _this = $(this);
    e.preventDefault();
    var $express = _this.find(".express"),
        $expressNo = _this.find(".expressCode");
    if (!this.express.value) {
        addError($express, "Express can't be empty!");
        return;
    }
    if (!this.expressCode.value) {
        addError($expressNo, "Express No can't be empty!");
        return;
    }
    if(_this.data("submit")) return ;
    _this.data("submit", true);
    var loading = showLoading(_this);
    deliverProduct(_this, loading);
});

$deliverForm.on("input", ".input-item input", function () {
    var _this = $(this);
    _this.parent().removeClass('error');
});

$deliverForm.on("click", ".cancel", function (e) {
    var $delegateTarget = $(e.delegateTarget);
    $delegateTarget[0].reset();
    $delegateTarget.parent()
        .hide();
});