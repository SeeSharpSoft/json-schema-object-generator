import { readFileSync, writeFileSync } from "fs";
import { JsonGenerator } from "../index";
import Ajv from "ajv";
import addFormats from "ajv-formats";

export function assertGeneratedJsonObject(relativePath: string, dir = "validations"): void {
    const basePath = __dirname + "/" + dir + "/" + relativePath;
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
        writeFileSync(basePath + "/object.json", JSON.stringify(generatedObject, null, 2));
    }

    expect(JSON.stringify(generatedObject, null, 2)).toEqual(JSON.stringify(expectedObject, null, 2));
}

const validator = new Ajv({ strict: false, strictSchema: false, allErrors: false });
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
