import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss'],
})
export class ChatAreaComponent implements OnInit {
  @Input() randomSeed: string;
  subs: Subscription;
  paramValue: string;
  roomName: string;

  constructor(
    private commonService: CommonService,
    private afs: AngularFirestore,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.subs = this.commonService.pathParam.subscribe((value) => {
      this.paramValue = value;
      console.log(this.paramValue);
    });
  }

  formSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const { message } = form.value;
    form.resetForm();

    // Does user has access to the given room or not
    // this.afs.collection('rooms').doc(this.paramValue);

    this.afs
      .collection('rooms')
      .doc(this.paramValue)
      .collection('messages')
      .add({
        message,
        user_id: this.commonService.getUser().uid,
        name: this.commonService.getUser().displayName,
        time: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }

  chatData(ev: any): void {
    if (ev.chatData) {
      debugger;
      ev.chatData.subscribe((roomName) => (this.roomName = roomName));
    }
  }

  public comingSoon(): void {
    alert('Coming Soon');
  }

  public goBack(): void {
    this.router.navigateByUrl('/backer');
  }
}
