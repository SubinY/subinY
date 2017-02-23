/**
 * Created by hasee on 2016/9/20.
 */
'use strict';

window.onload = function () {
    resize();
    window.onresize = throttle(function(){
        resize();

    },300);
    function throttle(fn,delay) {  // 闭包  节流
        var timer = null;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(fn,delay);
        }
    }

    mask();

    changePHONE();

    var more = document.getElementById('more');
    more.onclick = function () {
        var url = 'php/data.php?last=';
        queryList(url);
    };

};


//模拟后台传输数据
var data_skill = [{key:'HTML5',content:'▲熟练使用HTML标签，对HTML标签特性有一定理解。HTML代码符合语义话要求，有一定的可读性。',rate:90,imgSrc:'image/HTML5.png'},
    {key:'CSS3',content:'▲熟练使用CSS属性及选择器，能使用一些CSShack。对模块化和栅格化布局有一定的了解。',rate:80,imgSrc:'image/CSS3.png'},
    {key:'JS',content:'▲熟悉js dom, event,ajax,jsonp能够编写基本的js原生代码',rate:70,imgSrc:'image/JS.png'},
    {key:'API',content:'▲熟悉jquery api和bootstrap api，能够编写最基本的动态交互效果，能用插件来封装日常的开发组件和界面操作',rate:60,imgSrc:'image/API.png'},
    {key:'CANVAS',content:'▲掌握canvas图形绘制，能做一些简单的图形动画',rate:30,imgSrc:'image/canvas.png'},
    {key:'TEST',content:'▲熟练使用视觉设计软件和文本编辑软件，至少能简单使用浏览器开发调试工具',rate:70,imgSrc:'image/test.png'}
];
var data_experience = [
    {text:'职业生涯第一个网站，当时用了3个月自学前后台方面技术及建站的基本操作，做出了这个具有交互功能的订餐网站',imgSrc:'image/experienceimg1.jpg'},
    {text:'初学前端的2个作品，从设计图到完成个人网站，维护到调试再到挂上虚拟服务器',imgSrc:'image/experienceimg2.jpg'}
];

//遮罩层
function mask(){
    var mask = document.getElementById('mask');
    document.body.style.overflow = "hidden";
    slider();
    skill();
    experience();
    setTimeout(function () {
        mask.style.display = 'none';
        document.body.style.overflow = "scroll";
        document.body.style.overflowX = "hidden";

    },4000);
    //创建舞台
    var stage = new Konva.Stage({
        container: 'mask',
        width: window.innerWidth,//全屏
        height: window.innerHeight
    });

    //创建层
    var layer = new Konva.Layer();
    stage.add(layer);

    //中心点坐标
    var cenX = stage.width() / 2;
    var cenY = stage.height() / 2;

    var data = [
        { name: "读取中", value: 1, color: 'lightgreen'  }
    ];

    var p = new PieChart({
        x: cenX,
        y: cenY,
        r: 100,
        data: data
    });

    p.addToGroupOrLayer( layer );
    layer.draw();
    p.playAnimate();

}
//轮播图组件
//轮播图
function slider(){
    var slider_all = document.getElementById('slider');
    var slider = document.getElementById('slider_img');
    var slider_imgs = slider.children;
    var imgs_length = slider_imgs.length;
    var iNow = 0;
    var timer = null;

    //获取文字层
    var textContent = document.getElementById('textContent');
    var textul = textContent.children[0];
    var textlis = textul.children;

    slider_imgs[0].style.zIndex = 1;

    //动态创建小圆标签
    var slider_circle = document.getElementById('slider_circle');
    var slider_circle_lis = slider_circle.children;

    for( var i = 0; i < imgs_length; i++){
        var newlis = document.createElement('li');
        slider_circle.appendChild(newlis);
    }
    slider_circle_lis[0].setAttribute('class','active');

    //左右连个按钮
    var slider_prev = document.getElementById('prev');
    var slider_next = document.getElementById('next');

    slider_prev.onclick = function () {
        for( var i = 0; i < imgs_length; i++){
            animate(slider_imgs[i],{opacity:0});
            animate(textlis[i],{opacity:0});
        }
        --iNow < 0 ?  iNow = imgs_length - 1 : iNow;
        animate(slider_imgs[iNow],{opacity:100});
        animate(textlis[iNow],{opacity:100});
        setSquare();
    };
    slider_next.onclick = function () {
        autoplay();
    };
    //小按钮控制
    for( var i = 0; i < imgs_length; i++){
        slider_circle_lis[i].index = i;
        slider_circle_lis[i].onclick = function(){
            for( var j = 0; j < imgs_length; j++){
                slider_circle_lis[j].removeAttribute('class');
                animate(slider_imgs[j],{opacity:0});
                animate(textlis[j],{opacity:0});
            }
            animate(slider_imgs[this.index],{opacity:100});
            animate(textlis[this.index],{opacity:100});
            this.setAttribute('class','active');
            iNow = this.index;
        };
    }
    //自动轮播
    timer = setInterval(autoplay,4000);
    //触摸停止轮播
    slider_all.onmouseover = function () {
        clearInterval(timer);
    };
    //离开继续轮播
    slider_all.onmouseout = function () {
        clearInterval(timer);
        timer = setInterval(autoplay,4000);
    };

    //自动轮播函数
    function autoplay(){
        for( var i = 0; i < imgs_length; i++){
            animate(slider_imgs[i],{opacity:0});
            animate(textlis[i],{opacity:0});
        }
        ++iNow > imgs_length - 1 ? iNow = 0 : iNow;
        animate(slider_imgs[iNow],{opacity:100});
        animate(textlis[iNow],{opacity:100});
        setSquare();
    }

    //控制播放span的函数
    function setSquare() {
        for(var i=0;i<imgs_length;i++){
            slider_circle_lis[i].className = "";
        }
        slider_circle_lis[iNow].className = "active";  // 记住 + 1
    }

    //屏幕触摸左右滑动
    // 获取界面上的轮播图容器
    var $slider_all = $('#slider');
    var $slider_prev = $('#prev');
    var $slider_next = $('#next');
    var startX, endX;
    var offset = 50;
    if( $(document).innerWidth() < 650){
        //隐藏左右按钮
        $slider_prev.css('display','none');
        $slider_next.css('display','none');

        $slider_all.on('touchstart', function(e) {
            // 手指触摸开始时记录一下手指所在的坐标X
            clearInterval(timer);
            startX = e.originalEvent.touches[0].clientX;
        });

        $slider_all.on('touchmove', function(e) {
            endX = e.originalEvent.touches[0].clientX;
        });
        $slider_all.on('touchend', function(e) {
            // 获取每次运动的距离，当距离大于一定值时认为是有方向变化
            var distance = Math.abs(startX - endX);
            if (distance > offset) {
                startX > endX ? $slider_next.click() : $slider_prev.click();
            }
        });
    }
}
//轮播图自适应大小函数
function resize(){
    var slider_all = document.getElementById('slider');
    var slider = document.getElementById('slider_img');
    var slider_imgs = slider.children;

    //判断屏幕宽度是否小于800
    var windowWidth = window.innerWidth;

    var isSmallScreen = windowWidth < 800;
    //更换图片大小
    for( var i = 0; i < slider_imgs.length; i++){
        var imgSrc = isSmallScreen ? slider_imgs[i].getAttribute('data-image-xs') : slider_imgs[i].getAttribute('data-image-lg');
        slider_imgs[i].style.backgroundImage = 'url("'+imgSrc+'")';

        if(isSmallScreen){
            slider_all.style.height = 17 / 32 * window.innerWidth - 9 + 'px';
            slider_imgs[i].innerHTML = '';
            slider_imgs[i].style.backgroundImage = '';
            var newImg = document.createElement('img');
            newImg.src = imgSrc;

            slider_imgs[i].appendChild(newImg);

        }else {
            slider_all.style.height = 460 + 'px';
            slider_imgs[i].innerHTML = '';
        }
    }





}
//技能接口
function skill(){
    for( var i = 0; i < data_skill.length; i++){
        var skill = new Skill(data_skill[i]);
        skill.bindBasic();

    }
    var skill_panel = document.querySelectorAll('.skill-panel');
    var aas = document.querySelectorAll('.skill-panel > a');

    for( var j = 0; j < skill_panel.length; j++){
        skill_panel[j].index = j;
        //触碰面板出现图片
        skill_panel[j].onmouseenter = function (event) {
            var hidden_img = aas[this.index].children[1];
            var img = hidden_img.children;
            animate(img[0],{height:130});
        };
        //离开面板移除图片
        skill_panel[j].onmouseleave = function () {
            var hidden_img = aas[this.index].children[1];
            var img = hidden_img.children;
            animate(img[0],{height:0});
        }
    }
}
//经验接口
function experience(){
    //获取左
    var content_left = document.getElementById('content_left');
    var left_span = content_left.children[0];
    var left_span_i = left_span.children;
    //获取中
    var ul = document.getElementById('content_center_ul');
    var aas = ul.children;
    //获取右
    var content_right = document.getElementById('content_right');
    var divs = content_right.children;


    for( var i = 0; i < aas.length; i++){
        aas[i].index = i;
        var sample = new Sample(data_experience[i].text,data_experience[i].imgSrc);
        sample.bindBasic();
        sample.bindMask();

        aas[i].onclick = function () {
            for( var j = 0;j < aas.length; j++){
                left_span_i[j].className = ' ';
                aas[j].className = ' ';
                divs[j].className = ' ';
            }
            this.className = 'active';
            divs[this.index].className = 'active';
            left_span_i[this.index].className = 'active';

        };
        divs[0].className = 'active';
        left_span_i[0].className = 'active';
    }


    var img = document.querySelectorAll('#content_right > div > img');
    var img_mask = document.getElementById('img_mask');
    var img_wrap = img_mask.children;


    for( var j = 0; j < aas.length; j++){
        img[j].index = j;
        img[j].onclick = function () {
            for( var i = 0; i < aas.length; i++){
                img_wrap[i].style.display = 'none';
            }
            img_wrap[this.index].style.display = 'block';
        };

        img_wrap[j].onclick = function () {
            this.style.display = 'none';
        };
    }
}
//PC和PHONE切换
function changePHONE(){
    var header = document.getElementById('header'),
        slider = document.getElementById('slider'),
        skill = document.getElementById('skill'),
        experience = document.getElementById('experience'),
        footer = document.getElementById('footer'),
        iframe_pad = document.getElementById('iframe_pad'),
        iframe_phone = document.getElementById('iframe_phone');

    //获取手机按钮
    var preview_pc = document.getElementById('preview_pc'),
        preview_pad = document.getElementById('preview_pad'),
        preview_phone = document.getElementById('preview_phone');

    preview_phone.onclick = function () {
        header.style.display = 'none';
        slider.style.display = 'none';
        skill.style.display = 'none';
        experience.style.display = 'none';
        footer.style.display = 'none';
        iframe_pad.style.display = 'none';

        iframe_phone.style.display = 'block';
    };
    preview_pc.onclick = function () {
        iframe_phone.style.display = 'none';
        iframe_pad.style.display = 'none';

        header.style.display = 'block';
        slider.style.display = 'block';
        skill.style.display = 'block';
        experience.style.display = 'block';
        footer.style.display = 'block';
    };
    preview_pad.onclick = function () {
        header.style.display = 'none';
        slider.style.display = 'none';
        skill.style.display = 'none';
        experience.style.display = 'none';
        footer.style.display = 'none';
        iframe_phone.style.display = 'none';

        iframe_pad.style.display = 'block';
    }
}