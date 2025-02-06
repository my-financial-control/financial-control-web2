import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularMaterialModule } from './libs/angular-material.module';
import { CurrentMonthPtPipe } from './pipes/current-month-pt.pipe';
import { TransactionTypeIconPipe } from './pipes/transaction-type-icon.pipe';
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details.component';
import { ConsolidatedTransactionDetailsComponent } from './components/consolidated-transaction-details/consolidated-transaction-details.component';
import { ShortenUuidPipe } from './pipes/shorten-uuid.pipe';
import { MenuComponent } from './components/menu/menu.component';
import { MenuItemComponent } from './components/menu/menu-item/menu-item.component';
import { MenuLogoComponent } from './components/menu/menu-logo/menu-logo.component';


@NgModule({
    declarations: [
        TransactionDetailsComponent,
        CurrentMonthPtPipe,
        TransactionTypeIconPipe,
        ConsolidatedTransactionDetailsComponent,
        ShortenUuidPipe,
        MenuComponent,
        MenuItemComponent,
        MenuLogoComponent,
    ],
    imports: [
        BrowserModule,
        AngularMaterialModule,
    ],
    exports: [
        ConsolidatedTransactionDetailsComponent,
        TransactionDetailsComponent,
        AngularMaterialModule,
        CurrentMonthPtPipe,
        ShortenUuidPipe,
        TransactionTypeIconPipe,
        MenuComponent,
    ],
})
export class SharedModule { }
