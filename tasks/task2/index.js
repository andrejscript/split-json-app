'use strict';

let setOfNumderArrays = {},
  localDB,
  collection = {},
  examplesDB = document.querySelectorAll('div[data-db]'),
  enterOutputField = document.querySelector('.enter-output'),
  stepsProcessField = document.querySelector('.steps-list'),
  resultField = document.querySelector('#result'),
  upload = document.querySelector('#upload');

upload.addEventListener('change', function (e) {
  try {
    const upload = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      (() => {
        return (e) => {
          let json = JSON.parse(e.target.result);
          let obj = json;
          console.log(obj);
          createSetOfNumberArrays(obj);
          renderIncomeData(obj);
        };
      })(upload)
    );
    reader.readAsText(upload);
  } catch (ex) {
    console.log(ex);
  }
});

(function toSelectDB() {
  for (let i = 0; i < examplesDB.length; i++) {
    examplesDB[i].addEventListener('click', (e) => {
      console.log(e.target.dataset.db);
      let receivedPath = e.target.dataset.db;
      createPathToDB(receivedPath);
    });
  }
})();

function createPathToDB(path) {
  localDB = `/tasks/task2/${path}.json`;
  getDataFetch(localDB);
}

const getDataFetch = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Could not fetch ${url}` + `, received ${res.status}`);
  }

  let data = await res.json();
  await createSetOfNumberArrays(data);
  renderIncomeData(data);
};

function createSetOfNumberArrays(data) {
  let count = 0;

  deletePropsFromObj(setOfNumderArrays);

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length > 2) {
      count++;
      if (getNumbersFromArray(value) !== null) {
        let eachArr = getNumbersFromArray(value);
        setOfNumderArrays['sourceObj' + count] = { eachArr };
      }
    }
  }

  addPropsInObj(setOfNumderArrays);
}

function deletePropsFromObj(obj) {
  let props = Object.keys(obj);
  for (var i = 0; i < props.length; i++) {
    delete obj[props[i]];
  }
}

function getNumbersFromArray(arrays) {
  const numberArr = [];

  arrays.map((item) => {
    if (typeof item === 'number') {
      numberArr.push(item);
    }
  });

  if (numberArr.length > 2) {
    return numberArr;
  } else {
    return null;
  }
}

function addPropsInObj(set) {
  let count = 0;
  deletePropsFromObj(collection);

  for (let key in set) {
    count++;
    let eachObj = set[key], // eachObj = set[key] - {'eachArr': [1, 2, 3, 4, 5, 6, 7 ]}
      sumArr,
      sortArr,
      halfSumArr,
      resultEqualObj;

    for (let arr in eachObj) {
      let primeArr = eachObj[arr]; // eachArr = eachObj[arr] - [1, 2, 3, 4, 5]
      sortArr = primeArr.slice().sort((a, b) => b - a);
      sumArr = primeArr.reduce((acc, item) => acc + item, 0);
      halfSumArr = sumArr / 2;
      halfSumArr % 2 !== 0 ? (halfSumArr = Math.floor(halfSumArr)) : null;
      resultEqualObj = equalizeArray(sortArr, halfSumArr);
      eachObj = { primeArr, sortArr, sumArr, halfSumArr, resultEqualObj };
      collection['obj' + count] = { ...eachObj };
    }
  }
  renderProcessSteps(collection);
  console.log(collection);
}

function equalizeArray(sortArr, halfSumArr) {
  let firstSum = 0,
    secondSum = 0,
    firstPartArr = [],
    secondPartArr = [];

  let count = 0;

  for (let i = 0; i < sortArr.length; i++) {
    firstSum === 0 ? (firstSum = sortArr[0]) : null;
    firstPartArr.length === 0 ? firstPartArr.push(sortArr[0]) : null;
    count++;

    function findElems() {
      if(firstSum !== halfSumArr) {

        for (let j = 1; j < sortArr.length; j++) {
          if (firstSum + sortArr[j] !== halfSumArr) {
            continue;
          } else {
            firstPartArr.push(sortArr[j]);
            firstSum += sortArr[j];
            firstSum = firstPartArr.reduce((acc, item) => acc + item, 0);
            secondPartArr = sortArr.filter( ( el ) => !firstPartArr.includes( el ) );
            secondSum = secondPartArr.reduce((acc, item) => acc + item, 0);
            return {firstPartArr, firstSum, secondPartArr, secondSum}
          }
        }
      
        firstSum += sortArr[sortArr.length - count];
        firstPartArr.push(sortArr[sortArr.length - count]);
      } else {
        return 
      }

    }

    findElems()
  }
  return { firstSum, firstPartArr, secondSum, secondPartArr };
}

function renderIncomeData(data) {
  enterOutputField.innerHTML = '';

  let entriesData = Object.entries(data),
    docType = document.createElement('p'),
    dataLength = document.createElement('p'),
    dataList = document.createElement('ul');

  enterOutputField.appendChild(docType);
  enterOutputField.appendChild(dataLength);
  enterOutputField.appendChild(dataList);

  docType.innerHTML = 'Type: <span>JavaScript Object Notation</span>';
  dataLength.innerHTML += `Containing: <span><u>${entriesData.length}</u> nested objects</span>`;

  for (const [key, value] of entriesData) {
    dataList.innerHTML += `<li><u>${key}</u>: {<span>${value}</span>}</li>`;
  }
}

function renderProcessSteps(stepsData) {
  stepsProcessField.innerHTML = '';

  let entriesData = Object.entries(stepsData),
    dataList = document.createElement('ol'),
    receivedTitle = `<li>Have been received <strong><u>${entriesData.length}</u></strong> object(s)</li>`,
    primeArr = `<li>Which includes pure arrays with longer than 2:</li>`,
    sortTitle = `<li>Let's sort them:</li>`,
    sumTitle = `<li>Get sum of each:</li>`,
    halfSumTitle = `<li>And also get half of these sum:</li>`,
    resumeTitle = `<li>Then iterate over the array by summing the largest element with the rest until it's equal to half by writing the summed elements into one of the arrays and the rest into the other one.</li>`,
    roundedSumTitle = `<span>(If the amount isn't odd - round its value down)</span><br>`;

  function addStepsTitle(str) {
    dataList.innerHTML += str;
  }

  addStepsTitle(receivedTitle);

  function addStepsData(prop) {
    for (const [key, value] of entriesData) {
      let arg = value[prop];

      for (let item in value) {
        let i = value[item];
        checkStepsItem(prop, i, arg);
      }
      renderResult(value.resultEqualObj)
    }
  }

  function checkStepsItem(prop, i, arg) {
    if (prop === 'halfSumArr' && i % 2 !== 0) {
      let dataFloor = Math.floor(i);
      i === arg
        ? (dataList.innerHTML += `<strong>${dataFloor}</strong> ${roundedSumTitle}`)
        : null;
    } else if (Array.isArray(i)) {
      i === arg
        ? (dataList.innerHTML += `[<strong>${arg}</strong>]<br>`)
        : null;
    } else {
      i === arg ? (dataList.innerHTML += `<strong>${arg}</strong><br>`) : null;
    }
  }

  addStepsTitle(primeArr);
  addStepsData('primeArr');
  addStepsTitle(sortTitle);
  addStepsData('sortArr');
  addStepsTitle(sumTitle);
  addStepsData('sumArr');
  addStepsTitle(halfSumTitle);
  addStepsData('halfSumArr');
  addStepsTitle(resumeTitle);

  stepsProcessField.appendChild(dataList);
}

function renderResult(data) {
  resultField.innerHTML = '';

  let resultList = document.createElement('ul');
  let entriesData = Object.entries(data);

  
  // function addStepsTitle(str) {
  //   dataLength.innerHTML += str;
  // }
  
  // addStepsTitle(receivedTitle);
  // resultField.innerHTML += resultList;
  
  function addResultData(data) {
    for (const key in data) {
      
      // let arg = data[value];
      console.log(data[key]);

      resultList.innerHTML += `<li>${data[key]}</li>`
      
      

    }
  }
  resultField.appendChild(resultList);

  addResultData(entriesData)
}
