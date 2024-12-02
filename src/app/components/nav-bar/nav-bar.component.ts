import {NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router, RouterModule} from '@angular/router';
import {ElectronService} from "../../services/electron.service";
import {isElectron} from "../../shared/functions";
import * as Functions from "../../shared/functions";
import {
  NgbCollapse,
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
    NgbCollapse,
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
  theme = 'light';

  public isMenuCollapsed = true;

  constructor(
    private loginService: LoginService,
    private newsService:NewsService,
    private uiToolsService:UiToolsService,
    private electronService: ElectronService,
    private router: Router) {}
  ngOnInit() {

    let logged = false;
    if(isElectron()){
      this.theme = this.electronService.getCurrentTheme();
      this.loginService.isUserLoaded().subscribe(userLoaded => {
        if (userLoaded) {
          this.loginService.isLoggedIn().subscribe(isLoggedIn => {
            this.isLoggedIn = isLoggedIn;
          });
        }
      });
    }else{
      // Verifica si el usuario está logueado al iniciar
      this.isLoggedIn = this.loginService.isLogged();
    }
  }

  login(username: string, password: string) {
    this.loginService.login(username, password).subscribe(
      (user) => {

        this.isLoggedIn = true;
        this.newsService.updateApiKey(user.token);

        if(Functions.isElectron()){
          this.electronService.saveData('user', JSON.stringify(user))
          this.electronService.displayMessage("Welcome", `Welcome back ${user.username}`);
        }
      },
      (error) => {
        if(Functions.isElectron()){
          this.electronService.displayMessage("Error", 'User or password are incorrect');
        }else{
          this.uiToolsService.displayToastMessage('User or password are incorrect', 'error');
        }
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
