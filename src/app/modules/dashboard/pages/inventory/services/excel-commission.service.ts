import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelCommissionService {

  constructor() { }

  public exportAsExcelFile(
    retail_sales: any[],
    wholesale_sales: any[],
    wholesale_salesG: any[],
    losses_sales: any[],
    excelFileName: string) {
    const retail_sheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(retail_sales);
    const wholesale_sheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(wholesale_sales);
    const wholesaleG_sheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(wholesale_salesG);
    const losses_sheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(losses_sales);
    const workbook: XLSX.WorkBook = {
      Sheets: {
        'Entregas_minoristas': retail_sheet,
        'Entregas_mayoristas': wholesale_sheet,
        'Entregas_gran_mayoreo': wholesaleG_sheet,
        'Mermas': losses_sheet
      },
      SheetNames: ['Entregas_minoristas', 'Entregas_mayoristas', 'Entregas_gran_mayoreo', 'Mermas']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().toLocaleString() + EXCEL_EXTENSION);
  }
}
