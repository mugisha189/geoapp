import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";

/**
 * Generated class for the TagsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tags',
  templateUrl: 'tags.html',
})
export class TagsPage {

  category: any;
  categories_keys: any;
  categories: any;
  filters: any;
  filter: any;
  rangeSlider: any;

  disabledButton = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider) {

    this.rangeSlider = {
      lower: 18,  // from
      upper: 30   // to
    };

    this.categories_keys = this.rest.categories;
    this.categories = Object.keys(this.categories_keys);

    this.rest.selected_filters$.subscribe(data => {
      if (data['age']) {
        this.rangeSlider.upper = data['age'].upper;
        this.rangeSlider.lower = data['age'].lower;
      }
      this.filter = data;
    });

    this.rest.category_selected$.subscribe(data => {
      var self = this;
      this.category = data;
      self.rest.getFilters(data.id);
    });

    this.rest.filters$.subscribe(data => {
      this.filters = data;

      if (this.filter == '') {
        this.disabledButton = true;
        this.filter = new Object();
        for (var item of data) {
          var elem = item.dataname;
          this.filter[elem] = null;
        }
      }
    });

  }

  ionViewDidLoad() {
  }

  searchByFilter() {
    if (this.category.name == 'heart') {
      this.filter['age'] = this.rangeSlider;
    }
    this.rest.setSelectedFilters(this.filter);
    this.navCtrl.pop();
  }

  clearFilters() {
    this.rest.setSelectedFilters('');
    this.navCtrl.pop();
  }

}
