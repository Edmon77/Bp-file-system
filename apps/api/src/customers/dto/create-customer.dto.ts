import { IsNotEmpty, IsString } from "class-validator";
export class CreateCustomerDto {
    @IsNotEmpty()
    @IsString()
    shelfId: string;

    @IsNotEmpty()
    @IsString()
    customerId: string;
}