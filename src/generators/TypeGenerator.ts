import { NodeGenerator } from "../NodeGenerator";
import { NodeVisitor } from "../NodeVisitor";
import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { getObjectSchema, getPropertyName, getSchemaType } from "../Utils";
import { expandN } from "regex-to-strings";

export abstract class TypeGenerator implements NodeGenerator {
    protected abstract isPrimitiveType(): boolean;
    protected abstract getType(): JSONSchema7TypeName | undefined;
    protected abstract getEmptyValue(schema: JSONSchema7, context: NodeVisitor): any;
    protected getDefaultValue(schema: JSONSchema7, context: NodeVisitor): any {
        if (schema.const !== undefined) {
            return schema.const;
        }
        if (schema.default !== undefined) {
            return schema.default;
        }
        if (Array.isArray(schema.enum)) {
            return schema.enum[0];
        }
        if (schema.pattern !== undefined) {
            return expandN(schema.pattern, 1)[0];
        }
        return this.getEmptyValue(schema, context);
    }
    protected isRequired(schema: JSONSchema7, context: NodeVisitor): boolean {
        // check: { properties: { <name>: <SCHEMA> }, required: ["<name>"] }
        const property = getPropertyName(context);
        const parentSchema = getObjectSchema(context);
        return (
            parentSchema === undefined ||
            property === undefined ||
            parentSchema.type !== "object" ||
            !!parentSchema.required?.includes(property)
        );
    }

    handles(schema: JSONSchema7, context: NodeVisitor): boolean {
        const targetType = this.getType();
        const schemaType = getSchemaType(schema, context);
        return schemaType === targetType;
    }

    generate(schema: JSONSchema7, context: NodeVisitor): any {
        if (schema.const !== undefined && context.getConfig().generateConst === "always") {
            return schema.const;
        }
        if (schema.default !== undefined && context.getConfig().generateDefault === "always") {
            return schema.default;
        }
        if (
            this.isRequired(schema, context) ||
            (this.isPrimitiveType() && context.getConfig().generatePrimitives === "always")
        ) {
            return this.getDefaultValue(schema, context);
        }
        return undefined;
    }
}
