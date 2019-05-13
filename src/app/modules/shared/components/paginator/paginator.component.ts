import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnChanges {

  @Input() totalPages: number;
  @Input() totalItems: number;
  @Input() perPage: number;
  @Input() page: number;
  @Output() nextPage = new EventEmitter();
  @Output() beforePage = new EventEmitter();
  public pages = [1];
  public currentPage = 1;
  public itemsPerPage = 0;

  ngOnChanges() {
    this.pages = Array(this.totalPages).fill(this.totalPages);
    this.currentPage = this.page;
    this.itemsPerPage = this.perPage * this.page;
  }

  public before() {
    // if (this.currentPage - 1 >= 1) {
    //   this.currentPage--;
    //   this.itemsPerPage = this.perPage * this.currentPage;
    // }
    this.beforePage.emit();
  }

  public next() {
    // if (this.currentPage + 1 <= this.totalPages) {
    //   this.currentPage++;
    //   this.itemsPerPage = this.perPage * this.currentPage;
    // }
    this.nextPage.emit();
  }

}
