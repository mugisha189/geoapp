import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarkerInfoPage } from './marker-info';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    //MarkerInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MarkerInfoPage),
    TranslateModule,
  ],
})
export class MarkerInfoPageModule {}
