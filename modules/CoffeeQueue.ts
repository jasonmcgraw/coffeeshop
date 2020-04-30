import { Coffee } from './interfaces';
export class CoffeeQueue {
  // Array is used to implement a Queue
  public items: Coffee[] = [] as Coffee[];
  constructor() {
    this.items = [] as Coffee[];
  }
  public enqueue(element: Coffee) {
    this.items.push(element);
  }
  // dequeue function
  public dequeue() : Coffee | undefined {
    // removing element from the queue
    // returns underflow when called
    // on empty queue
    // if(this.isEmpty()) 
    //     return undefined; 
    return this.items.shift();
  }
  // isEmpty function
  public isEmpty() {
    // return true if the queue is empty.
    return this.items.length == 0;
  }
} 