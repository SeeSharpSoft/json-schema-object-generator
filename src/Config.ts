import { JSONSchema7TypeName } from "json-schema";

export type Config = {
    reflectionName?: string;
    reflectionType?: "none" | "property" | "function";
    typePriorities?: Record<JSONSchema7TypeName, number>;
    generatePrimitives?: "required" | "always";
    generateConst?: "required" | "always";
    generateDefault?: "required" | "always";
};

export const DEFAULT_CONFIG: Config = {
    reflectionName: "$schema",
    reflectionType: "none",
    typePriorities: {
        null: 60,
        string: 50,
        number: 40,
        integer: 30,
        boolean: 20,
        array: 10,
        object: 0,
    },
    generatePrimitives: "required",
    generateConst: "required",
    generateDefault: "required",
};

export type ResolvedConfig = Required<Config> & {
    fallbackType: JSONSchema7TypeName;
};
