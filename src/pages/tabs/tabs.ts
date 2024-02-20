import { Component } from '@angular/core';

import {MapPage} from "../map/map";
import {ProfilePage} from "../profile/profile";
import {ChatsPage} from "../chats/chats";
import {RestProvider} from "../../providers/rest/rest";
import {HomePage} from "../home/home";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MapPage;
  tab2Root = ChatsPage;
  tab3Root = ProfilePage;
  tab4Root = HomePage;

  constructor(public rest: RestProvider) {

  }
}
