/**
 * Created by hasee on 2016/9/21.
 */
'use strict';
//封装运动函数
function animate(obj,json,fn) {  // 给谁    json
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        var flag = true;  // 用来判断是否停止定时器   一定写到遍历的外面
        for(var attr in json){   // attr  属性     json[attr]  值
            //开始遍历 json
            // 计算步长    用 target 位置 减去当前的位置  除以 10
            // console.log(attr);
            var current = 0;
            if(attr == "opacity")
            {
                current = Math.round(parseInt(getStyle(obj,attr)*100)) || 0;
            }
            else
            {
                current = parseInt(getStyle(obj,attr)); // 数值
            }
            // console.log(current);
            // 目标位置就是  属性值
            var step = ( json[attr] - current) / 10;  // 步长  用目标位置 - 现在的位置 / 10
            step = step > 0 ? Math.ceil(step) : Math.floor(step);
            //判断透明度
            if(attr == "opacity")  // 判断用户有没有输入 opacity
            {
                if("opacity" in obj.style)  // 判断 我们浏览器是否支持opacity
                {
                    // obj.style.opacity
                    obj.style.opacity = (current + step) /100;
                }
                else
                {  // obj.style.filter = alpha(opacity = 30)
                    obj.style.filter = "alpha(opacity = "+(current + step)* 10+")";

                }
            }
            else if(attr == "zIndex")
            {
                obj.style.zIndex = json[attr];
            }
            else
            {
                obj.style[attr] = current  + step + "px" ;
            }

            if(current != json[attr])  // 只要其中一个不满足条件 就不应该停止定时器  这句一定遍历里面
            {
                flag =  false;
            }
        }
        if(flag)  // 用于判断定时器的条件
        {
            clearInterval(obj.timer);
            //alert("ok了");
            if(fn)   // 很简单   当定时器停止了。 动画就结束了  如果有回调，就应该执行回调
            {
                fn(); // 函数名 +  （）  调用函数  执行函数 暂且这样替代
            }
        }
    },30)
}
//获取属性函数
function getStyle(obj,attr) {  //  谁的      那个属性
    if(obj.currentStyle)  // ie 等
    {
        return obj.currentStyle[attr];  // 返回传递过来的某个属性
    }
    else
    {
        return window.getComputedStyle(obj,null)[attr];  // w3c 浏览器
    }
}
//获取类函数
function getClass(classname){
    //判断支持否
    if(document.getElementsByClassName)
    {
        return document.getElementsByClassName(classname);
    }
    var arr = []; //用于返回 数组
    var dom = document.getElementsByTagName("*");
    for(var i=0;i<dom.length;i++)  // 遍历所有的 盒子
    {
        var txtarr = dom[i].className.split(" "); // 分割类名 并且 转换为数组
        //  ["demo","test"];
        for(var j=0;j<txtarr.length;j++)  // 遍历 通过类名分割的数组
        {
            if(txtarr[j] == classname)
            {
                arr.push(dom[i]); // 我们要的是 div
            }
        }
    }
    return arr;
}

//技能区域函数封装
function Skill(option){
    this.key = option.key;
    this.content = option.content;
    this.rate = option.rate;
    this.imgSrc = option.imgSrc;
}
Skill.prototype = {
    bindBasic : function () {
        var str = '';
        str+='<div class="skill-panel round">';
            str+='<a href="javascript:;">';
                str+='<div class="html">';
                    str+='<div class="left-circle-wrap">';
                        str+='<div class="left-circle">';
                            str+='<span>'+this.key+'</span>';
                        str+='</div>';
                    str+='</div>';
                    str+='<div class="content">';
                        str+='<span>'+this.content+'</span>';
                    str+='</div>';
                    str+='<div class="progress-bar blue stripes">';
                        str+='<span style="height: '+this.rate+'%">'+this.rate+'%</span>';
                        str+='<e>掌握程度</e>';
                    str+='</div>';
                str+='</div>';
                str+='<div class="hidden-img">';
                    str+='<img src="'+this.imgSrc+'" alt="">';
                str+='</div>';
            str+='</a>';
        str+='</div>';

        var skill_content = document.querySelector('#skill > .w');
        skill_content.innerHTML += str;
    }
};
//经验区域函数封装
function Sample(text,imgSrc){
    this.text = text;
    this.imgSrc = imgSrc;
}
Sample.prototype = {
    bindBasic : function () {
        var content_right = document.getElementById('content_right');

        var str = '';
        str+='<div class="">';
            str+='<span>'+this.text+'</span>';
            str+='<br/>';
            str+='<img src="'+this.imgSrc+'" title="点击查看大图">';
        str+='</div>';

        content_right.innerHTML += str;

    },
    bindMask : function () {
        var img_mask = document.getElementById('img_mask');
        var str_mask = '';

        str_mask+='<div class="img-wrap">';
        str_mask+='<img src="'+this.imgSrc+'">';
        str_mask+='</div>';

        img_mask.innerHTML += str_mask;
    }
};

//AJAX非源生封装(经验部分)
function queryComment(url,content){
    $.ajax({
        type : "get",
        async: true,
        url : url,
        dataType : "json",
        success : function(data){
            if(data){
                $('#more').html('没有更多经验!').unbind('click');
                return false;
            }

            var content_right = document.getElementById('content_right');

            $.each(data,function(i,element){
                var list = data.data;
                var str = '';
                for(var i = 0;i < list.length;i++){
                    var item = list[i];
                    var desc = item.desc;

                    str+='<div class="">';
                    str+='<span>'+this.text+'</span>';
                    str+='<br/>';
                    str+='<img src="'+this.imgSrc+'" title="点击查看大图">';
                    str+='</div>';

                    content_right.innerHTML += str;
                }
            });
            var now = parseInt(content_right.val()) + 2;
            content_right.val(now);
        },
        error:function(){
            console.log('fail');
        }
    });
}
//AJAX评论区
function queryList(url){
    $.ajax({
        type : "get",
        async: true,
        url : url,
        dataType : "json",
        success : function(data){
            $('#more').html('没有更多评论');  //unbind()不起作用  混搭不行？
            var more = document.getElementById('more');
            more.onclick = function () {};
            //获取后台数据
            var list = data.data;
            for( var i = 0; i<list.length;i++){
                var info = $('<li class="comment"><div class="left"><img src="'+list[i].imgSrc+'"></div><div class="right"><div>'+list[i].nickname+'</div><div></div>'+list[i].content+'</div></li>');
                $('#contentList').append(info);
            }
        },
        error:function(){
            console.log('fail');
        }
    });
}
//圆饼构造函数
function PieChart( option ) {
    this._init( option );
}
PieChart.prototype = {
    _init: function( option ) {
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.r = option.r || 0;
        this.data = option.data || [];

        //饼状图所有的 物件的组
        this.group = new Konva.Group({
            x: this.x,
            y: this.y
        });

        //饼状图：所有的 扇形的组
        this.wedgeGroup = new Konva.Group({
            x: 0,
            y: 0
        });

        //饼状图： 所有的文字的组
        this.textGroup = new Konva.Group({
            x: 0,
            y: 0
        });

        this.group.add( this.wedgeGroup );
        this.group.add( this.textGroup );

        var self = this;
        var tempAngel = -90;//从-90开始绘制

        this.data.forEach(function(item, index ) {
            //把每条数据创建成一个扇形
            var angle = 360 * item.value;//当前扇形的角度
            //创建一个扇形
            var wedge = new  Konva.Wedge({
                x: 0,		//扇形圆心坐标
                y: 0,
                angle: angle ,	//扇形的角度
                radius: self.r,	//扇形的半径
                fill: item.color,	//扇形的填充颜色
                rotation: tempAngel //扇形的旋转角度
            });

            self.wedgeGroup.add( wedge );

            //绘制文本的 角度
            var textAngle = tempAngel + 1/2 * angle;

            //绘制的 百分比的文本
            var text = new Konva.Text({
                x: (self.r+20) * Math.cos(Math.PI/ 180 * textAngle ),
                y: (self.r+20) * Math.sin(Math.PI/ 180 * textAngle ),
                //text: item.value*100 +'%',
                text: item.name,
                fill: '#fff',
                fontSize: 30
            });

            //根据角度判断设置文字的 位置
            if(  textAngle > 90 && textAngle < 270 ) {
                //让文本向左边 移动文字宽度的位置。
                text.x( text.x() - text.getWidth() );
            }

            self.textGroup.add( text );

            tempAngel += angle;
        });
        //绘制所有的楔形

        //绘制文字

        //绘制圆环的线
        var cir = new Konva.Circle({
            x: 0,
            y: 0,
            radius: this.r+10,
            stroke: '#ccc',
            strokeWidth: 2
        });

        this.group.add( cir );

        this._animateIndex = 0;
    },
    playAnimate: function() {

        var self = this;
        //根据索引显示动画
        //把所有扇区 角度设置为0
        if( this._animateIndex == 0 ) {
            //拿到所有的 扇形
            this.wedgeGroup.getChildren().each(function(item, index ){
                item.angle(0);
            });
        }

        //展示当前索引对应的动画
        var item = this.wedgeGroup.getChildren()[this._animateIndex];
        item.to({
            angle: this.data[this._animateIndex].value * 360,
            duration: 2 * this.data[this._animateIndex].value,
            onFinish: function() {
                self._animateIndex ++;
                if( self._animateIndex >= self.data.length) {

                    self._animateIndex = 0;//让他的索引再回到0

                    //************************重点***********************
                    return;// 会把整个递归执行完成。
                }
                //继续执行当前方法，播放下一个动画
                self.playAnimate();
            }
        });
    },
    //把饼状图添加到层里面的方法
    addToGroupOrLayer: function( arg ) {
        arg.add( this.group );
    }
};
