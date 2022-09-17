import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../../shared/interface';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  submitted = false
  message: string
  form: FormGroup

  ngOnInit(): void {

    this.route.queryParams.subscribe((params: Params) => {
      if(params['loginAgain']){
        this.message = 'Пожалуйста, введите данные'
      } else if(params['authFailed']){
        this.message = 'Сессия истекла. Введите данные заново'
      }
    })

    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.email,
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    })
  }

  submit(){
    if(this.form.invalid){
      return
    }

    this.submitted = true

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.auth.login(user).subscribe(() => {
      this.form.reset()
      this.router.navigate(['/admin', 'dashboard'])
      this.submitted = false
    }), () => {
      this.submitted = false
    }
  }
}
