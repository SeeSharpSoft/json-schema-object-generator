import { assertValidJsonObject } from "./utils";
import { readdirSync } from "fs";

describe.each(
    readdirSync(__dirname + "/validations/", { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
)("%s/schema.json generates", (relativePath) => {
    test(`${relativePath}/object.json`, () => assertValidJsonObject(relativePath));
});
