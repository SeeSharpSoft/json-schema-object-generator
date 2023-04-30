import { NodeVisitor } from "../NodeVisitor";
import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { Config } from "../Config";
import { TypeGenerator } from "./TypeGenerator";

export class ObjectGenerator extends TypeGenerator<NonNullable<unknown>> {
  protected getType(): JSONSchema7TypeName {
    return "object";
  }

  generate(schema: JSONSchema7, visitor: NodeVisitor): NonNullable<unknown> {
    let obj = super.generate(schema, visitor);
    if (obj !== undefined) {
      obj = this.applySchema(
        {
          ...obj,
          ...this.generateProperties(schema, visitor),
        },
        schema,
        visitor.getConfig()
      );
    }
    return obj;
  }

  protected generateProperties(schema: JSONSchema7, visitor: NodeVisitor): NonNullable<unknown> {
    const result: any = {};
    for (const key of Object.keys(schema.properties || {})) {
      result[key] = visitor.generate("properties/" + key);
    }
    return result;
  }

  protected applySchema(target: any, schema: JSONSchema7, config: Config): NonNullable<unknown> {
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

  protected getEmptyValue(schema: JSONSchema7, visitor: NodeVisitor): NonNullable<unknown> {
    return {};
  }

  protected isPrimitiveType(): boolean {
    return false;
  }
}
