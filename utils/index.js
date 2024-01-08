import fs from "fs";

function extractUniqueItems(array2D) {
  const uniqueItems = new Set();

  array2D.forEach((innerArray) => {
    innerArray.forEach((item) => {
      uniqueItems.add(Number(item));
    });
  });

  return [...uniqueItems];
}

function parser(inputPath) {
  const data = fs.readFileSync(inputPath, "utf8");
  const linesExceptFirst = data.split("\n").slice(1);
  const linesArr = linesExceptFirst.map((line) => line.split(","));
  return linesArr;
}

function getColumnFromCSV(array, startIndex, endIndex) {
  return array.map((innerArray) => innerArray.slice(startIndex, endIndex));
}

export { extractUniqueItems, getColumnFromCSV, parser };
