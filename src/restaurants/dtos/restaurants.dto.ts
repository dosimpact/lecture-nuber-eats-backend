import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutout,
} from 'src/common/dtos/pagination.dto';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class RestaurantsInput extends PaginationInput {}

@ObjectType()
export class RestaurantsOutput extends PaginationOutout {
  @Field(() => [Restaurant], { nullable: true })
  results?: Restaurant[];
}
