import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interface';

import * as jwt from "jsonwebtoken"

@Injectable()
export class JwtService {
    constructor(@Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions) {
        console.log(options);
    }
    hello() {
        console.log("hello");
    }
    sign(payload: object): string {
        return jwt.sign(payload, this.options.privateKey)
    }
    verify(token:string) : string | object {
        return jwt.verify(token,this.options.privateKey);
    }
}