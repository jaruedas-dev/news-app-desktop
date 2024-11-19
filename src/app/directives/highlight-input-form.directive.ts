import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[highlightInput]',
  standalone: true
})
export class HighlightInputFormDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('focus') onFocus() {
    this.highlight()
  }
  @HostListener('blur') onBlur() {
    setTimeout(() => {
      this.restoreInput()
    }, 100)
  }

  private highlight(){
    this.paintInput('highlight')
  }

  private restoreInput(){
    let style = 'restore'
    if(this.el.nativeElement.classList.contains('is-invalid')){
      style = 'invalid';
    }
    this.paintInput(style);
  }

  private paintInput(style: string){
    let borderSize:string = "1px";
    let borderStyle: string = "solid";
    let borderColor:string = "#dee2e6";
    let generalColor: string = "white";
    let textColor:string = "black";

    if( style == 'highlight'){
      borderSize = "5px";
      borderStyle = "double";
      borderColor = "black";
      generalColor = "black";
      textColor = "white";
    }

    if(style == 'invalid'){
      borderColor = "red";
    }

    this.renderer.setStyle(this.el.nativeElement, 'border', `${borderSize} ${borderStyle} ${borderColor}`);

    // Change label color
    const label = this.el.nativeElement.previousElementSibling;
    if (label && label.tagName === 'LABEL') {
      this.renderer.setStyle(label, 'color', `${textColor}`);
      this.renderer.setStyle(label, 'backgroundColor', `${generalColor}`);
      //this.renderer.setStyle(label, 'border', `${borderSize} ${borderStyle} ${borderColor}`);
    }
  }
}
