import {NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router, RouterModule} from '@angular/router';
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavLinkButton,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import {LoginService} from "../../services/login.service";
import {NewsService} from "../../services/news.service";
import {UiToolsService} from "../../services/ui-tools.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    TitleCasePipe,
    NgbNav,
    NgbNavOutlet,
    NgbNavItem,
    NgbNavLinkButton,
    NgbNavContent,
    RouterModule,
    FormsModule,
    NgIf,
    NgbDropdownMenu,
    NgbDropdown,
    NgbDropdownToggle,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  @Input({ required: true }) categories!: string[];
  @Input({ required: true }) selectedCategory!: string;
  @Output() emitCategory: EventEmitter<string> = new EventEmitter<string>();
  @Output() emitSearchText: EventEmitter<string> = new EventEmitter<string>();
  searchTextValue = '';
  isLoggedIn: boolean = false;

  constructor(private loginService: LoginService, private newsService:NewsService, private uiToolsService:UiToolsService, private router: Router) {}
  ngOnInit() {
    // Verifica si el usuario está logueado al iniciar
    this.isLoggedIn = this.loginService.isLogged();
  }

  login(username: string, password: string) {
    this.loginService.login(username, password).subscribe(
      (user) => {
        //Si el login es exitoso, actualizamos el estado
        this.isLoggedIn = true;
        this.newsService.updateApiKey(user.token);
      },
      (error) => {
        this.uiToolsService.displayToastMessage('User or password are incorrect', 'error');
      }
    );
  }
  logout() {
    this.loginService.logout();
    this.isLoggedIn = false;
  }

  updateCategory(category: string) {
    this.selectedCategory = category;
    if(this.router.url !== '/'){
      this.router.navigate(['/']).then(
        () => this.emitCategory.emit(this.selectedCategory)
      );
    }else{
      this.emitCategory.emit(this.selectedCategory);
    }


  }

  sendSearchText() {
    this.emitSearchText.emit(this.searchTextValue);
  }
}
