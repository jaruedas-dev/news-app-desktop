import {JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import * as _ from 'lodash';
import {SweetAlertIcon} from "sweetalert2";
import {HighlightInputFormDirective} from "../../directives/highlight-input-form.directive";
import {ArticleDetails} from "../../interfaces/news-interface";
import {NewsImagePipe} from "../../pipes/news-image.pipe";
import {LoginService} from "../../services/login.service";
import {NewsService} from "../../services/news.service";
import {UiToolsService} from "../../services/ui-tools.service";

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [
    FormsModule,
    HighlightInputFormDirective,
    NgClass,
    JsonPipe,
    NgForOf,
    NewsImagePipe,
    NgIf
  ],
  templateUrl: './news-form.component.html',
  styleUrl: './news-form.component.css'
})
export class NewsFormComponent implements OnInit {
  id: string = '';
  article: ArticleDetails = {
    abstract: "",
    body: "",
    id: "",
    id_user: "",
    image_data: "",
    image_description: undefined,
    image_media_type: "",
    is_deleted: "",
    is_public: "",
    subtitle: "",
    update_date: "",
    username: "",
    category: "",
    title: ""
  }
  categories: string[] = [];
  changeImage: boolean = false;

  imageError: string | null = null;
  isImageSaved: boolean = false;
  cardImageBase64: string | null = null;
  userIsLogged:boolean = false;
  @ViewChild('newsForm') newsForm!: NgForm;

  constructor(private activatedRoute: ActivatedRoute,
                private newsService: NewsService,
                  private router: Router,
                  private uiToolsService: UiToolsService,
                  private loginService: LoginService,
              ) {
    this.id = activatedRoute.snapshot.params['id'];
    if(!this.id){
      this.changeImage = true;
    }
  }

  ngOnInit() {
    if(!this.loginService.isLogged()){
      this.router.navigate(['/']).then( () => {
        this.uiToolsService.displayMessage('Unauthorized', 'You are not authorized!', 'error');
      });
    }
    this.newsService.getCategories().subscribe( (categories) => {
      this.categories = categories;
    });

    if(this.id){
      this.newsService.getArticle(this.id).subscribe((resp) => {
        this.article = resp;
      })
    }

  }

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    console.log(fileInput);
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const MAX_SIZE = 20971520;
      const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

      if (fileInput.target.files[0].size > MAX_SIZE) {
        this.imageError =
          'Maximum size allowed is ' + MAX_SIZE / 1000 + 'Mb';
        return false;
      }
      if (!_.includes(ALLOWED_TYPES, fileInput.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path;
          this.isImageSaved = true;

          this.article.image_media_type = fileInput.target.files[0].type;
          const head = this.article.image_media_type!.length + 13;
          this.article.image_data = e.target.result.substring(head, e.target.result.length);

        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
    return true;
  }


  redirectHome() {
    this.router.navigate(['']);
  }

  displayChangeImage() {
    this.changeImage = !this.changeImage;
    if(!this.changeImage){
      this.article.image_media_type = '';
      this.article.image_data = '';
    }
  }

  submitForm() {
    if(this.newsForm.invalid) return;
    if(!this.id){
      if(this.article.hasOwnProperty('id')){
        delete this.article.id
      }
      this.confirmAction('create', 'Are you sure?', 'This article will be created!', 'Yes, Create it!')
    }else{
      this.confirmAction('edit', 'Are you sure?', 'Do you want to edit the article?', 'Yes, Edit!')
    }
  }

  private confirmAction(action: string, title: string, message: string, confirmButtonText: string) {
    let icon: SweetAlertIcon = 'question';
    this.uiToolsService.displayMessage(title, message, icon, confirmButtonText)
      .then( (resp) => {
        if(resp.isConfirmed){
          switch(action) {
            case 'edit':
              this.newsService.updateArticle(this.article).subscribe( (resp) => {
                if(resp['status'] == '200'){
                  this.router.navigate([`/articles/${this.id}`])
                    .then( () => this.uiToolsService.displayToastMessage('Article has been updated', 'success').then() )
                }
              })
              break;
            case 'create':
              this.newsService.createArticle(this.article).subscribe((resp2) => {
                if(resp2['status'] == 200){
                  this.router.navigate(['/'])
                    .then( () => this.uiToolsService.displayToastMessage('Article has been created successfully', 'success').then() )
                }
              })
              break;
          }
        }
      })
  }
}
