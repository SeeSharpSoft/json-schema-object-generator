import { readFileSync, writeFileSync } from "fs";
import { JsonGenerator } from "../src";

export function assertValidJsonObject(relativePath: string): void {
    const basePath = __dirname + "/validations/" + relativePath;
    const schema = JSON.parse(readFileSync(basePath + "/schema.json", "utf8"));
    let expectedObject = undefined;
    try {
        expectedObject = JSON.parse(readFileSync(basePath + "/object.json", "utf8"));
    } catch (ex) {
        // generate
    }

    const jsonGenerator = new JsonGenerator(schema);
    const generatedObject = jsonGenerator.generate();

    if (expectedObject === undefined) {
        expectedObject = generatedObject;
        writeFileSync(basePath + "/object.json", JSON.stringify(generatedObject));
    }

    expect(JSON.stringify(generatedObject)).toEqual(JSON.stringify(expectedObject));
}
