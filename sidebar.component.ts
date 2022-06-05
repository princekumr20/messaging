import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { CommonService, RoomData } from '../../../services/common.service';
import { map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public showRooms: boolean = true;
  randomSeed: any[] = [];
  roomData: RoomData[] = [];
  backupRoomData: RoomData[] = [];
  lastMessage: string;
  subs: Subscription[] = [];
  @Output() seedValue: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private afs: AngularFirestore,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    // this.showRooms = true;
    // Generate 20 random values and store it in the randomSeed array
    this.randomSeed = Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * 14578976)
    );

    this.fetchFeeds();
  }

  onFormSubmit(form: NgForm): void {
    this.roomData = this.backupRoomData;
    const { search } = form.value;
    console.log(search);

    if (form.invalid) {
      return;
    }

    if (search) {
      this.roomData = this.roomData.filter(
        (item) => item.name.toLowerCase() === search.toLowerCase
      );
    }

    this.afs
      .collection<RoomData>('rooms')
      .valueChanges()
      .pipe(
        map((data: RoomData[]) =>
          data.map(
            (s) => s.name?.toLowerCase() === form.value.search?.toLowerCase()
          )
        )
      )
      .subscribe((dataValue) => {
        dataValue = dataValue.filter((s) => s === true);

        if (dataValue.length > 0) {
          alert('Sorry, room already present');
          return;
        } else {
          if (form.value.search !== null) {
            this.afs.collection('rooms').add({
              name: form.value.search,
            });
          } else {
            return;
          }
          form.resetForm();
        }
      });
  }

  ngOnDestroy(): void {
    this.subs.map((s) => s.unsubscribe());
  }

  seedData(ev: string): void {
    this.seedValue.emit(ev);
    // this.showRooms = false;
  }

  logout(): void {
    this.commonService.logout();
  }

  public fetchLatestFeeds(): void {
    this.fetchFeeds();
  }

  public messageAdmin(): void {
    alert('Message Admin');
  }

  private fetchFeeds(): void {
    // Fetching data from firestore
    this.subs.push(
      this.afs
        .collection('rooms')
        .snapshotChanges()
        .pipe(
          map((actions) => {
            return actions.map((a) => {
              return {
                id: a.payload.doc.id,
                // @ts-ignore
                ...a.payload.doc.data(),
              };
            });
          })
        )
        .subscribe((rooms: RoomData[]) => {
          // Check if current user is permitted for this group or not
          let user = JSON.parse(localStorage.getItem('user'));
          console.log(user.email);
          this.roomData = rooms.filter((item) =>
            item.permittedUsers?.includes(user.email)
          );

          this.backupRoomData = JSON.parse(JSON.stringify(this.roomData));
        })
    );
  }
}
