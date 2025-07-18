import { URPC } from "@unilab/urpc";
import { Plugin } from "@unilab/urpc-core";
import { TodoEntity } from "@/entities/todo";
import { Logging } from "@unilab/urpc-core/middleware";
import { IndexedDBAdapter } from "@unilab/urpc-adapters";
import { MastraClientPlugin } from "@unilab/mastra-client-plugin";

export function initUrpcClient() {
  const TodoPlugin: Plugin = {
    entities: [TodoEntity],
  };
  URPC.init({
    // local urpc server
    plugins: [TodoPlugin, MastraClientPlugin()],
    middlewares: [Logging()],
    entityConfigs: {
      todo: {
        defaultSource: "indexeddb",
      },
    },
    globalAdapters: [IndexedDBAdapter],

    // remote urpc server
    baseUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api`,
    timeout: 10000,
  });
}
