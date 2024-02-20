import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar';
import { CabeceraComponent } from './cabecera/cabecera';
import { BlockUserComponent } from './block-user/block-user';
import {IonicModule} from "ionic-angular";
@NgModule({
	declarations: [BlockUserComponent
    ],
  imports: [
    IonicModule
  ],
	exports: [BlockUserComponent
    ]
})
export class ComponentsModule {}
