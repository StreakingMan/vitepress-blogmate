---
tags: [decorator]
category: JavaScript
date: 2022-03-29
---

# JavaScript 修饰器

最近在接触 nest.js，发现其大量的使用了修饰器，这可让长期码业务的我有点不知所措，毕竟根本没有在工作中使用过这玩意儿。
修饰器（也称装饰器 Decorator）是在 ES8 中引入的，红宝书和犀牛书似乎都没有相关的介绍，本文跟着阮一峰老师的《ES6 标准入门》
来进一步学习。

## 装饰器模式

开始之前，有必要回顾以下设计模式————修饰器模式，相关的解释说明很多，但按照四人帮的经典设计模式所说就是：
在不修改任何底层代码的情况下，给你或别人的对象赋予新的职责。同时讲修饰器这一章的标题也非常有意思：
**_“给爱用继承的人一个全新的开阔眼界”_**，同时插图配文 **_“运行时扩展远比编译时期的继承威力大”_**。

## 基础用法

言归正传，来看下 ES 规范中的修饰器是如何使用的：

```javascript
@testable
class MyTestableClass {}
function testable(target) {
    target.isTestable = true;
}
console.log(MyTestableClass.isTestable); // true
```

上述过程就是在不修改`MyTestableClass`的情况下，对其拓展了静态属性，但与传统的修饰器模式不同的是，
这个过程是发生在编译时期的，而不是运行时（就好比 ES6 的模块）。

> 不同于 ESM，node 还没有对修饰器做支持，需要使用 babel

修饰器实际上就是一个函数，接受一个入参`target`，表示要修饰的目标类，我们也可以使用闭包来支持修饰器传参：

```javascript
function testable(isTestable) {
    return function (target) {
        target.isTestable = isTestable;
    };
}
@testable(true)
class A {}
@testable(false)
class B {}
console.log(A.isTestable); // true
console.log(B.isTestable); // false
```

## 拓展实例

通过操作`target.prototype`可以添加实例属性：

```javascript
function testable(target) {
    target.prototype.isTestable = isTestable;
}
@testable(true)
class A {}
console.log(new A().isTestable); // true
```

修饰器还可以修饰类的属性，但此时修饰器函数会有些变化：

```javascript
// name为属性名，decriptor为该属性的描述对象
function readonly(target, name, descriptor) {
    descriptor.writable = false;
    return descriptor;
}
class Person {
    constructor(name) {
        this._name = name;
    }
    @readonly
    name() {
        return this._name;
    }
}
const jack = new Person('Jack');
jack.name = null; // Error
```

## 总结

修饰器的用法已经差不多就这些，由于函数声明存在提升，所以修饰器并不能用在函数上。
同时社区中也有诸如`core-decorators.js`这样的第三方模块，封装了常用的修饰器。
