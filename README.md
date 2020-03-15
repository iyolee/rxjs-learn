# rxjs-learn

### Reactive Extension

> An API for asynchronous programming with observable streams.

Rx是一套通过可监听流来做异步编程的API。

RxJS这套模型具备下面这些特点：

- 数据流抽象了很多现实问题。
- 数据流抽象了很多现实问题。
- 把复杂问题分解成简单问题的组合。

### Reactive Programming 其实就是处理异步数据流

> stream 是一序列按时间排序的正在发生的事件（A stream is a sequence of ongoing events ordered in time）。

stream可以 emit 三种不同的东西：值（value），错误（error），或者一个 completed 的标志。

当一个值 emit 的时候就调用一个事先定义好的回调函数，同样地，当 error 或者 completed 时调用其对应的回调函数。有时候，你可以不用管后面两个函数，如果只关注值的话。监听 stream 也就是所谓的 subscribing ；回调函数就是所谓的 observers ；而 stream 也就是所谓的 subject (observable)。以上其实就是[观察者设计模式](https://link.zhihu.com/?target=https%3A//en.wikipedia.org/wiki/Observer_pattern)（Observer Desgin Pattern）。

(most) everything is a stream ，stream 的官方术语是「 Observable 」。

### Why Reactive Programming(RP)

Reactive Programming 提高了你代码的抽象级别，因此你可以专注写业务逻辑（business logic），而不是不停地去折腾一大堆的实现细节，所以 RP 的代码看起来简洁很多。

### Observable和Observer

Observable就是“可以被观察的对象”即“可被观察者”，而Observer就是“观察者”，连接两者的桥梁就是Observable对象的函数subscribe。

RxJS中的数据流就是Observable对象，Observable实现了下面两种设计模式：

- 观察者模式（Observer Pattern）
- 迭代器模式（Iterator Pattern）

### 观测者模式

观察者模式将逻辑分为发布者（Publisher）和观察者（Observer），其中发布者只管负责产生事件，它会通知所有注册挂上号的观察者，而不关心这些观察者如何处理这些事件，相对的，观察者可以被注册上某个发布者，只管接收到事件之后就处理，而不关心这些数据是如何产生的。

- 数据提供者 ： 可观测对象/Observable
- 数据消费者 ： 观测者/Observer
- 数据 ： 通知/Notification

观察者模式带来的好处很明显，这个模式中的两方都可以专心做一件事，而且可以任意组合，也就是说，复杂的问题被分解成三个小问题：

- 如何产生事件，这是发布者的责任，在RxJS中是Observable对象的工作。
- 如何响应事件，这是观察者的责任，在RxJS中由subscribe的参数来决定。
- 什么样的发布者关联什么样的观察者，也就是何时调用subscribe。

在RxJS中，一个观测者需要实现的接口扩展为三个：

- onNext(data) - 可观测对象生成的正常数据，将调用这个接口
- onError(error) - 可观测对象发生的错误，将调用这个接口
- onCompleted() - 可观测对象正常结束数据生成流程，将调用这个接口

### 迭代器模式

迭代者（Iterator，也称为“迭代器”）指的是能够遍历一个数据集合的对象，因为数据集合的实现方式很多，可以是一个数组，也可以是一个树形结构，也可以是一个单向链表……迭代器的作用就是提供一个通用的接口，让使用者完全不用关心这个数据集合的具体实现方式。

在RxJS中，作为迭代器的使用者，并不需要主动去从Observable中“拉”数据，而是只要subscribe上Observable对象之后，自然就能够收到消息的推送，这就是观察者模式和迭代器两种模式结合的强大之处。

### 创造Observable

每个Observable对象，代表的就是在一段时间范围内发生的一系列事件。

RxJS结合了观察者模式和迭代者模式，其中的Observable可以用下面这种公式表示：

```
Observable = Publisher + Iterator
```

在RxJS中，一个Observable对象只有一种终结状态，要么是完结（complete），要么是出错（error），一旦进入出错状态，这个Observable对象也就终结了，再不会调用对应Observer的next函数，也不会再调用Observer的complete函数；同样，如果一个Observable对象进入了完结状态，也不能再调用Observer的next和error。

### Observable  VS Promise

Observable 和 Promise++ 的唯一区别是前者不兼容 [Promise/A+](https://link.zhihu.com/?target=http%3A//promises-aplus.github.io/promises-spec/) ，但是理论上来讲是没有冲突的。Promise 其实就是只有单独一个值 的 Observable ，但后者更胜一筹的是允许多个返回值（多次 emit）。Promise 能做的事情，Observable 也能做。Promise 不能做的事情，Observable 还是能做。

### Hot Observable和Cold Observable

- Cold Observable，每一次订阅，都会产生一个新的“生产者”。
- Hot Observable，概念上是有一个独立于Observable对象的“生产者”，这个“生产者”的创建和subscribe调用没有关系，subscribe调用只是让Observer连接上“生产者”而已。

一个Observable是Hot还是Cold，是“热”还是“冷”，都是相对于生产者而言的，如果每次订阅的时候，已经有一个热的“生产者”准备好了，那就是Hot Observable，相反，如果每次订阅都要产生一个新的生产者，新的生产者就像汽车引擎一样刚启动时肯定是冷的，所以叫ColdObservable。

#### Observables 只是函数而已！

**Observables 是将观察者和生产者联系起来的函数。** 仅此而已。它们并不一定要建立生产者，它们只需建立观察者来监听生产者，并且通常会返回一个拆卸机制来删除该监听器。

#### 什么是“生产者”?

生产者是 Observable 值的来源。它可以是 Web Socket、DOM 事件、迭代器或在数组中循环的某种东西。基本上，这是你用来获取值的任何东西，并将它们传递给 `observe.next（value）` 。

#### 冷的 Observables: 在内部创建生产者

如果底层的生产者是在订阅期间**创建并激活的**，那么 Observable 就是“冷的”。这意味着，如果 Observables 是函数，而生产者是通过**调用该函数**创建并激活的。

1. 创建生产者
2. 激活生产者
3. 开始监听生产者
4. 单播

下面的示例 Observable 是“冷的”，因为它在订阅函数(在订阅该 Observable 时调用)中创建并监听了 WebSocket :

``` js
const source = new Observable((observer) => {
  const socket = new WebSocket('ws://someurl');
  socket.addEventListener('message', (e) => observer.next(e));
  return () => socket.close();
});
```

所以任何 `source` 的订阅都会得到自己的 WebSocket 实例，当取消订阅时，它会关闭 socket 。这意味着 `source` 是真正的单播，因为生产者只会发送给一个观察者。

#### 热的 Observables: 在外部创建生产者

如果底层的生产者是在订阅外部创建或激活的，那么 Observable 就是“热的”。

1. 共享生产者的引用
2. 开始监听生产者
3. 多播(通常情况下)

如果我们沿用上面的示例并将 WebSocket 的创建移至 Observable 的外部，那么 Observable 就会变成“热的”:

``` js
const socket = new WebSocket('ws://someurl');
const source = new Observable((observer) => {
  socket.addEventListener('message', (e) => observer.next(e));
});
```

现在任何 `source` 的订阅都会共享同一个 WebSocket 实例。它实际上会多播给所有订阅者。但还有个小问题: 我们不再使用 Observable 来运行拆卸 socket 的逻辑。这意味着像错误和完成这样的通知不再会为我们来关闭 socket ，取消订阅也一样。

#### “热的”和“冷的”都关乎于生产者

如果在 Observable 中复用了生产者的共享引用，它就是“热的”，如果在 Observable 中创建了新的生产者，它就是“冷的”。

### 弹珠图

在弹珠图（Marble Diagram）中，每个弹珠之间的间隔，代表的是吐出数据之间的时间间隔，用这种形式，能够很形象地看清楚一个Observable对象中数据的分布。

- 竖杠符号|代表的是数据流的完结
- 符号 × 代表数据流中的异常

网站：

- [https://rxviz.com/](https://rxviz.com/)
- [https://rxmarbles.com/](https://rxmarbles.com/)

### 操作符

对于现实中复杂的问题，并不会创造一个数据流之后就直接通过subscribe接上一个Observer，往往需要对这个数据流做一系列处理，然后才交给Observer。就像一个管道，数据从管道的一段流入，途径管道各个环节，当数据到达Observer的时候，已经被管道操作过，有的数据已经被中途过滤抛弃掉了，有的数据已经被改变了原来的形态，而且最后的数据可能来自多个数据源，最后Observer只需要处理能够走到终点的数据。

在RxJS中，有一系列用于产生Observable函数，这些函数有的凭空创造Observable对象，有的根据外部数据源产生Observable对象，更多的是根据其他的Observable中的数据来产生新的Observable对象，也就是把上游数据转化为下游数据，所有这些函数统称为操作符。

对于每一个操作符，链接的就是上游（upstream）和下游（downstream）。

一个操作符是返回一个Observable对象的函数，不过，有的操作符是根据其他Observable对象产生返回的Observable对象，有的操作符则是利用其他类型输入产生返回的Observable对象，还有一些操作符不需要输入就可以凭空创造一个Observable对象。

### 操作符的分类

- 创建类（creation）
- 转化类（transformation）
- 过滤类（filtering）
- 合并类（combination）
- 多播类（multicasting）
-  错误处理类（error Handling）
-  辅助工具类（utility）
- 条件分支类（conditional & boolean）
- 数学和合计类（mathmatical & aggregate）
