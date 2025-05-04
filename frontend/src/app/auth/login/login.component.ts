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
    const alertDiv = document.getElementById('alert-div');

    fetch("http://localhost:8989/auth/login", {
      method: "POST",
      body: JSON.stringify(this.loginForm.value),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }).then(res => {
      if (!res.ok) {
        return res.json().then(errorBody => {
          throw new Error(errorBody.message || 'Login failed');
        });
      }
      return res.json();
    })
    .then(data => {
      if (alertDiv) {
        alertDiv.innerHTML = data.message;
        alertDiv.style.color = 'black';
        alertDiv.style.backgroundColor = 'lightgreen'
        alertDiv.style.display = 'block';

        setTimeout(() => {
          alertDiv.style.display = 'none'
        }, 3000)
      }
      this.router.navigate(['users-profile']);
    })
    .catch(error => {
      if (alertDiv) {
        alertDiv.innerHTML = error.message;
        alertDiv.style.color = 'white';
        alertDiv.style.backgroundColor = 'red'
        alertDiv.style.display = 'block';

        setTimeout(() => {
          alertDiv.style.display = 'none'
        }, 3000)
      }
    });
  }
}
