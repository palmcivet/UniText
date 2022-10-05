interface LinkedListNode<T> {
  nextNode: LinkedListNode<T> | null;
  prevNode: LinkedListNode<T> | null;
  payload: T;
}

type Node<T> = LinkedListNode<T> | null;

export default class LinkedList<T> {
  private isRing: boolean;

  private headNode: Node<T>;

  private tailNode: Node<T>;

  length = 0;

  constructor(isRing: boolean = false, list?: Array<T>) {
    this.isRing = isRing;
    this.headNode = null;
    this.tailNode = null;

    list?.map((item) => {
      this.insert(item);
    });
  }

  public foreach(callback: (payload: T, index: number) => boolean | void): void {
    let currentNode = this.headNode;
    for (let index = 0; index < this.length && currentNode !== null; index++) {
      const flag = callback(currentNode!.payload, index);
      if (flag === false) {
        break;
      }
      currentNode = currentNode!.nextNode;
    }
  }

  public index(index: number): T | void {
    if (index > this.length) {
      return;
    }

    let currentNode = this.headNode;
    for (let _index = 0; _index < this.length && currentNode !== null; _index++) {
      if (_index === index) {
        return currentNode!.payload;
      }
      currentNode = currentNode!.nextNode;
    }
  }

  public find(callback: (payload: T, index: number) => boolean): [T, number] | null {
    let currentNode = this.headNode;
    for (let index = 0; index < this.length && currentNode !== null; index++) {
      if (callback(currentNode!.payload, index)) {
        return [currentNode!.payload, index];
      }
      currentNode = currentNode!.nextNode;
    }
    return null;
  }

  public insert(payload: T, index?: number): void {
    if (typeof index === "number" && index > this.length) {
      throw Error(`Index out of bounds: ${index}`);
    }

    if (this.length === 0) {
      const node = {
        prevNode: null,
        nextNode: null,
        payload: payload,
      };
      this.headNode = node;
      this.tailNode = node;
    } else {
      const node: LinkedListNode<T> = {
        prevNode: this.tailNode,
        nextNode: null,
        payload: payload,
      };
      this.tailNode!.nextNode = node;
      this.tailNode = node;
    }

    this.length += 1;
  }

  public remove(index: number | ((payload: T) => boolean)): T | undefined {
    let currentNode = this.headNode;

    const deleteNode = (node: LinkedListNode<T>) => {
      const prevNode = node.prevNode;
      const nextNode = node.nextNode;
      if (prevNode !== null) {
        prevNode.nextNode = nextNode;
      } else {
        this.headNode = nextNode;
      }
      if (nextNode !== null) {
        nextNode.prevNode = prevNode;
      } else {
        this.tailNode = prevNode;
      }
      this.length -= 1;
    };

    if (typeof index === "number") {
      if (index > this.length) {
        throw Error(`Index out of bounds: ${index}`);
      }

      for (let _index = 0; _index < this.length && currentNode !== null; _index++) {
        if (_index === index) {
          deleteNode(currentNode);
          return currentNode.payload;
        }

        currentNode = currentNode!.nextNode;
      }
    } else {
      for (let _index = 0; _index < this.length && currentNode !== null; _index++) {
        if (index(currentNode.payload)) {
          deleteNode(currentNode);
          return currentNode.payload;
        }
        currentNode = currentNode!.nextNode;
      }
    }
  }

  public dispose(): void {}
}
