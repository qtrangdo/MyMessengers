import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  email: string;
  password: string;
  private authListenerSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      })
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }
  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.authService.login(this.email, this.password)
  }

}
