import { createNodeGenerator, NodeGenerator } from "./NodeGenerator";
import { BaseNodeVisitor } from "./NodeVisitor";
import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { Config, DEFAULT_CONFIG, ResolvedConfig } from "./Config";

export class JsonGenerator {
    protected readonly config: ResolvedConfig;

    constructor(
        protected readonly schema: JSONSchema7,
        config?: Config,
        protected readonly nodeGenerator: NodeGenerator = createNodeGenerator()
    ) {
        this.config = JsonGenerator.resolveConfig(config);
    }

    static resolveConfig(config: Config = {}): ResolvedConfig {
        const resolvedConfig = <ResolvedConfig>{
            ...DEFAULT_CONFIG,
            ...config,
        };
        resolvedConfig.fallbackType = <JSONSchema7TypeName>Object.entries(resolvedConfig.typePriorities).reduce(
            (current, entry) => {
                const [type, priority] = entry;
                if (priority < current.min) {
                    current.type = type;
                    current.min = priority;
                }
                return current;
            },
            { min: Number.MAX_SAFE_INTEGER, type: "object" }
        ).type;

        return resolvedConfig;
    }

    generate(path?: string): any {
        const visitor = new RootNodeVisitor(this.schema, this.config, <NodeGenerator>this.nodeGenerator, path);
        return <NodeGenerator>this.nodeGenerator?.generate(this.schema, visitor);
    }
}

class RootNodeVisitor extends BaseNodeVisitor {
    constructor(
        protected readonly schema: JSONSchema7,
        protected readonly config: ResolvedConfig,
        protected readonly nodeGenerator: NodeGenerator,
        protected readonly path: string = "/"
    ) {
        super();
    }

    getRootSchema(): JSONSchema7 {
        return this.schema;
    }

    getNodeGenerator(): NodeGenerator {
        return this.nodeGenerator;
    }

    getConfig(): ResolvedConfig {
        return this.config;
    }

    visited(path: string): boolean {
        return path === this.path;
    }

    getLocalPath(): string {
        return this.path;
    }
}
