import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/operator/map';
import { AngularFireDatabase } from "@angular/fire/database";
import { Events } from "ionic-angular";
import { RestProvider } from "../rest/rest";


@Injectable()
export class FirebaseProvider {

  public lastMessages: any = [];

  //Observable Messages
  private messages = new BehaviorSubject<any>(0);
  public messages$ = this.messages.asObservable();

  setMessages(value): void {
    this.messages.next(value);
  }

  //Observable Last Messages
  private last_messages = new BehaviorSubject<any>(0);
  public last_messages$ = this.last_messages.asObservable();

  setLastMessages(value): void {
    this.last_messages.next(value);
  }

  //Observable Buddies
  private buddies = new BehaviorSubject<any>(0);
  public buddies$ = this.buddies.asObservable();

  setBuddies(value): void {
    this.buddies.next(value);
  }

  //Observable BuddiesChat
  // private buddies_chat = new BehaviorSubject<any>(0);
  // public buddies_chat$ = this.buddies_chat.asObservable();
  //
  // setBuddiesChat(value): void {
  //   this.buddies_chat.next(value);
  // }

  //Observable Categories
  private categories = new BehaviorSubject<any>(0);
  public categories$ = this.categories.asObservable();

  setCategories(value): void {
    this.categories.next(value);
  }

  //Observable Notifications
  private notifications = new BehaviorSubject<any>(0);
  public notifications$ = this.notifications.asObservable();

  setNotifications(value): void {
    this.notifications.next(value);
  }

  constructor(public db: AngularFireDatabase, public events: Events, public rest: RestProvider) {
  }


  getMessages(user, user_chat) {
    return this.db.list("/chat/" + user.id + "/users/" + user_chat.id + "/messages").valueChanges();
  }

  getNotifications(user) {
    return this.db.list("/chat/" + user.id + "/notifications/").valueChanges();
  }

  getLastMessage(user, list) {
    let temp;
    let buddymessages = [];
    for (var i = 0; i < list.length; i++) {
      this.db.database.ref("/chat/" + user.id + "/users/" + list[i] + "/messages/").orderByChild("timestamp").limitToLast(1).on('value', (snapshot) => {
        temp = snapshot.val();
        for (var tempkey in temp) {
          buddymessages.push({
            "id": temp[tempkey].user_id,
            "message": temp[tempkey].message,
            "send": temp[tempkey].send,
            "read": temp[tempkey].read
          });
        }
      });
    }
    this.setLastMessages(buddymessages);
  }

  getBuddies(user, user_chat = false) {
    // return this.db.list("/chat/" + user.id + "/user_chats").valueChanges();
    let temp;
    let buddies = [];
    var list = [];
    this.db.database.ref("/chat/" + user.id + "/users").orderByChild("last").on('child_added', (snapshot) => {
      temp = snapshot.key;
      buddies.push(temp);
    });
    for (var i = 0; i < buddies.length; i++) {
      list.push(buddies[i]);
    }
    if (list.length > 0) {
      this.rest.getBuddies(list.slice().reverse());
    }
    //this.setBuddies(list.slice().reverse());
  }

  timeBuddies(user, user_chat, time, block = false) {
    this.db.database.ref("/chat/" + user.id + "/users/" + user_chat.id).child('last').set(time);
    if (block) this.db.database.ref("/chat/" + user_chat.id + "/users/" + user.id).child('last').set(time);

    return 'ok';
  }

  newMessage(user, message, received) {
    console.log("firebase saving");
    return this.db.database.ref("/chat/" + user.id + "/users/" + received.id + "/messages").child(message.timestamp).set(message).then(() => {
      console.log('Message saved successfully.');
    })
      .catch((error) => {
        console.error('Error saving message:', error);
      });
  }

  newNotification(user, message, buddie) {
    return this.db.database.ref("/chat/" + buddie.id + "/notifications/").child(user.id).set(message);
  }

  deleteNotification(user, buddie) {
    return this.db.database.ref("/chat/" + user.id + "/notifications/").child(buddie.id).remove();
  }

  deleteChat(user, user_chat) {
    return this.db.database.ref("/chat/" + user.id + "/users/").child(user_chat.id).remove();
  }

  // blockUser(user, user_chat, block) {
  //   this.db.database.ref("/chat/" + user.id + "/users/" + user_chat.id).child('block').set(block);
  //   this.db.database.ref("/chat/" + user_chat.id + "/users/" + user.id).child('block').set(block);
  // }

}
