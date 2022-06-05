import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private commonService: CommonService, private router: Router) {}

  ngOnInit(): void {}

  loginWithGoogle(): void {
    this.commonService.loginWithGoogle();
  }

  loginWithEmail(): void {
    this.router.navigateByUrl('/email-login');
  }
}
