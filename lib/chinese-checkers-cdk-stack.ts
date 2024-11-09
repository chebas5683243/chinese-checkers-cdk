import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CustomDynamoDbTable } from './constructs/CustomDynamoTable';

export class ChineseCheckersCdkStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createDynamoTables();
  }

  private createDynamoTables() {
    const playersTable = new CustomDynamoDbTable(this, {
      id: "Players",
      config: {
        partitionKeyName: "gameId",
      },
    });

    const gamesTable = new CustomDynamoDbTable(this, {
      id: "Games",
      config: {
        partitionKeyName: "id",
      },
    });
    
    const turnsTable = new CustomDynamoDbTable(this, {
      id: "Turns",
      config: {
        partitionKeyName: "gameId",
        sortKeyName: "order",
      },
    });

    cdk.Tags.of(playersTable).add("project", "chinese-checkers");
    cdk.Tags.of(gamesTable).add("project", "chinese-checkers");
    cdk.Tags.of(turnsTable).add("project", "chinese-checkers");
  }
}
