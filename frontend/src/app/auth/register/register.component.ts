import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  createUserData: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
   this.createUserData = this.formBuilder.group({
    firstName: [''],
    lastName: [''],
    username: [''],
    email: [''],
    password: [''],
    role: ['']
   })
  }

  onSubmit(): void {
    fetch("http://localhost:8989/users/create", {
      method: "POST",
      body: JSON.stringify(this.createUserData.value),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      console.log(this.createUserData);
      console.log(res);
      this.router.navigate(['users']);
    })
  }
}
