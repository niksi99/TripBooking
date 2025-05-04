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
      return res.json(); // Parse response if successful
    })
    .then(data => {
      // Successful login logic
      console.log('Logged in:', data);
      // this.router.navigate(['users']);
    })
    .catch(error => {
      console.log(alertDiv);
      console.error('Login error:', error.message);

      if (alertDiv) {
        alertDiv.innerHTML = error.message;
        alertDiv.style.color = 'black';
        alertDiv.style.backgroundColor = 'yellow'
        alertDiv.style.display = 'block';

        setTimeout(() => {
          alertDiv.style.display = 'none'
        }, 4000)
      }
    });
  }
}
