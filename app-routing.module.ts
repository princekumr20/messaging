import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainContainerComponent } from './components/main-container/main-container.component';
import { ChatRoomComponent } from './components/main-container/chat-area/chat-room/chat-room.component';
import { ChatDefaultPageComponent } from './components/main-container/chat-area/chat-default-page/chat-default-page.component';
import { LoginComponent } from './components/login/login.component';
import { ChatGuard } from './guards/chat.guard';
import { RequestRoomsComponent } from './components/request-rooms/request-rooms.component';
import { EmailLoginComponent } from './components/login/email-login/email-login.component';

const routes: Routes = [
  {
    path: '',
    component: MainContainerComponent,
    children: [
      {
        path: 'room/:id',
        component: ChatRoomComponent,
      },
      {
        path: '',
        component: ChatDefaultPageComponent,
      },
    ],
    canActivate: [ChatGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'requestRooms',
    component: RequestRoomsComponent,
  },
  {
    path: 'email-login',
    component: EmailLoginComponent,
  },

  {
    path: 'backer',
    component: MainContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
