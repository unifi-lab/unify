import { getFullTableName, PGStorage } from "../pg";
import { DatabaseDefaultValue, SourceConfig } from "@unify/core";

export async function createPgTablesFromConfig(
  sourceConfigList: SourceConfig[],
  connectionString: string
) {
  if (!connectionString) {
    console.error(
      "❌ DATABASE_URL environment variable is required or connectionString parameter must be provided"
    );
    process.exit(1);
  }

  console.log("🚀 Initializing database tables for configuration...");

  const pgStorage = new PGStorage({
    connectionString: connectionString,
  });

  try {
    for (const config of sourceConfigList) {
      const sourceId = config.id;
      console.log(`\nProcessing configuration: ${sourceId}`);

      for (const [entityName, entityConfig] of Object.entries(
        config.entities
      )) {
        if (entityConfig.table) {
          const schema = entityConfig.table.schema;
          const tableName = entityConfig.table.name;
          const fullTableName = getFullTableName({
            sourceId,
            tableName,
            schema,
          });

          const tableExists = await pgStorage.tableExists({
            sourceId,
            tableName,
            schema,
          });
          if (tableExists) {
            console.log(`⚠️  Table already exists, skipping: ${fullTableName}`);
            continue;
          }

          console.log(`Creating table for entity: ${entityName}`);

          const columns: Record<
            string,
            {
              type: string;
              nullable?: boolean;
              unique?: boolean;
              default?: DatabaseDefaultValue;
            }
          > = {};

          Object.entries(entityConfig.table.columns).forEach(
            ([colName, colConfig]) => {
              // Handling Default Values, Especially AUTO_INCREMENT Conversion to PostgreSQL Compatible Formats
              let defaultValue = colConfig.default;
              if (colConfig.default === "AUTO_INCREMENT") {
                // PostgreSQL does not support AUTO_INCREMENT, you need to use the SERIAL type or IDENTITY
                //  This is set to undefined to allow the SERIAL type to handle self-incrementation.
                defaultValue = undefined;
              } else if (colConfig.default === "NOW()") {
                // Using CURRENT_TIMESTAMP or Keeping NOW() in PostgreSQL
                defaultValue = "CURRENT_TIMESTAMP";
              }

              columns[colName] = {
                type: mapColumnType(
                  colConfig.type,
                  colConfig.default === "AUTO_INCREMENT"
                ),
                nullable: colConfig.nullable !== false,
                unique: colConfig.unique ?? false,
                default: defaultValue,
              };
            }
          );

          try {
            await pgStorage.createTable({
              sourceId,
              schema,
              tableName,
              columns,
            });

            console.log(`✅ Table created: ${fullTableName}`);
          } catch (createError: any) {
            if (
              createError.message &&
              createError.message.includes("already exists")
            ) {
              console.log(
                `⚠️  Table or related objects already exist, skipping: ${fullTableName}`
              );
            } else {
              throw createError;
            }
          }
        }
      }
    }

    console.log("\n✅ All database tables initialized successfully!");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    process.exit(1);
  } finally {
    await pgStorage.close();
  }
}

function mapColumnType(type: string, isAutoIncrement: boolean = false): string {
  if (isAutoIncrement) {
    if (type.toLowerCase() === "integer") {
      return "SERIAL";
    } else if (type.toLowerCase() === "bigint") {
      return "BIGSERIAL";
    }
  }

  switch (type.toLowerCase()) {
    case "integer":
      return "INTEGER";
    case "bigint":
      return "BIGINT";
    case "varchar":
      return "VARCHAR(255)";
    case "text":
      return "TEXT";
    case "timestamp":
      return "TIMESTAMP";
    case "boolean":
      return "BOOLEAN";
    case "decimal":
      return "DECIMAL";
    case "float":
      return "FLOAT";
    case "json":
      return "JSON";
    case "jsonb":
      return "JSONB";
    case "uuid":
      return "UUID";
    default:
      return "VARCHAR(255)";
  }
}
