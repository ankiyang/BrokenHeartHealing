function insertionSort(array){
    if (Object.prototype.toString.call(array).slice(8, -1) === 'Array') {
        for (let i = 1; i < array.length; i++) {
            const key = array[i];
            let j = i - 1;
            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                j --;
            }
            array[j + 1] = key;
        }
        return array;
    }
    else {
        return 'array is not an Array!';
    }
}

console.log(insertionSort([6, 5, 3, 1, 8, 7, 2, 4]))