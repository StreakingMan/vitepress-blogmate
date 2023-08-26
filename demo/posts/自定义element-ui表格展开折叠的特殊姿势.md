---
subheading: element-ui骚操作
tags: [vue, element-ui, 表格]
category: 工作总结
date: 2020-06-14
---

# 自定义 element-ui 表格展开折叠交互的特殊姿势

### 背景

最近开发中遇到这样一个场景：固件列表对同一型号，但不同版本的固件需要支持展开折叠操作

![](http://media-bed.streakingman.com/blog-img/table-custom-expand.png '自定义表格展开折叠交互')

实际上我们只需要将表格展开折叠自定义即可（将箭头展开替换为文字按钮触发）

![](http://media-bed.streakingman.com/blog-img/element-ui-table-tree-lazy-doc.png)

但很可惜，文档中没有有替换这个默认箭头的方法

### 探索：tableStore

一开始尝试过使用展开行的方式，使用`toggleRowExpansion`方法，但需要做不少额外工作，而且树形数据表格本身就更加适合这个场景，所以还是决定另辟蹊径用代码来触发展开和折叠

查看源码的过程中，发现 table 还有个未暴露的 tableStore，很明显节点的状态是通过这个来管理的

![](http://media-bed.streakingman.com/blog-img/element-ui-source-code-table-store.png)

点进源码，发现除了文档中的方法外，还有两个未暴露的方法

![](http://media-bed.streakingman.com/blog-img/element-ui-source-code-table-store-methods.png)

表格数据和懒加载的表格数据都是树状的，`toggleTreeExpansion`方法用过`rowkey`即可切换状态，`loadData`则可以主动调用`lazy`方法

查看 table-column 源码，也能发现折叠箭头调用的是这两个方法

![](http://media-bed.streakingman.com/blog-img/element-ui-source-code-table-column-expand.png)

### 解决方案

所以最后只需要根据 row-id 主动调用 toggleTreeExpansion 方法即可（箭头未发现配置可隐藏，只能先强制`display: none`隐藏掉）

```vue
<isc-table-column prop="version" label="固件版本">
  <div class="flex-row" slot-scope="scope">
    <div style="width: 50px;" class="text-ellipsis mr-2">
      {{ scope.row.version }}
    </div>
    <template v-if="scope.row.children && scope.row.children.length">
      <isc-button type="text" @click="loadVersionFirmware(scope.row.id)">
        {{ scope.store.states.treeData[scope.row.id].expanded ? '收起' : '查看全部版本' }}
      </isc-button>
    </template>
  </div>
</isc-table-column>

loadVersionFirmware(id) { this.$refs.table.store.toggleTreeExpansion(id); }
```

![](http://media-bed.streakingman.com/blog-img/element-ui-table-custom-expand-demo.gif)

### 总结

自定义懒加载交互也是相同的思路，但另一个入参`treeNode`需要自行获取
