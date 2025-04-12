import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [HeaderComponent, MenuComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [HeaderComponent, MenuComponent] // Exportar los componentes para su uso en otros módulos
})
export class SharedModule {}
