import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FbAuthResponse, User } from "../../../shared/interface";
import { catchError, Observable, Subject, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})

export class AuthService{

  public error$: Subject<string> = new Subject<string>()

  constructor(public http: HttpClient){}

  get token(): string{
    const expDate = new Date(localStorage.getItem('fb-token-exp'))
    if(new Date() > expDate){
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token')
  }

  login(user: User): Observable<any>{
    user.returnSecureToken = true
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      )
  } // Происходит работа с firebase. Отправляем наши данные в форме входа на сервер и если всё окей, то заходим в админку

  logout(){
    this.setToken(null)
  }

  isAuthenticated(): boolean{
    return !!this.token
  }

  private handleError(error: HttpErrorResponse){
    const {message} = error.error.error
    switch(message){
      case 'INVALID_EMAIL':
        this.error$.next('Неверный email')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль')
        break
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Такого email нет')
        break
    }
    return throwError(error)
  }

  private setToken(response: FbAuthResponse | null){
    if(response){
      const expDate = new Date(new Date().getTime() + +response.expiresIn*1000)
      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    }else{
      localStorage.clear()
    }

  }
}
