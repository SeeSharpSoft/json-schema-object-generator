import { NodeGenerator } from "../NodeGenerator";
import { NodeVisitor } from "../NodeVisitor";
import { JSONSchema7 } from "json-schema";
import { getPrioritizedSchemaIndex } from "../Utils";

export class AnyOfGenerator implements NodeGenerator {
    handles(schema: JSONSchema7, visitor: NodeVisitor): boolean {
        return Array.isArray(schema.anyOf);
    }

    generate(schema: JSONSchema7, visitor: NodeVisitor): any {
        const availableSchemas = <Array<JSONSchema7>>schema.anyOf;
        const prioritizedSchemaIndex = getPrioritizedSchemaIndex(availableSchemas, visitor);
        return visitor.generate("anyOf/" + prioritizedSchemaIndex);
    }
}
