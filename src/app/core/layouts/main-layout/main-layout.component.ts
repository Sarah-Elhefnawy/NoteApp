import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyNavComponent } from "../../../shared/components/my-nav/my-nav.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MyNavComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
