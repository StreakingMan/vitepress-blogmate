---
tags: [浏览器, mac]
category: JavaScript
date: 2022-07-11
---

# 优化 mac 触摸板的滚动体验

最近在开发个人项目[vue3-简历编辑器](https://resume-editor.streakingman.com)，其中有个设计类应用常用的操作-拖拽移动画布，
本项目是用 vue3 写的，底层实际是基于 dom 实现，所以画布的拖拽移动，还是基于原生的 scroll 行为，但是使用 mac 触摸板操作时，
发现了一个比较奇怪现象，核心代码抽离成 demo 效果如下：

![](https://media-bed.streakingman.com/blog-img/Kapture%202022-11-29%20at%2017.28.02.gif)

```vue
<template>
    <div id="wrapper" class="wrapper">
        <div class="content"></div>
    </div>
</template>

<style>
.wrapper {
    width: 500px;
    height: 500px;
    overflow: auto;
    border: 2px solid grey;
}

.content {
    width: 1000px;
    height: 1000px;
    /*网格背景样式*/
}
</style>
```

可以看到，使用触摸板滚动时，无论怎么操作只能同时在垂直或者水平一个方向上滚动，十分生硬。
再看看 figma 用 canvas 实现的效果，十分的丝滑：

![](https://media-bed.streakingman.com/blog-img/Kapture%202022-11-29%20at%2017.21.04.gif)

翻遍了 CSS 滚动相关的属性，发现并没有控制该行为的属性，看来只能看 js 方面下手了，
一番查阅之后，发现 mac 触摸板触发的实际上是滚轮事件 WheelEvent。

> 当滚动鼠标滚轮或操作其它类似输入设备时会触发滚轮事件。滚轮事件替换了已被弃用的非标准 mousewheel 事件。

通过拦截原生的滚动滚动，读取两个方向的偏移量并重新设置父容器的滚动位置，也可以做出丝滑的效果：

```javascript
const wrapper = document.getElementById('wrapper');
wrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    wrapper.scrollLeft += e.deltaX;
    wrapper.scrollTop += e.deltaY;
});
```

![](https://media-bed.streakingman.com/blog-img/Kapture%202022-11-29%20at%2019.36.10.gif)

再对比下之前，可以看到效果十分明显：

![](https://media-bed.streakingman.com/blog-img/Kapture%202022-11-29%20at%2017.28.02.gif)
