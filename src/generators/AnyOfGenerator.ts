import { NodeGenerator } from "../NodeGenerator";
import { NodeVisitor } from "../NodeVisitor";
import { JSONSchema7 } from "json-schema";
import { getPrioritizedSchemaIndex } from "../Utils";

export class AnyOfGenerator implements NodeGenerator {
    handles(schema: JSONSchema7, context: NodeVisitor): boolean {
        return Array.isArray(schema.anyOf);
    }

    generate(schema: JSONSchema7, context: NodeVisitor): any {
        const availableSchemas = <Array<JSONSchema7>>context.getSchema("anyOf");
        const prioritizedSchemaIndex = getPrioritizedSchemaIndex(availableSchemas, context);
        return context.generate("anyOf/" + prioritizedSchemaIndex);
    }
}
