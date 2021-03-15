import { NodeVisitor } from "../NodeVisitor";
import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { Config } from "../Config";
import { TypeGenerator } from "./TypeGenerator";

export class ObjectGenerator extends TypeGenerator {
    protected getType(): JSONSchema7TypeName {
        return "object";
    }

    generate(schema: JSONSchema7, context: NodeVisitor): any {
        let obj = super.generate(schema, context);
        if (obj !== undefined) {
            obj = this.applySchema(
                {
                    ...obj,
                    ...this.generateProperties(schema, context),
                },
                schema,
                context.getConfig()
            );
        }
        return obj;
    }

    protected generateProperties(schema: JSONSchema7, context: NodeVisitor): any {
        const result: any = {};
        for (const key in Object.keys(schema.properties || {})) {
            result[key] = context.generate("properties/" + key);
        }
        return result;
    }

    protected applySchema(target: any, schema: JSONSchema7, config: Config): any {
        switch (config.reflectionType) {
            case "none":
                break;
            case "function":
                target[config.reflectionName || "getSchema"] = () => schema;
                break;
            case "property":
                Object.defineProperty(target, config.reflectionName || "$schema", { value: schema });
                break;
        }
        return target;
    }

    protected getEmptyValue(schema: JSONSchema7, context: NodeVisitor): any {
        return {};
    }

    protected isPrimitiveType(): boolean {
        return false;
    }
}
