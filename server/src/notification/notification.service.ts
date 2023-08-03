import { Injectable } from '@nestjs/common';
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { admin } from 'src/firebase/firebase.admin';

@Injectable()
export class NotificationService {
  /**
   *
   * @param title of notification
   * @param body of notification
   * @param data app will get when it receives the notification
   * @param tokens device tokens
   * @link https://firebase.google.com/docs/cloud-messaging/send-message
   */
  async sendToTokens(
    title: string,
    body: string,
    data: { [key: string]: string },
    tokens: string[],
  ) {
    // const tokens = [
    //   'dBDUqZNNSEC7zGZCtlN-YG:APA91bG81f53YEjok2eIlvjR1c7WdUu1YtKq31SAoz-J5eLA5grR-PSrvmImbv8J6HA50MWcf32cvLv-4mVjeNbxDulJ4RTemXRBfB_a6DLa5Z_fl2lCXcOoW0inLiRwHH_iK934hZXw',
    // ];

    const myMessage: MulticastMessage = {
      tokens: tokens,
      data: data,
      notification: {
        title: title,
        body: body,
      },
    };

    admin
      .messaging()
      .sendEachForMulticast(myMessage)
      .then((response) => {
        if (response.successCount > 0) {
          response.responses.forEach((resp, idx) => {
            if (resp.success) {
              console.log('successfully send to ' + tokens[idx]);
            }
          });
        }

        if (response.failureCount > 0) {
          const failedTokens = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              failedTokens.push(tokens[idx]);
            } else {
            }
          });
          console.log('List of tokens that caused failures: ' + failedTokens);
        }
      });
  }
}
