import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent implements OnInit {
  public email: string;
  public password: string;
  public emailAlreadyExist = false;
  constructor(private commonService: CommonService, private router: Router) {}

  ngOnInit(): void {}

  public loginWithEmailAndPassword(): void {
    this.commonService.loginWithEmailAndPassword(this.email, this.password);
  }

  public goBack(): void {
    this.router.navigateByUrl('/');
  }
}
