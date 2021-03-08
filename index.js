'use strict';

let arr = [3, 5, 6, 2, 7, 9, 1, 3, 5, 7, 8, 4],
  sortArr = arr.sort((a, b) => b - a),
  sum = arr.reduce((acc, item) => acc + item, 0),
  halfSum = sum / 2,
  frstArr = [],
  frstArrSum = 0,
  secArr = [],
  secArrSum = 0;

// let addDB = () => {
//   fetch('/db.json')
//     .then(res => res.json())
//     .then(data => data)
//     .catch((e) => console.error(e));
// }



// fetch('https://jsonplaceholder.typicode.com/posts')
//   .then((response) => response.json())
//   .then((posts) => {
//     const result = {};
//     for (let item of posts) {
//       result[item.id] = item.title;
//     }
//     console.log(result);
//   });


const upload = document.querySelector('#upload');
upload.addEventListener('change', function (e) {
  try {
    const upload = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (function (file) {
      return function (e) {
        let json = JSON.parse(e.target.result);
        // выводим результат в консоль
        console.log(json);
      }
    })(upload));
    reader.readAsText(upload);
  }
  catch (ex) {
    console.log(ex);
  }
});


let url = '/db.json';

async function fetchData() {
  let response = await fetch(url);
  let commits = await response.json();
  for (let key in commits) {
    console.log(key, 'value:', commits[key])
  }
}

fetchData()



function pushItem(arr, item) {
  arr.push(item);
}

function addSum(acc, item) {
  acc = acc + item;
}

for (let i = 0; i < sortArr.length; i++) {
  if (frstArrSum + sortArr[i] <= halfSum) {
    frstArrSum += sortArr[i];
    pushItem(frstArr, sortArr[i]);
  } else {
    secArrSum += sortArr[i];
    pushItem(secArr, sortArr[i]);
  }
}

document.querySelector('#sum').innerHTML = sum;
document.querySelector('#sortArr').innerHTML = `sort arr: ${sortArr}`;
document.querySelector('#halfSum').innerHTML = halfSum;
document.querySelector('#frstArrSum').innerHTML = frstArrSum;
document.querySelector('#frstArr').innerHTML = frstArr;
document.querySelector('#secArrSum').innerHTML = secArrSum;
document.querySelector('#secArr').innerHTML = secArr;
document.querySelector('#data').innerHTML = data;
