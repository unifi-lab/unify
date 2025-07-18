import {
  DataSourceAdapter,
  EntityConfigs,
  Middleware,
  Plugin,
} from "@unilab/urpc-core";

export interface URPCConfig {
  plugins: Plugin[];
  middlewares?: Middleware<any>[];
  entityConfigs?: EntityConfigs;
  globalAdapters?: (new () => DataSourceAdapter<any>)[];
}
