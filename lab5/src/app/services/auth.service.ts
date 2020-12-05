import {Injectable, NgZone} from '@angular/core';
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
import {User} from "./user.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";

//import user interface

@Injectable({providedIn: 'root'})
export class AuthService {
  user$: Observable<User>;// user document, dynamic, type to User


  registerForm = new FormGroup({
    displayName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })



  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private ngZone: NgZone,
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




// Sign up with email/password
  signUp(user) {
    const {email, password} = user;

    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log({...result.user, ...user})
        this.updateUserData({...result.user, ...user});
        this.sendVerificationEmail(); // send verification email
      }).catch((error) => {
      window.alert(error.message)
    })
  }

  async sendVerificationEmail() {
    (await this.afAuth.currentUser).sendEmailVerification().then(() => {
      window.alert('You must verify your email before you can log in. Please check your email');
    })
  }

  isEmailVerified() {

  }

  // Sign in
  signIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user.emailVerified !== true) {
          this.sendVerificationEmail();
        } else {
          this.ngZone.run(() => {
            this.router.navigate(['/dashboard']);
          });
        }
        this.updateUserData(result.user)
      }).catch((error) => {
        window.alert(error.message)
      })
  }

}
