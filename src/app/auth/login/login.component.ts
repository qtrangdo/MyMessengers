import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  email: string;
  password: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.authService.login(this.email, this.password)
  }

}
