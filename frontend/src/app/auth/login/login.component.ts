import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
   this.loginForm = this.formBuilder.group({
    username: [''],
    password: [''],
   })
  }

  onSubmit(): void {
    fetch("http://localhost:8989/auth/login", {
      method: "POST",
      body: JSON.stringify(this.loginForm.value),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }).then(res => {
      console.log(this.loginForm);
      console.log(res);
      res.json().then(x => console.log(x))      //.setItem("loggedInUser", res.dat)
      //this.router.navigate(['users']);
    }).catch(error => console.log(error))
  }
}
