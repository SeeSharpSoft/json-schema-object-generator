import { readFileSync, writeFileSync } from "fs";
import { JsonGenerator } from "../src";
import Ajv from "ajv";
import addFormats from "ajv-formats";

export function assertGeneratedJsonObject(relativePath: string): void {
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

const validator = new Ajv({ strict: false });
addFormats(validator);

export function assertValidityOfJsonObject(relativePath: string, options?: Record<string, any>): void {
    const basePath = __dirname + "/validations/" + relativePath;
    const schema = JSON.parse(readFileSync(basePath + "/schema.json", "utf8"));

    const jsonGenerator = new JsonGenerator(schema);
    const generatedObject = jsonGenerator.generate();
    // const generatedObject = JSON.parse(readFileSync(basePath + "/object.json", "utf8"));

    let localValidator = validator;
    if (options) {
        localValidator = new Ajv(options);
        addFormats(localValidator);
    }
    const validate = localValidator.compile(schema);
    const valid = validate(generatedObject);

    expect(localValidator.errors).toBeNull();
    expect(valid).toBeTruthy();
}
