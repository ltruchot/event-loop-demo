import { Component } from '@angular/core';
import { InEventLoop } from './shared/decorators';
import { IEventLoop } from '@models/callstack.model';

const eventLoop: IEventLoop = {
  callStack: [],
  readyStack: [],
  level: 0,
  parent: null
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public eventLoop: IEventLoop = eventLoop;
  public btnLabel = 'Next';
  launchRoutine() {
    // setTimeout(() => {
    //   this.test5();
    // });
    this.test1();
    this.test2();
    this.test3();
  }
  resetRoutine() {
    this.btnLabel = 'Next';
    this.eventLoop.callStack = [];
    this.eventLoop.readyStack = [];
    this.eventLoop.level = 0;
    this.eventLoop.parent = null;
    this.launchRoutine();
  }
  @InEventLoop(eventLoop)
  test1() {
    console.log('test 1');
    this.test4();
    this.test5();
  }

  @InEventLoop(eventLoop)
  test2() {
    console.log('test 2');
  }

  @InEventLoop(eventLoop)
  test3() {
    console.log('test 3');
  }

  @InEventLoop(eventLoop)
  test4() {
    console.log('test 4');
  }

  @InEventLoop(eventLoop)
  test5() {
    console.log('test 5');
    this.test6();
  }

  @InEventLoop(eventLoop)
  test6() {
    console.log('test 6');
  }

  nextMethodCall() {
    const readyStack = this.eventLoop.readyStack;
    const callStack = this.eventLoop.callStack;
    if (!readyStack.length) {
      this.resetRoutine();
    } else {
      readyStack[0].func();
      if (!readyStack.length) {
        this.btnLabel = 'Reset';
      }
    }
  }
}
