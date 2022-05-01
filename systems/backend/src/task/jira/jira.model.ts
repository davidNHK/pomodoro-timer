import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JiraAssignedTask {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  key!: string;

  @Field(() => String)
  keyHtml!: string;

  @Field(() => String)
  img!: string;

  @Field(() => String)
  summary!: string;

  @Field(() => String)
  summaryText!: string;
}
