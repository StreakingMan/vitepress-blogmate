---
subheading: element-ui骚操作
tags: [vue, element-ui, 可编辑下拉框]
category: 工作总结
date: 2020-05-07
---

# 更改 element-ui 组件滚动高度的特殊姿势

### 背景

项目开发中有一个较特殊的组件，可编辑的下拉框

![](http://media-bed.streakingman.com/blog-img/%E5%8F%AF%E7%BC%96%E8%BE%91%E4%B8%8B%E6%8B%89%E6%A1%86.png)

在点击添加学历时，在列表末尾追加一个输入框，同时将 select 滚动到底部，坑爹的是 element-ui 并没有直接的方法操作滚动高度

### scrollbar 组件

element-ui 中，滚动条是额外实现的，带了滚动条的组件都会引入 scrollbar，但 scrollbar 组件并没有暴露出来

![](http://media-bed.streakingman.com/blog-img/element-scrollbar.png)

翻一下 scroll 的属性，发现了一个 moveY 属性，但很可惜，这个属性仅仅是控制滚动条的位置的

![](http://media-bed.streakingman.com/blog-img/element-scrollbar-movey.png)

![](http://media-bed.streakingman.com/blog-img/element-ui-ref-scrollbar-moveY-test.gif)

### 操作 scrollbar wrap

继续翻会发现 scrollbar 挂载了 wrap，直接操作 scrolltop 就好了

![](http://media-bed.streakingman.com/blog-img/element-ui-ref-scrollbar-wrap.png)

直接取到 scrollbar 的 ref 进行操作

```vue
scrollTopAdd() { this.$refs.select.$refs.scrollbar.wrap.scrollTop++; }
```

![](http://media-bed.streakingman.com/blog-img/element-ui-ref-scrollbar-wrap-test.gif)

### 总结

理论上来讲，element-ui 中使用滚动条的组件都可以通过这种方法主动控制滚动高度
