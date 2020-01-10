
// 在无序区中选出最小的元素，然后将它和无序区的第一个元素交换位置。
// 原理跟冒泡排序一样，算是冒泡的衍生版本

function selectionSort(array) {
    if (Object.prototype.toString.call(array).slice(8, -1) === 'Array') {
        let len = array.length, temp;
        for (let i = 0; i < len - 1; i++) {
            let min = array[i];
            for (let j = i + 1; j < len; j++) {
                if (array[j] < min) {
                    temp = min;
                    min = array[j];
                    array[j] = temp;
                }
            }
            array[i] = min;
        }
        return array;
    }
    else {
        return "array is not an Array";
    }
}

console.log(selectionSort([1, 5, 3, 1, 8, 7, 2, 4]))