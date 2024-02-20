import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMarkerPage } from './add-marker';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
  ],
  imports: [
    IonicPageModule.forChild(AddMarkerPage),
    TranslateModule,
  ],
})
export class AddMarkerPageModule {}
