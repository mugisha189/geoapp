import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuddyProfilePage } from './buddy-profile';

@NgModule({
  declarations: [
    //BuddyProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(BuddyProfilePage),
  ],
})
export class BuddyProfilePageModule {}
