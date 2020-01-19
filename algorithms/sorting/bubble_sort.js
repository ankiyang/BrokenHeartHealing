
// bubble sort
// inefficient
// sort a list L of n comparable elements
// scans the list n - 1 times, where, in each scan
// the algorithm compares the current element with the next one and swaps them if they are out of order

// implementation
// compare adjacent elements. If the first is larger than the second, then switch these two.
// do this action towards each pair of elements. From the first pair to the last pair.
// so the last element would be the largest number.
// repeat this step except the last one;

function bubbleSort(array) {
    if (Object.prototype.toString.call(array).slice(8, -1) === 'Array') {
        let len = array.length, temp;
        for (let i = 0; i < len - 1; i++) {
            for (let j = len - 1; j >= i; j--) {
                if (array[j] < array[j - 1]) {
                    temp = array[j];
                    array[j] = array[j - 1];
                    array[j - 1] = temp;
                }
            }
        }
        return array;
    } else {
        return "array is not an Array!"
    }
}

console.log(bubbleSort([6, 5, 3, 1, 8, 7, 2, 4]))