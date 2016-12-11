var host="http://123.206.100.98:16120";


// header添加事件
(function () {
    //获取登录信息可能不需要
    /*$.ajax({
     method: "post",
     url: host+"/customer/isLogin",
     xhrFields: {
     withCredentials: true
     },
     dataType: "json"
     }).done(function (result) {
     if(result.status==200){
     var userInfo = result.userInformation[0];
     var quickMenu = $("#quickMenu");
     quickMenu.find(".accountOperate").toggleClass("active");
     quickMenu.find(".my-cart .count").text(userInfo.cartNum);
     }
     }).fail(function (result) {
     console.log(result.statusText);
     result = {
     status: 200,
     userInformation: [{
     name: "gdh",
     cartNum: 33
     }]
     };
     if(result.status==200){
     var userInfo = result.userInformation[0];
     var quickMenu = $("#quickMenu");
     quickMenu.find(".accountOperate").toggleClass("active");
     quickMenu.find(".my-cart .count").text(userInfo.cartNum);
     }
     });*/

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
            method: "post",
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

function createSImageList(imgArray){
    var sImage = "<li class='sImage active'><img src='"+imgArray[0]+"'></li>",
        len = imgArray.length;
    for(var i=1; i<len; i++){
        sImage += "<li class='sImage'><img src='"+imgArray[i]+"'></li>";
    }
    return $(sImage);
}

(function(){
    $.ajax({
        method: "get",
        url: host+"/",
        xhrFields: {
            withCredentials: true
        }
    }).done(function (result) {

    }).fail(function (result) {
        result = {
            data: [
                {
                    shopId: 234,
                    shopName: "Aokin Official Factory Store",
                    productId: 45,
                    productName: "UPSIZE 3D PUZZLE ANIMALS 3D PUZZLE - WILD LIFE",
                    price: 199.00,
                    stock: 50,
                    productImage: [
                        "imgs/product01a.jpg",
                        "imgs/product02a.jpg",
                        "imgs/product03a.jpg",
                        "imgs/product04a.jpg"
                    ],
                    reviews: []
                }
            ]
        };
        var $productForm = $("#productForm");
        var data = result.data[0];
        $(".shopValue").text(data.shopName)
            .attr("href", "store.html?shopId="+encodeURIComponent(""+data.shopId));
        $productForm
            .data("info", data)
            .find(".productName").text(data.productName)
            .end()
            .find(".priceSpan").text(""+data.price)
            .end()
            .find(".stockSpan").text(data.stock)
            .end()
            .find(".stock").val(data.stock)
            .end()
            .find(".bigImage img").attr("src", data.productImage[0])
            .end()
            .find(".smallImages").append(createSImageList(data.productImage));

    });
}());

var $productForm = $("#productForm");

$productForm.on("click", ".sImage", function(){
    var _this = $(this);
    if(!_this.hasClass("active")){
        _this.addClass("active")
            .siblings()
            .removeClass("active")
            .parent()
            .siblings(".bigImage")
            .find("img")
            .attr("src", _this.find("img").attr("src"));
    }
});

$productForm.on("input", ".quantityOp .num", function (e) {
    var val = this.value;
    var _this = $(this);
    for(var i=val.length-1; i>=0; i--){
        var char = val.charAt(i);
        if(!(char>="0"&&char<="9")){
            val = val.substr(0, i)+val.substr(i+1);
        }
    }
    val = val.replace(/^0$/, function () {
        return "1";
    });
    this.value = val;
    checkState(_this);
});

function checkState($num){
    var $minus = $num.siblings(".minus"),
        val = $num.val();
    if(parseInt(val)>=2){
        $minus.removeClass("disabled");
    } else {
        $minus.addClass("disabled");
    }
    var $plus = $num.siblings(".plus"),
        $stock = $num.siblings(".stock");
    if(parseInt(val)>=parseInt($stock.val())){
        $plus.addClass("disabled");
        $num.val($stock.val());
    } else {
        $plus.removeClass("disabled");
    }
}

$productForm.on("blur", ".quantityOp .num", function (e) {
    var val = this.value;
    if(val==="")
    this.value = "1";
});

$productForm.on("click", ".quantityOp .minus", function (e) {
    var _this = $(this);
    var $num = _this.siblings(".num");
    if(!_this.hasClass("disabled")){
        $num.val($num.val()-1);
    }
    checkState($num);
});

$productForm.on("click", ".quantityOp .plus", function (e) {
    var _this = $(this);
    var $num = _this.siblings(".num");
    if(!_this.hasClass("disabled")){
        $num.val(parseInt($num.val())+1);
    }
    checkState($num);
});