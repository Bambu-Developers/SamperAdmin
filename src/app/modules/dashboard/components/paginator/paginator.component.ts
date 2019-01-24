import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() totalPages: number;
  @Input() totalItems: number;
  @Input() perPage: number;
  @Input() page: number;
  @Output() nextPage = new EventEmitter();
  @Output() beforePage = new EventEmitter();
  public pages;
  public currentPage;
  public itemsPerPage;

  constructor() { }

  ngOnInit() {
    this.pages = Array(this.totalPages).fill(this.totalPages);
    this.itemsPerPage = this.perPage * this.currentPage;
  }

  ngOnChanges() {
    this.currentPage = this.page;
    this.itemsPerPage = this.perPage * this.currentPage;
  }

  public before() {
    if (this.currentPage - 1 >= 1) {
      this.currentPage--;
      this.itemsPerPage = this.perPage * this.currentPage;
    }
  }

  public next() {
    if (this.currentPage + 1 <= this.totalPages) {
      this.currentPage++;
      this.itemsPerPage = this.perPage * this.currentPage;
    }
  }

}
