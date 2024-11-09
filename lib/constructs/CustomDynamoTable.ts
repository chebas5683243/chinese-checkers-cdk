import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

interface TableConfig {
  partitionKeyName?: string;
  partitionKeyType?: dynamodb.AttributeType;
  sortKeyName?: string;
  sortKeyType?: dynamodb.AttributeType;
  indexKeyName?: string;
  indexKeyType?: dynamodb.AttributeType;
  globalIndexes?: {
    partitionKeyName: string;
    partitionKeyType?: dynamodb.AttributeType;
    sortKeyName?: string;
    sortKeyType?: dynamodb.AttributeType;
  }[];
}

interface CustomDynamoDbTableProps {
  id: string;
  config: TableConfig;
}

export class CustomDynamoDbTable extends Construct {
  public table: dynamodb.Table;

  constructor(
    scope: Construct,
    private props: CustomDynamoDbTableProps,
  ) {
    super(scope, `${props.id}Table`);

    this.table = this.createTable(props.config);
  }

  private createTable(config: TableConfig) {
    const table = new dynamodb.Table(this, this.props.id, {
      tableName: this.props.id,
      partitionKey: {
        name: config.partitionKeyName || "id",
        type: config.partitionKeyType || dynamodb.AttributeType.STRING,
      },
      sortKey: config.sortKeyName
        ? {
            name: config.sortKeyName,
            type: config.sortKeyType || dynamodb.AttributeType.STRING,
          }
        : undefined,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    if (config.indexKeyName) {
      table.addLocalSecondaryIndex({
        indexName: `${config.indexKeyName}Index`,
        sortKey: {
          name: config.indexKeyName,
          type: config.indexKeyType || dynamodb.AttributeType.STRING,
        },
      });
    }

    config.globalIndexes?.forEach((index) => {
      table.addGlobalSecondaryIndex({
        indexName: `${index.partitionKeyName}Index`,
        partitionKey: {
          name: index.partitionKeyName,
          type: index.partitionKeyType || dynamodb.AttributeType.STRING,
        },
        sortKey: index.sortKeyName
          ? {
              name: index.sortKeyName,
              type: index.sortKeyType || dynamodb.AttributeType.STRING,
            }
          : undefined,
      });
    });

    return table;
  }
}
