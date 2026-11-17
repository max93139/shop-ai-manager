import { IsEnum } from 'class-validator';
import { OrderStatus } from '@shop-ai/database';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
