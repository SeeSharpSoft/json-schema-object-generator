import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { NodeVisitor } from "../NodeVisitor";
import { TypeGenerator } from "./TypeGenerator";

export class ArrayGenerator extends TypeGenerator {
    protected isRequired(schema: JSONSchema7, context: NodeVisitor): boolean {
        return super.isRequired(schema, context) || schema.minItems !== undefined;
    }

    protected getType(): JSONSchema7TypeName {
        return "array";
    }

    protected getEmptyValue(schema: JSONSchema7, context: NodeVisitor): any {
        const arr = [];
        const items = context.getSchema("items");
        const isArray = Array.isArray(items);
        for (let i = 0; i < (schema.minItems || 0); ++i) {
            arr.push(context.generate("items" + (isArray ? "/" + i : "")));
        }
        return arr;
    }

    protected isPrimitiveType(): boolean {
        return false;
    }
}
