import { createNodeGenerator, NodeGenerator } from "./NodeGenerator";
import { BaseNodeVisitor } from "./NodeVisitor";
import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { Config, DEFAULT_CONFIG, ResolvedConfig } from "./Config";

export type GeneratorParameter = {
  schema: JSONSchema7;
  config?: Config;
  nodeGenerator?: NodeGenerator<unknown>;
};

function isGeneratorParameter(value: JSONSchema7 | GeneratorParameter): value is GeneratorParameter {
  return "schema" in value;
}

export class Generator {
  protected readonly config: ResolvedConfig;
  protected readonly schema: JSONSchema7;
  protected readonly nodeGenerator: NodeGenerator<unknown>;

  constructor(schema: JSONSchema7);
  constructor(parameter: GeneratorParameter);
  constructor(readonly schemaOrParameter: JSONSchema7 | GeneratorParameter) {
    const { schema, config, nodeGenerator } = isGeneratorParameter(schemaOrParameter)
      ? schemaOrParameter
      : {
          schema: schemaOrParameter,
          config: undefined,
          nodeGenerator: undefined,
        };

    this.schema = schema;
    this.nodeGenerator = nodeGenerator || createNodeGenerator();
    this.config = Generator.resolveConfig(config);
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

  generate<T>(path?: string): T {
    const visitor = new RootNodeVisitor(this.schema, this.config, this.nodeGenerator, path);
    return this.nodeGenerator?.generate(this.schema, visitor) as T;
  }
}

class RootNodeVisitor extends BaseNodeVisitor {
  constructor(
    protected readonly schema: JSONSchema7,
    protected readonly config: ResolvedConfig,
    protected readonly nodeGenerator: NodeGenerator<unknown>,
    protected readonly path: string = "/"
  ) {
    super();
  }

  getRootSchema(): JSONSchema7 {
    return this.schema;
  }

  getNodeGenerator<T>(): NodeGenerator<T> {
    return this.nodeGenerator as NodeGenerator<T>;
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
