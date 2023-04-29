import { NodeGenerator } from "../NodeGenerator";
import { NodeVisitor } from "../NodeVisitor";
import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { getObjectSchema, getPropertyName, getSchemaType } from "../Utils";

export abstract class TypeGenerator implements NodeGenerator {
    protected abstract isPrimitiveType(): boolean;
    protected abstract getType(): JSONSchema7TypeName | undefined;
    protected abstract getEmptyValue(schema: JSONSchema7, visitor: NodeVisitor): any;

    protected getDefaultValue(schema: JSONSchema7, visitor: NodeVisitor, generatedValue?: any): any {
        if (schema.const !== undefined) {
            return schema.const;
        }
        if (schema.default !== undefined) {
            return schema.default;
        }
        if (Array.isArray(schema.enum)) {
            return schema.enum[0];
        }
        return generatedValue === undefined ? this.getEmptyValue(schema, visitor) : generatedValue;
    }

    protected isRequired(schema: JSONSchema7, visitor: NodeVisitor): boolean {
        // check: { properties: { <name>: <SCHEMA> }, required: ["<name>"] }
        const property = getPropertyName(visitor);
        const parentSchema = getObjectSchema(visitor);
        return (
            parentSchema === undefined ||
            property === undefined ||
            parentSchema.type !== "object" ||
            !!parentSchema.required?.includes(property)
        );
    }

    handles(schema: JSONSchema7, visitor: NodeVisitor): boolean {
        const targetType = this.getType();
        const schemaType = getSchemaType(schema, visitor);
        return schemaType === targetType;
    }

    generate(schema: JSONSchema7, visitor: NodeVisitor): any {
        if (schema.const !== undefined && visitor.getConfig().generateConst === "always") {
            return schema.const;
        }
        if (schema.default !== undefined && visitor.getConfig().generateDefault === "always") {
            return schema.default;
        }
        if (
            this.isRequired(schema, visitor) ||
            (this.isPrimitiveType() && visitor.getConfig().generatePrimitives === "always")
        ) {
            return this.getDefaultValue(schema, visitor);
        }
        return undefined;
    }
}
