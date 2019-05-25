import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent extends MatPaginatorIntl {

  @Input() totalPages: number;
  @Input() totalItems: number;
  @Input() perPage: number;
  @Input() page: number;
  @Output() nextPage = new EventEmitter();
  @Output() beforePage = new EventEmitter();
  public pages = [1];
  public currentPage = 1;
  public itemsPerPage = 0;

  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return '0 od ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
  };


  // ngOnChanges() {
  //   this.pages = Array(this.totalPages).fill(this.totalPages);
  //   this.currentPage = this.page;
  //   this.itemsPerPage = this.perPage * this.page;
  // }

  public before() {
    // if (this.currentPage - 1 >= 1) {
    //   this.currentPage--;
    //   this.itemsPerPage = this.perPage * this.currentPage;
    // }
    // this.beforePage.emit();
  }

  public next() {
    // if (this.currentPage + 1 <= this.totalPages) {
    //   this.currentPage++;
    //   this.itemsPerPage = this.perPage * this.currentPage;
    // }
    // this.nextPage.emit();
  }

}
