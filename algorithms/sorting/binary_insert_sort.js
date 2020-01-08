function binaryInsertinoSort(array) {
    if (Object.prototype.toString.call(array).slice(8, -1) === 'Array') {
        for (let i = 1; i < array.length; i++) {
            let key = array[i], left = 0, right = i - 1;
            while (left <= right) {
                let middle = parseInt((left + right) / 2);
                if (key < array[middle]) {
                    right = middle - 1;
                }
                else {
                    left = middle + 1;
                }
            }
            for (let j = i - 1; j >= left; j--) {
                array[j+1] = array[j];
            }
            array[left] = key;
        }
        return array;
    }
    else {
        return "array is not an Array."
    }
}

console.log(binaryInsertinoSort([6, 5, 3, 1, 8, 7, 2, 4]))