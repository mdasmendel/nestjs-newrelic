import { Injectable } from '@nestjs/common';
import {
  addCustomAttribute,
  noticeError,
} from "newrelic";

@Injectable()
export class ApmService {
  public captureError(error: Error): void {
    noticeError(error);
  }
  public setUserContext(
    id?: string | number,
    email?: string,
    username?: string,
  ): void {
    if(id) {
      addCustomAttribute('id', id)
    }
    if(email) {
      addCustomAttribute('email', email)
    }
    if(username) {
      addCustomAttribute('username', username)
    }
  }
}
