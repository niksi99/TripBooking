import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './users.component.scss'
})
export class UserProfile implements OnInit{
  user: any;

  ngOnInit(): void {
    fetch("http://localhost:8989/users/")
      .then((response) => response.json())
      .then(data => {
        console.log(data);
      })
  }
}
