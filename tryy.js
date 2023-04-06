// let link = 'http://localhost:3000/dashboard/show?date=2023-05-07';
// let year = link.split('date')[1].split('-')[0].slice(1);
// console.log(year);

const removeEnds = (str) => str.split('').slice(1, str.length - 1);
console.log(removeEnds("seirocks"));