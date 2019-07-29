import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
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
    this.authService.createUser(this.email, this.password);
    form.resetForm()
  }
}
