import { IEventLoop, IStackFunction } from '@models/callstack.model';

/**
 * @desc decorator to stop any method execution and put it in a custom callstack
 * @param eventLoop IEventLoop
 */
export function InEventLoop(eventLoop: IEventLoop) {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    // memoize original method
    const originalMethod = descriptor.value;

    // change descriptor as a decoration
    descriptor.value = function(...args) {
      // prepare entry
      const entry: IStackFunction = {
        parent: eventLoop.parent || null,
        name: key,
        func: () => {
          // remove current method from readyStack (first pos)
          eventLoop.readyStack.shift();

          // add current method to the callStack (last pos)
          eventLoop.callStack.push(entry);

          // memoize a "running" state, to deferentiate with static initial state
          eventLoop.isRunning = true;

          // run the method
          originalMethod.bind(target)(...args);
        }
      };
      if (!eventLoop.isRunning) {
        // put static entries in readystack if routine is not already running
        eventLoop.readyStack.push(entry);

        // else, put new entry in a level related position
      } else {
        const previous = eventLoop.readyStack[0];
        const previousParent = previous && previous.parent;
        const currentParent = eventLoop.parent;
        const grandParent = currentParent && currentParent.parent;
        // if (currentParent === previousParent) {
        // } else
        console.log('previousParent', previousParent);
        console.log('currentParent', currentParent);
        console.log('grandParent', grandParent);
        if (previousParent && previousParent === currentParent) {
          console.log('same !');
          eventLoop.readyStack.splice(1, 0, entry);
        } else if (previousParent && previousParent === grandParent) {
          eventLoop.level++;
          eventLoop.readyStack.splice(eventLoop.level, 0, entry);
        } else if (previousParent && currentParent !== previousParent) {
          eventLoop.level--;
          eventLoop.readyStack.splice(eventLoop.level, 0, entry);
        } else {
          eventLoop.readyStack.unshift(entry);
        }
      }
    };
    return descriptor;
  };
}
