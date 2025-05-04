import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [NgFor, RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{

  allUsers: any;

  ngOnInit(): void {
    fetch("http://localhost:8989/users/get-all")
      .then((response) => response.json())
      .then(data => {
        console.log(data);
        this.allUsers = data
      })
  }

  hardDelete(id: string): void {
    fetch("http://localhost:8989/users/hard-delete/"+id, {
      method: 'DELETE'
    }).then(response => {
      console.log(response);
    }).catch(error => {
      console.log(error);
    })
  }
}
