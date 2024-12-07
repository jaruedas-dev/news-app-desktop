import { Injectable } from '@angular/core';

import { ipcRenderer } from 'electron';
import {Article} from "../interfaces/news-interface";


@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer!: typeof ipcRenderer;
  theme!: any;

  constructor() {
    this.ipcRenderer = (window as any).electron.ipcRenderer;
    this.theme = (window as any).electron.theme.initialTheme;
  }

  displayMessage(title: string, message: string, callback: any = null) {
    this.ipcRenderer.invoke('show-notification', {
      title: title,
      message: message,
      callbackEvent: 'notification-clicked-answer',
    });


    this.ipcRenderer.on('notification-clicked', () => {
      if(callback instanceof Function) callback();
    });


  }

  saveData(key: string, data: any) {
    this.ipcRenderer.invoke('store-set', key, data).then(() => {
      console.log(`Data saved successfully: ${key} = ${data}`);
    }).catch((error: any) => {
      console.error('Error saving data:', error);
    });
  }

  getData(key: string): Promise<any> {
    return this.ipcRenderer.invoke('store-get', key).then((data: any) => {
      return JSON.parse(data);
    }).catch((error: any) => {
      console.error('Error retrieving data:', error);
      throw error;
    });
  }

  clearData(){
    this.ipcRenderer.invoke('store-delete').then( () => {
      console.log("Data deleted successfully");
    });
  }

  showConfirmDialog(options: { title: string, message: string, cancel?: string, action?: string }): Promise<boolean> {
    return this.ipcRenderer.invoke('show-confirm-dialog', options);
  }


  setTheme(){
    document.addEventListener('DOMContentLoaded', () => {
      this.ipcRenderer.on('theme-changed', (event, theme) => {
        const header = document.querySelector('header');
        const navbar = document.querySelector('navbar');
        const newsCards = document.querySelectorAll('.card');
        console.log("NewsCards encountered " + newsCards.length);
        newsCards.forEach((newsCard) => {
          if (theme === 'dark') {
            newsCard.classList.add('bg-dark');
            newsCard.classList.remove('bg-light');
          } else {
            newsCard.classList.add('bg-light');
            newsCard.classList.remove('bg-dark');
          }
        });

        if (theme === 'dark') {
          document.body.classList.add('dark-theme');
          document.body.classList.remove('light-theme');
          header!.classList.add('bg-dark')
          header!.classList.remove('bg-light')
          if(navbar){
            navbar.classList.add('dark-theme');
            navbar.classList.remove('light-theme');
          }

        } else {
          document.body.classList.add('light-theme');
          document.body.classList.remove('dark-theme');
          header!.classList.remove('bg-dark')
          header!.classList.add('bg-light')
          if(navbar){
            navbar.classList.remove('dark-theme');
            navbar.classList.add('light-theme');
          }
        }
      });
    });
  }

  getCurrentTheme(){
    return this.theme;
  }

  exportArticle(article: Article){
    this.ipcRenderer.invoke('export-article', article);
  }

  async importArticle(): Promise<Article> {
    const result: { article: Article; success: boolean } =
      await this.ipcRenderer.invoke('import-article',)
    return result.article
  }

}
