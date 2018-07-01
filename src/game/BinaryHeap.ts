import AStarNodeVO from "./astarNodeVO";

export default class BinaryHeap {
    private _content: AStarNodeVO[];
    private _scoreFunction: Function;

    /**
     * A BinaryHeap implementation taken from the Javascript example at https://github.com/bgrins/javascript-astar/blob/master/graph.js
     */
    constructor(scoreFunction: Function) {
        this._content = new Array<AStarNodeVO>();
        this._scoreFunction = scoreFunction;
    }

    public reset(): void {
        this._content = new Array<AStarNodeVO>();
    }

    public get content(): AStarNodeVO[] {
        return this._content;
    }

    public push(element: AStarNodeVO): void {

        //add the new element to the end of the array
        this._content.push(element);

        //Allow it to sink down.
        this.sinkDown(this._content.length - 1);
    }

    public pop(): AStarNodeVO {

        // Store the first element so we can return it later.
        let result: AStarNodeVO = this._content[0];

        // Get the element at the end of the array.
        let end: AStarNodeVO = this._content.pop();

        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this._content.length > 0) {
            this._content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    }

    public remove(node: AStarNodeVO): void {
        let i: number = this._content.indexOf(node);

        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        let end: AStarNodeVO = this._content.pop();
        if (i != this._content.length - 1) {
            this._content[i] = end;
            if (this._scoreFunction(end) < this._scoreFunction(node)) {
                this.sinkDown(i);
            }
            else {
                this.bubbleUp(i);
            }
        }
    }

    public get size(): number {
        return this._content.length;
    }

    public rescoreElement(node: AStarNodeVO): void {

        this.sinkDown(this._content.indexOf(node));
    }

    private sinkDown(n: number): void {

        // Fetch the element that has to be sunk.
        let element: AStarNodeVO = this._content[n];

        // When at 0, an element can not sink any further.
        while (n > 0) {

            // Compute the parent element's index, and fetch it.
            let parentN: number = ((n + 1) >> 1) - 1;
            //let parentN : Number = _content.indexOf(element.parent);
            if (parentN == -1) {
                parentN = 0;
            }

            let parent: AStarNodeVO = this._content[parentN];

            // Swap the elements if the parent is greater.
            if (this._scoreFunction(element) < this._scoreFunction(parent)) {
                this._content[parentN] = element;
                this._content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    }

    private bubbleUp(n: number): void {
        // Look up the target element and its score.
        let length: number = this._content.length;
        let element: AStarNodeVO = this._content[n];
        let elemScore: number = this._scoreFunction(element);

        while (true) {

            // Compute the indices of the child elements.
            let child2N: number = (n + 1) << 1;
            let child1N: number = child2N - 1;

            // This is used to store the new position of the element,
            // if any.
            let swap: any = null;

            // If the first child exists (is inside the array)...
            let child1: AStarNodeVO = this._content[child1N];
            let child1Score: number = this._scoreFunction(child1);

            if (child1N < length) {
                // Look it up and compute its score.

                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore)
                    swap = child1N;
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                let child2: AStarNodeVO = this._content[child2N];
                let child2Score: number = this._scoreFunction(child2);
                if (child2Score < (swap == null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap != null) {
                this._content[n] = this._content[swap];
                this._content[swap] = element;
                n = swap;
            }
            // Otherwise, we are done.
            else {
                break;
            }
        }
    }

}