import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  email: string;
  password: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.authService.createUser(this.email, this.password)
  }
}
