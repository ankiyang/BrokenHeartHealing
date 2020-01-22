# Doesn't front-end have any data structure?

* 翻译： Anki Yang
* Date:   22 Jan 2020

When you watch carefully outside from the front-end world, and you don’t want to be deceived by this “monotonous” code world, but also you’re afraid of seeing it wrong or missing any beauty of it.
Lets start with a PR of React from version 16.10.0.
> Improve queue performance by switching its internal data structure to a min binary heap. ( [@acdlite](https://github.com/acdlite) in [#16245](http://link.zhihu.com/?target=https%3A//github.com/facebook/react/pull/16245) )  

So in order to understand what this PR had optimised.  Lets review some knowledges.

1. One of the hard problem of front-end optimisation is solving browser freezing(浏览器卡顿). Basically because of Javascript is single-threaded in our browser  and Js thread could modify DOM and then make pages change. But  in order to ensure our page would display safely, when Js is modifying DOM, our browser will let Js thread and UI rendering thread **mutex**(互斥). In other words, every time we run our JS code, UI rendering thread would suspend and all UI update would be saved in queue until Js thread is idle and then to render pages.

But this design has posed an inevitable problem: long-time JS execution would cause UI threads in browser suspending for a long time and it couldn’t render any more and response to users’ events. In result, we feel the stuck.

2. Before version 16.0+ of React, there was a **Stack Reconciler** scheduling algorithm which simply is to do [virtual DOM(VDOM)](https://programmingwithmosh.com/react/react-virtual-dom-explained/) diff and calculate the real DOM need to be updated and then call native APIs to manipulate DOM. Obviously, it would cause “long-time Javascript execution”.
To address this problem, React v16 used new *[Fiber](https://github.com/acdlite/react-fiber-architecture)* scheduling algorithm  through **Concurrent**(竞争渲染) and **Schedular**(任务调度) collaboratively.
* “Concurrent” would split synchronous rendering DOM process to asynchronous rendering step by step. Thus,  by executing long rendering tasks in batches, browsers could get a break and to support UI rendering and to respond user events.
* “Schedular” support  multi-priority rendering at React framework level. It schedule the “concurrent” system ensuring different missions in slice (分片)execute according to different priorities.


Lets back to this PR😂.  To avoid long-time Javascript sequential execution, the new scheduling algorithm of React hold a Js execution queue.Every Js mission in the queue has different priority.It would be executed as much as possible as  different priorities during every browser rendering.In a limited execution time，not completed missions would be left to the next rendering interval, those already completed missions dequeue. In this way, those Js tasks that need to be performed for a long time are split into slicing tasks with different priorities, preventing the browser to let UI thread from being suspended and causing stuck. Those split tasks with different priorities would be executed “as the case may be “ at each rendering interval.

So how to maintain and proceed this queue with priorities.
Earlier, React 16 utilised linked list to record data, specifically a [double  circular   linked  list structure (双向循环链表结构)](https://www.geeksforgeeks.org/doubly-circular-linked-list-set-1-introduction-and-insertion/) to operate tasks in the **Scheduler**.
Each task match 5 different priorities.
```
const ImmediatePriority = 1 
const UserBlockingPriority = 2 
const NormalPriority = 3 
const LowPriority = 4 
const IdlePriority = 5

```

To prevent [Starvation problem](https://en.wikipedia.org/wiki/Starvation_(computer_science)), there are five expiration times for each task.
```
// Times out immediately 
const IMMEDIATE_PRIORITY_TIMEOUT = -1; 
// Eventually times out 
const USER_BLOCKING_PRIORITY = 250; 
const NORMAL_PRIORITY_TIMEOUT = 5000; 
const LOW_PRIORITY_TIMEOUT = 10000; 
// Never times out 
const IDLE_PRIORITY = maxSigned31BitInt;
```


**Using linked list to maintain our priority queue**: we add every task to the list, and use `performance.now() + timeout`  to record the expiration time of this task at the same time. **timeout** is related to the above 5 priorities. Of course, the higher priority, expiration time for timeout would be more short. Because, if it is expired, it need to be performed immediately. Thus, the higher priority for task, the easier for this task will be expired.
[Relevant React source code](https://github.com/facebook/react/blob/901139c2910d0dc33f07f85c748c64371f8664f4/packages/scheduler/src/Scheduler.js#L279):
```
function timeoutForPriorityLevel(priorityLevel) {
  switch (priorityLevel) {
    case ImmediatePriority:
      return IMMEDIATE_PRIORITY_TIMEOUT;
    case UserBlockingPriority:
      return USER_BLOCKING_PRIORITY;
    case IdlePriority:
      return IDLE_PRIORITY;
    case LowPriority:
      return LOW_PRIORITY_TIMEOUT;
    case NormalPriority:
    default:
      return NORMAL_PRIORITY_TIMEOUT;
  }
}



function unstable_scheduleCallback(priorityLevel, callback, options) {

  var currentTime = getCurrentTime();

  var startTime;
  var timeout;
  if (typeof options === ‘object’ && options !== null) {
    var delay = options.delay;
    if (typeof delay === ‘number’ && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }

    timeout =
      typeof options.timeout === ‘number’
        ? options.timeout
        : timeoutForPriorityLevel(priorityLevel);
  } else {
    timeout = timeoutForPriorityLevel(priorityLevel);
    startTime = currentTime;
  }


  var expirationTime = startTime + timeout;

  var newTask = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  };

  if (enableProfiling) {
    newTask.isQueued = false;
  }



  if (startTime > currentTime) {
    // This is a delayed task.
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // All tasks are delayed, and this is the task with the earliest delay.
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      // Schedule a timeout.
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    if (enableProfiling) {
      markTaskStart(newTask, currentTime);
      newTask.isQueued = true;
    }
    // Schedule a host callback, if needed. If we’re already performing work,
    // wait until the next time we yield.
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }


  return newTask;
}

```

At each rendering time slice interval, we all execute the tasks in the priority queue:  at that time, the task at the head to the queue would be selected for execution, that is, the item in the queue with the highest priority will be scheduled for execution first. We wanna use a double circular linked list to achieve priority queue.It is easy to determine the head and tail of this list, but, if we wanna insert a new task sequentially, then we have to traverse the entire queue and the time complexity would be relatively high.

OK🤣🤣 We transfer to another data structure. 
[*Min heap*](https://www.cs.cmu.edu/~tcortina/15-121sp10/Unit06B.pdf)
  min-heap is a sorted complete binary tree data structure. It is also a very common data structure for implementing priority queue, for example, [Beanstalked](https://github.com/beanstalkd/beanstalkd) uses a min-heap to achieve priority queues.  The time complexity of manipulations are :
* insert a task: O(log N)
* delete a task: O(log N)
* find minimum value: O(1)
* delete minimum value: O(log N)
* combine: O(N)

This is the official description from React😂:
> Heaps are the standard way to implement priority queues. Insertion is O(1) in the average case (append to the end) and O(log n) in the worst. Deletion is O(log n). Peek is O(1).  


In conclusion , this PR in React, is exactly to use min-heap in place of double circular linked list to implement a priority queue.

The source code of the min-heap implementation in React, very simple and easy to understand😌:
```
type Heap = Array<Node>;
type Node = {
  id: number,
  sortIndex: number,
};

export function push(heap: Heap, node: Node): void {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}

export function peek(heap: Heap): Node | null {
  const first = heap[0];
  return first === undefined ? null : first;
}

export function pop(heap: Heap): Node | null {
  const first = heap[0];
  if (first !== undefined) {
    const last = heap.pop();
    if (last !== first) {
      heap[0] = last;
      siftDown(heap, last, 0);
    }
    return first;
  } else {
    return null;
  }
}

function siftUp(heap, node, index) {
  while (true) {
    const parentIndex = Math.floor((index - 1) / 2);
    const parent = heap[parentIndex];
    if (parent !== undefined && compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}

function siftDown(heap, node, index) {
  const length = heap.length;
  while (index < length) {
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];

    // If the left or right node is smaller, swap with the smaller of those.
    if (left !== undefined && compare(left, node) < 0) {
      if (right !== undefined && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (right !== undefined && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller. Exit.
      return;
    }
  }
}

function compare(a, b) {
  // Compare sort index first, then task id.
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}
```


End.

exhausted to write this one.

**Happy  Happy coding and learning！Everyday!**
🥳
