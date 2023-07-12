import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Comment } from 'src/app/models/comment';
import { User } from '../models/user';
import { Tag } from '../models/tag';



@Injectable({
  providedIn: 'root'
})
export class CommentData {

  constructor() { }

  getComments(): Observable<Comment[]> {
    // Simulate returning comment data from a comments endpoint
    return of([
        { id: 1, userID: 1, text: "I'd like some parts, please", date: new Date(2023,6,1,11,43) },
        { id: 2, userID: 2, text: "You and me both lol", date: new Date(2023,6,1,12,15) },
        { id: 3, userID: 1, text: "You're waiting on parts, too?", date: new Date(2023,6,1,12,16) },
        { id: 4, userID: 2, text: "Yep. Be cool if they had some sort of tagging system", date: new Date(2023,6,1,12,18) },
        { id: 5, userID: 1, text: "Yeah, that'd be nice", date: new Date(2023,6,1,14,19) },
    ]);
  }

  getUsers(): Observable<User[]> {
    // Simulate returning user data from a users endpoint
    return of([
        {userID: 1, name: 'Kevin'},
        {userID: 2, name: 'Jeff'},
        {userID: 3, name: 'Bryan'},
        {userID: 4, name: 'Gabbey'},
        {userID: 5, name: 'Brad'},
    ]);
  }

  getCurrentUserId(): number {
    // random number representing current user id, for demo purposes
    return 99;
  }

  alertTaggedUsers(tags: Tag[]) {
    // make some api call here with the tag info and relevant commentId
    console.log("tag data to alert users with: ", tags);
  }

}