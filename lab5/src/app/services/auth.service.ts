import {Injectable} from '@angular/core';
import {Router} from "@angular/router";// use to redirect users when they log out
import firebase from 'firebase/app';//we beeennnnnnn using firebase
import {AngularFireAuth} from "@angular/fire/auth";


//rxjs for control flow for User
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

import {Observable, of} from "rxjs";
import {switchMap} from "rxjs/operators";
import {User} from "./user.model";//import user interface

@Injectable({providedIn: 'root'})
export class AuthService {
  user$: Observable<User>;// user document, dynamic, type to User

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    //define user observable right away in constructor ASAPP
    //set to listen for user from this authState var
    this.user$ = this.afAuth.authState.pipe(
//switch to diff observable in database
      switchMap(user => {
        //if user is defined:call firestore to get user info, else user isnt logged in
        if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges() // convert to observable
        } else {
          return of(null);
        }
      })
    );
  }
//USER LOGIN w/ google auth
  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }
//signout method, waits for angular sign-out method, re-routes user to root page
  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User>= this.afs.doc( `users/${user.uid}`);
//what we  want to receive in db when user logs in
    const data =   {
      uid: user. uid,
      email: user.email,
      name: user.displayName,
      activated: true,
      roles: {
        student: true
      }
    };
//deletes and replaces with update, merge:true only does this for altered info
    return userRef.set(data, {merge: true});
  }

  private checkAuthorization(user: User, allowedRoles: string[]) {
    if (!user) {
      return false;
    }

    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true
      }
    }
    return false;
  }

  //Permissions for student role
isStudent(user: User): boolean {
    const allowed = ['student'];
    return this.checkAuthorization(user, allowed);
}
//for admin role
isAdmin(user: User): boolean {
  const allowed = ['admin'];
  return this.checkAuthorization(user, allowed);
}
//for guest role
isGuest(user: User): boolean{
    const allowed = ['guest'];
    return this.checkAuthorization(user, allowed);
}
  //
  // canRead(user: User): boolean {
  //   const allowed =  ['admin', 'guest', 'student'];
  //   return this.checkAuthorization(user, allowed);
  // }
  //
  // canEdit(user: User): boolean {
  //   const allowed =  ['admin', 'student'];
  //   return this.checkAuthorization(user, allowed);
  // }
  // canLogin(user: User): boolean {
  //   const allowed =  ['admin', 'student'];
  //   return this.checkAuthorization(user, allowed);
  // }
  //
  // canAddCourse(user: User): boolean {
  //   const allowed = ['students', 'admin'];
  //   return this.checkAuthorization(user, allowed);
  // }

}
