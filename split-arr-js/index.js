'use strict';

window.addEventListener('DOMContentLoaded', () => {
  let setOfNumderArrays = {},
    localDB,
    collection = {},
    objectToJSON = {},
    examplesDB = document.querySelectorAll('div[data-db]'),
    enterOutputField = document.querySelector('.enter-output'),
    stepsProcessField = document.querySelector('.steps-list'),
    resultField = document.querySelector('#result'),
    upload = document.querySelector('#upload'),
    saveBlock = document.querySelector('#saveBlock'),
    btnToJSON = document.querySelector('#toJSON'),
    btnReset = document.querySelector('#resetBtn');

  btnToJSON.addEventListener('click', () => {
    let json = JSON.stringify(objectToJSON);
    btnToJSON.style = 'pointer-events: none';

    if (Object.keys(objectToJSON).length > 0) {
      addNoticeAfterConvert('filled');
      localStorage.setItem('json', json);
    } else {
      addNoticeAfterConvert('empty');
    }

    deletePropsFromObj(objectToJSON);
  });

  function addNoticeAfterConvert(option) {
    let p = document.createElement('p');
    p.classList.add('to-json-prompt');
    if (option === 'filled') {
      p.innerHTML = 'Local storage has updated';
    } else {
      p.innerHTML = 'Select some JSON above';
      p.classList.add('error');
    }

    setTimeout(() => {
      saveBlock.appendChild(p);
    }, 600);
    setTimeout(() => {
      saveBlock.removeChild(p);
      btnToJSON.style = 'pointer-events: auto';
    }, 3500);
  }

  function deletePropsFromObj(obj) {
    let props = Object.keys(obj);
    for (var i = 0; i < props.length; i++) {
      delete obj[props[i]];
    }
  }

  btnReset.addEventListener('click', () => {
    enterOutputField.innerHTML = '';
    stepsProcessField.innerHTML = '';
    resultField.innerHTML = '';
    deletePropsFromObj(objectToJSON);
    localStorage.clear();
  });

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

  upload.addEventListener('click', () => {
    upload.value = '';
  });

  (function toSelectDB() {
    for (let i = 0; i < examplesDB.length; i++) {
      examplesDB[i].addEventListener('click', (e) => {
        let receivedPath = e.target.dataset.db;
        createPathToDB(receivedPath);
      });
    }
  })();

  function createPathToDB(path) {
    localDB = `/db/${path}.json`;
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
  }

  function equalizeArray(sortArr, half) {
    let firstSum = 0,
      secondSum = 0,
      firstPartArr = [],
      secondPartArr = [];

    let count = 0;

    for (let i = 0; i < sortArr.length; i++) {
      firstSum === 0 ? (firstSum = sortArr[0]) : null;
      firstPartArr.length === 0 ? firstPartArr.push(sortArr[0]) : null;
      count++;

      (() => {
        if (firstSum !== half) {
          for (let j = 1; j < sortArr.length; j++) {
            if (firstSum + sortArr[j] !== half) {
              continue;
            } else {
              firstPartArr.push(sortArr[j]);
              firstSum += sortArr[j];
              return createResultObj();
            }
          }

          firstSum += sortArr[sortArr.length - count];
          firstPartArr.push(sortArr[sortArr.length - count]);
        } else {
          return createResultObj();
        }
      })();
    }

    function createResultObj() {
      firstSum = firstPartArr.reduce((acc, item) => acc + item, 0);
      secondPartArr = sortArr.filter((el) => !firstPartArr.includes(el));
      secondSum = secondPartArr.reduce((acc, item) => acc + item, 0);
      return { firstPartArr, firstSum, secondPartArr, secondSum };
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
    let entriesData = Object.entries(stepsData),
      dataList = document.createElement('ol'),
      forResultObj = {},
      receivedTitle = `<li>Have been received <strong><u>${entriesData.length}</u></strong> object(s)</li>`,
      primeArr = `<li>Which include pure numder arrays with longer than 2:</li>`,
      sortTitle = `<li>Let's sort them:</li>`,
      sumTitle = `<li>Get sum of each:</li>`,
      halfSumTitle = `<li>And also get half of these sum:</li>`,
      resumeTitle = `<li>Then we iterate over the array using two nested loops and a condition, checking at each step the sum of the first element with each in the array until it becomes equal to half, repeating the loop check.</li>`,
      endTitle = `<li>If the sum of the counter and each element being iterated over is not equal to half the sum of the array,
  summing the largest element with the smallest, taking it from the end of the array, and then repeat the check,
  the summed elements are entered into one of the defined arrays, and the rest into another.</li>`,
      roundedSumTitle = `<span>(If the amount isn't odd - round its value down)</span><br>`;

    stepsProcessField.innerHTML = '';

    function addStepsTitle(str) {
      dataList.innerHTML += str;
    }

    addStepsTitle(receivedTitle);

    function addStepsData(prop) {
      for (const [key, value] of entriesData) {
        forResultObj[key] = { ...value.resultEqualObj };
        let arg = value[prop];
        for (let item in value) {
          let i = value[item];
          checkStepsItem(i, arg, item);
        }
      }
    }

    function checkStepsItem(i, arg, iKey) {
      if (iKey === 'sumArr' && i % 2 !== 0) {
        let dataFloor = Math.floor(i);
        i === arg
          ? (dataList.innerHTML += `<strong>${dataFloor}</strong> ${roundedSumTitle}`)
          : null;
      } else if (Array.isArray(i)) {
        i === arg
          ? (dataList.innerHTML += `[<strong>${arg}</strong>]<br>`)
          : null;
      } else {
        i === arg
          ? (dataList.innerHTML += `<strong>${arg}</strong><br>`)
          : null;
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
    addStepsTitle(endTitle);

    renderResult(forResultObj);
    stepsProcessField.appendChild(dataList);
  }

  function renderResult(data) {
    let resultList = document.createElement('ul'),
      entriesData = Object.entries(data);

    resultField.innerHTML = '';
    resultList.classList.add('grid-class');

    function addResultData(data) {
      let count = 0;

      for (let obj in data) {
        let innerObj = data[obj][1];
        resultList.innerHTML += `<li><strong>${data[obj][0]}</strong></li><li>Results:</li>`;
        count++;

        for (let k in innerObj) {
          let setKey = `set_${count}`;
          if (k === 'firstPartArr') {
            objectToJSON[setKey] = innerObj[k];
            count++;
          } else if (k === 'secondPartArr') {
            objectToJSON[setKey] = innerObj[k];
          }
          if (Array.isArray(innerObj[k])) {
            resultList.innerHTML += `<li>${k}:</li><li>[<strong>${innerObj[k]}</strong>]</li>`;
          } else {
            resultList.innerHTML += `<li>${k}:</li><li><strong>${innerObj[k]}</strong></li>`;
          }
        }
      }
    }

    resultField.appendChild(resultList);
    addResultData(entriesData);
  }
});
