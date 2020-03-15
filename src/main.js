import { fromEvent, Observable, of, range, generate } from 'rxjs';
import { throttleTime, scan, map, repeat } from 'rxjs/operators';

// fromEvent
fromEvent(document, 'click')
  .pipe(
    throttleTime(1000),
    scan(count => count + 1, 0)
  )
  .subscribe(count => console.log(`Clicked ${count} times`));

// Observable
const observable = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  setTimeout(() => {
    subscriber.next(3);
    subscriber.complete();
  }, 1000);
});

console.log('before subscribe');
observable.subscribe({
  next(x) {
    console.log('got value' + x);
  },
  error(err) {
    console.log('something wrong occurred: ' + err);
  },
  complete() {
    console.log('done');
  }
});
console.log('after subscribe');

// of：列举数据
of(1, 2, 3)
  .pipe(map(x => x * 2))
  .subscribe(
  console.log,
  null,
  () => console.log('complete')
)

// range：指定范围
range(1, 3)
  .pipe(map(x => x * 2))
  .subscribe(
  console.log,
  null,
  () => console.log('complete')
)

// generate：循环创建
generate(1, x => x < 3, x => x +1).subscribe(console.log)

// repeat：重复数据的数据流
range(1, 3)
    .pipe(repeat(3))
    .subscribe(console.log)