import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { NodeVisitor } from "./NodeVisitor";

function getPrioritizedTypeIndex(
    types: JSONSchema7TypeName[],
    typePriorities: Record<JSONSchema7TypeName, number>
): number {
    if (types.length === 0) {
        return -1;
    }
    let prioritizedIndex = 0;
    let highestPriority = Number.MIN_SAFE_INTEGER;
    types.forEach((type, index) => {
        const typePriority = typePriorities[type];
        if (typePriority > highestPriority) {
            prioritizedIndex = index;
            highestPriority = typePriority;
        }
    });
    return prioritizedIndex;
}

function getPrioritizedType(
    types: JSONSchema7TypeName[],
    typePriorities: Record<JSONSchema7TypeName, number>
): JSONSchema7TypeName {
    return types[getPrioritizedTypeIndex(types, typePriorities)];
}

export function getSchemaType(schema: JSONSchema7, context: NodeVisitor): JSONSchema7TypeName | undefined {
    const typePriorities = <Record<JSONSchema7TypeName, number>>context.getConfig().typePriorities;
    if (schema.hasOwnProperty("type")) {
        if (Array.isArray(schema.type)) {
            return getPrioritizedType(schema.type, typePriorities);
        }
        return <JSONSchema7TypeName>schema.type;
    }
    if (schema.$ref) {
        return getSchemaType(context.getSchema(schema.$ref.substring(1)), context);
    }
    return undefined;
}

export function getPrioritizedSchemaIndex(schemas: JSONSchema7[], context: NodeVisitor): number {
    return getPrioritizedTypeIndex(
        schemas.map((schema) => getSchemaType(schema, context) || context.getConfig().fallbackType),
        <Record<JSONSchema7TypeName, number>>context.getConfig().typePriorities
    );
}

export function getPrioritizedSchema(schemas: JSONSchema7[], context: NodeVisitor): JSONSchema7 {
    const prioritizedIndex = getPrioritizedSchemaIndex(schemas, context);
    return schemas[prioritizedIndex];
}

export function getObjectSchema(context: NodeVisitor): JSONSchema7 | undefined {
    const paths = context.getPath().split("/");
    for (let i = paths.length; i > 0; --i) {
        if (paths[i] === "properties") {
            return context.getSchema("//" + paths.slice(1, i).join("/"));
        }
    }
    return undefined;
}

export function getPropertyName(context: NodeVisitor): string | undefined {
    const paths = context.getPath().split("/");
    for (let i = paths.length; i > 0; --i) {
        if (paths[i] === "properties") {
            return paths[i + 1];
        }
    }
    return undefined;
}

export function getRefPath(refPath: string): string {
    return decodeURIComponent(refPath.substring(1));
}
