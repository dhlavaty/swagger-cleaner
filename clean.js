/* eslint-disable no-console */
// does a 'typeof', but in case
// of an array returns 'array',
// and in case of null returns 'null'
function getType(obj) {
  var objType = typeof obj;
  if (objType === "object") {
    if (Array.isArray(obj)) {
      objType = "array";
    } else {
      if (obj === null) {
        objType = "null";
      }
    }
  }
  return objType;
}

// deletes every object-attribute called 'example'
function removeExample(obj) {
  const objType = getType(obj);

  switch (objType) {
    case "array":
      return obj.map(removeExample);
    case "object": {
      const newObj = {};
      Object.keys(obj).forEach((key) => {
        if (key !== "example") {
          const val = obj[key];
          const newVal = removeExample(val);
          newObj[key] = newVal;
        }
      });
      return newObj;
    }
    case "boolean":
    case "number":
    case "string":
      return obj;
    default:
      // to be sure we handle everything in the swaggerfile
      // we make sure to crash if we find something
      // unexpected
      throw new Error("should not happen");
  }
}

const packageJson = require("./package.json");

if (process.argv.length < 3) {
  console.log(
    `swagger-cleaner ${packageJson.version}
Usage:
       swagger-cleaner <url>
       swagger-cleaner <url> --save-raw raw-file.json
       swagger-cleaner <url> --save-raw raw-file.json --keep-examples
       swagger-cleaner <url> --save-raw raw-file.json > clean.json

Options:
       --keep-examples   Does not remove 'example' nodes from swagger.json; it does remove them by default
       --save-raw FILE   Saves raw swagger.json file prior cleaning to FILE
       `
  );
  return;
}

const fetch = require("node-fetch");
const stableStringify = require("json-stable-stringify");
const assert = require("assert");
const fs = require("fs");

const inputFile = process.argv[2];
fetch(inputFile)
  .then((response) => {
    const rawIndex = process.argv.indexOf("--save-raw");
    if (rawIndex > 0) {
      response
        .clone()
        .buffer()
        .then((buf) => {
          fs.writeFileSync(process.argv[rawIndex + 1], buf);
        });
    }

    return response.json();
  })
  .then((json) => {
    if (process.argv.indexOf("--keep-examples") > 0) {
      return json;
    }
    return removeExample(json);
  })
  .then((inputBody) => {
    // We will sort objects by keys
    var stableSwaggerFile = stableStringify(inputBody);

    // Now it is sorted, but not pretty formated, so we will
    // format it again
    var stableSwaggerFileLoaded = JSON.parse(stableSwaggerFile);

    // Assert just to be sure, everything is there
    assert.deepStrictEqual(inputBody, stableSwaggerFileLoaded);

    console.log(JSON.stringify(stableSwaggerFileLoaded, null, 4));
  });
