/* 
const arr = ['Laurence', 'Linda', 'Joe', 'Jane'];
console.log(arr);

console.log("---> for");
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

console.log("---> while");
let i = 0;
while (i < arr.length) {
    console.log(arr[i]);
    i++;
}

console.log("---> forEach");
arr.forEach((item, index, array) => {
    console.log(item);
    //console.log(index);
    //console.log(array);
})

console.log("---> map");
const arr1 = arr.map((item, index) => {
    console.log(item);
    return `${index} - ${item}`;
})

console.log("---> filter");
const arr2 = arr.filter((item) => {
    console.log(item);
    return item;
})
*/

/*
const arr = ['first', 'secont'];
arr.push('end push'); //add to the end of the array
arr.shift(); //remove first item of the array
arr.pop(); //remove the last item of the array
arr.unshift('start unshift'); //add first item in the array
console.log(arr);

const str1 = arr.toString(); //convert array to string
console.log(str1);

const str2 = arr.join(' - '); //convert array to string with onption to split the elements with symbols
console.log(str2);
*/

/*const arr = ['Laurence', 'Linda', 'Joe', 'Jane', 4, false, 100];
console.log(arr);

const arr1 = arr.map((item, index, array) => {
    const temp = `${index} ${item}`;
    return temp;
})
console.log(arr1);

const arr2 = [1, 2, 3, 4, 5];
console.log(arr2);
const arr3 = arr2.map(item => item * 2);
console.log(arr3);

const arr4 = arr2.map(callback1);
console.log(arr4);
function callback1(item) {
    return item * 2;
}

const arr5 = [
    { first: "Laurence", last: "Svekis" },
    { first: "Testy", last: "Ned" },
    { first: "Sam", last: "Pajk" }
]
console.log(arr5);

const arr6 = arr5.map(({ first, last }) => {
    console.log(first, last);
    //return `${first} ${last}`;
    return { user: `${first} ${last}` } //return obj
})
console.log(arr6);
*/