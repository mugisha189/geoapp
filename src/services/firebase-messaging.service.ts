// src/app/services/firebase-messaging.service.ts
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';

@Injectable()
export class FirebaseMessagingService {

  constructor(    private db: AngularFireDatabase, private angularFireMessaging: AngularFireMessaging) {

  }

  // Initialize Firebase Cloud Messaging
  requestPermission() {
    this.angularFireMessaging.requestToken.pipe(take(1)).subscribe(
      (token) => {
        // Save the token to Firebase Realtime Database
        this.saveToken(token);
      },
      (error) => {
        console.error('Unable to get permission to notify.', error);
      }
    );
  }

  // Save the FCM token to Firebase Realtime Database
  private saveToken(token: string): void {
    const userId = 'your_user_id'; // Replace with your user ID or logic
    this.db.object(`fcmTokens/${userId}`).set(token);
  }

  receiveMessages() {
    this.angularFireMessaging.messages.subscribe((message) => {
      console.log('Received message:', message);
      // Handle the incoming message and display a notification
    });
  }
}
