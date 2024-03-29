import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interface';

import got from 'got';
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    console.log('MailService options : ', options);
    // this.sendEmail('ypd03008@naver.com', 'hello doyoung', '테스트 메일임');
    // this.sendEmail('testing', 'test');
    // this.sendVerificationEmail('ypd03008@naver.com', '7777');
  }

  private async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ) {
    const form = new FormData();
    form.append('from', `Excited User <mailgun@${this.options.domain}>`);
    form.append('to', `ypd03008@naver.com`);
    form.append('subject', subject);
    form.append('template', template);
    // form.append('v:username', 'nuber-eats username');
    // form.append('v:code', 'nuber-eats code');
    emailVars.forEach(eVar => form.append(`v:${eVar.key}`, eVar.value));
    try {
      const response = await got(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      console.log(response.body);
    } catch (error) {
      console.log(error);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email(Nuber-Eats)', 'nuber-eats', [
      { key: 'username', value: email }, // to
      { key: 'code', value: code }, // code
    ]); // template : nuber-eats
  }
}
