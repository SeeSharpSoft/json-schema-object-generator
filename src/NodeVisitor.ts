import { NodeGenerator } from "./NodeGenerator";
import { JSONSchema7 } from "json-schema";
import { ResolvedConfig } from "./Config";
import { getRefPath } from "./Utils";

export interface NodeVisitor {
  generate(path: string): any;

  getConfig(): ResolvedConfig;

  getSchema(path?: string): JSONSchema7;
  getPath(): string;
}

interface TraceableNodeVisitor {
  getLocalPath(): string;
  getRootSchema(): JSONSchema7;
}

export abstract class BaseNodeVisitor implements NodeVisitor, TraceableNodeVisitor {
  generate(path: string, replaceParent = false): any {
    const visitor = new SubNodeVisitor(this, path);
    return this.getNodeGenerator().generate(visitor.getSchema(), visitor);
  }

  private resolveSchema(schema: any, property: string): JSONSchema7 | undefined {
    let currentSchema = schema;
    if (property !== undefined && property !== null && property !== "") {
      currentSchema =
        currentSchema !== undefined && typeof currentSchema === "object" ? currentSchema[property] : undefined;
    }
    if (currentSchema && currentSchema.$ref !== undefined) {
      currentSchema = {
        ...this.getSchema(getRefPath(<string>currentSchema.$ref)),
        ...currentSchema,
        $ref: undefined,
        $id: currentSchema.$ref,
      };
    }
    return currentSchema;
  }

  getSchema(path?: string): JSONSchema7 {
    return this.trace(path).reduce(
      (schema: any, currentPath) => this.resolveSchema(schema, currentPath),
      this.getRootSchema()
    );
  }

  trace(path?: string): string[] {
    let targetPath = this.getPath();
    if (path) {
      if (path.startsWith("/")) {
        targetPath = path.substring(1);
      } else {
        targetPath += "/" + path;
      }
    }

    return targetPath
      .split("/")
      .filter((currentPath) => currentPath !== ".")
      .reduce((prevPaths: string[], currentPath) => {
        if (currentPath === "..") {
          prevPaths.pop();
        } else {
          prevPaths.push(currentPath);
        }
        return prevPaths;
      }, []);
  }

  abstract getConfig(): ResolvedConfig;

  abstract getRootSchema(): JSONSchema7;

  abstract getLocalPath(): string;

  abstract getNodeGenerator<T>(): NodeGenerator<T>;

  abstract visited(path: string): boolean;

  getPath(): string {
    return this.getLocalPath();
  }
}

class SubNodeVisitor extends BaseNodeVisitor {
  protected readonly relativePath: string;
  protected readonly absolutePath: string;

  constructor(protected readonly parentVisitor: BaseNodeVisitor, path: string) {
    super();
    if (path.startsWith("/")) {
      this.absolutePath = path;
      if (parentVisitor instanceof SubNodeVisitor) {
        this.relativePath = parentVisitor.relativePath;
        this.parentVisitor = parentVisitor.parentVisitor;
      } else {
        this.relativePath = "";
      }
    } else {
      this.absolutePath = this.parentVisitor.getLocalPath() + "/" + path;
      this.relativePath = path;
    }
    if (this.parentVisitor.visited(this.getLocalPath())) {
      throw new Error("circular reference detected: " + this.getLocalPath());
    }
  }

  getLocalPath(): string {
    return this.absolutePath;
  }

  getPath(): string {
    return this.parentVisitor.getPath() + (this.relativePath ? this.relativePath + "/" : "");
  }

  getNodeGenerator<T>(): NodeGenerator<T> {
    return this.parentVisitor.getNodeGenerator();
  }

  getRootSchema(): JSONSchema7 {
    return this.parentVisitor.getRootSchema();
  }

  visited(path: string): boolean {
    return path === this.getLocalPath() || this.parentVisitor.visited(path);
  }

  getConfig(): ResolvedConfig {
    return this.parentVisitor.getConfig();
  }
}
