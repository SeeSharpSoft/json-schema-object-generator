import { assertGeneratedJsonObject, assertValidityOfJsonObject } from "./utils";
import { readdirSync } from "fs";

describe.each(
    readdirSync(__dirname + "/validations/", { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .filter((dirname) => {
            switch (dirname) {
                // contain date/time definitions or other dynamic values (e.g. strings with minLength)
                case "string-variants":
                case "import-internal":
                case "type-date":
                case "type-date-annotation":
                    return false;
                default:
                    return true;
            }
        })
)("%s - the generated object is equal to", (relativePath) => {
    test(`${relativePath}/object.json`, () => assertGeneratedJsonObject(relativePath));
});

describe.each(
    readdirSync(__dirname + "/validations/", { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
)("%s - the generated object is valid with respect to", (relativePath) => {
    test(`${relativePath}/schema.json`, () => assertValidityOfJsonObject(relativePath));
});
