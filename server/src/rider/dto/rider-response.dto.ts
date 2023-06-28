import { ApiResponseProperty } from "@nestjs/swagger";

export class riderSignupResponseDto {
    @ApiResponseProperty({
        example: '71887020-612d-4050-9d48-06d898e87235',
        format: "v4"
    })
    public id: string;

    @ApiResponseProperty({
        example:"user@gmail.com",
        format: "v4"
    })
    public email:string;
}