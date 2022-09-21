import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';


export const RawHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();

        const RawHeaders = req.rawHeaders;
        
        if (!RawHeaders)
            throw new InternalServerErrorException('User not found ( request )');



        return RawHeaders;
    }
);