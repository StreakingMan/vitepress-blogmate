---
tags:
category: 设计模式
date: 2021-04-09
---

# 设计模式与 JavaScript 基础笔记

> 本文主要为设计模式与 JavaScript 下实现的相关笔记，时常更新

### 设计原则

-   开闭原则（Open Closed Principle，OCP）
    > 软件实体应当对扩展开放，对修改关闭
-   单一职责原则（Single Responsibility Principle，SRP）

    > 一个类应该有且仅有一个引起它变化的原因，否则类应该被拆分

    特点:

    -   有效降低单个类或对象的复杂度，但会增加工程的复杂度
    -   实际开发中，并不是所有的职责都应该单独分离

-   里氏替换原则（Liskov Substitution Principle，LSP）
    > 继承必须确保超类所拥有的性质在子类中仍然成立
-   依赖倒置原则（Dependence Inversion Principle，DIP）
    > 高层模块不应该依赖低层模块，两者都应该依赖其抽象；抽象不应该依赖细节，细节应该依赖抽象
-   接口隔离原则（Interface Segregation Principle，ISP）
    > 客户端不应该被迫依赖于它不使用的方法，一个类对另一个类的依赖应该建立在最小的接口上
-   合成复用原则（Composite Reuse Principle，CRP）
    > 软件复用时，要尽量先使用组合或者聚合等关联关系来实现，其次才考虑使用继承关系来实现
-   最少知识原则（Least Knowledge Principle，LKP）
    > 又称迪米特法则（Law of Demeter，LoD），
    > 只与你的直接朋友交谈，不跟“陌生人”说话（Talk only to your immediate friends and not to strangers）,
    > 如果两个软件实体无须直接通信，那么就不应当发生直接的相互调用，可以通过第三方转发该调用

### 相关书籍

1. 《JavaScript 设计模式与开发实践》 曾探
