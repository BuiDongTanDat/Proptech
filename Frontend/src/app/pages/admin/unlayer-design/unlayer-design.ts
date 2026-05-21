import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailEditorComponent, EmailEditorModule } from 'angular-email-editor';
import { Button } from '../../../shared/components/ui/button/button';
import { LucideDynamicIcon } from '@lucide/angular';
import { propertiesList } from '../../../shared/utils/data.mock';

@Component({
  selector: 'app-unlayer-design',
  imports: [EmailEditorModule, Button, LucideDynamicIcon],
  templateUrl: './unlayer-design.html',
  styleUrl: './unlayer-design.css',
})
export class UnlayerDesign implements OnInit {

  @ViewChild(EmailEditorComponent)
  private emailEditor!: EmailEditorComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }


  editorOptions = {
    projectId: 123456, //  Unlayer project ID
    displayMode: 'web' as 'web', // Chế độ: "web | "document" | "popup"
    version: 'latest',

  };

  loading = false;
  editorReady = false;
  selectedProperty: any = null;

  ngOnInit() {
    const propertyId = Number(this.route.snapshot.paramMap.get('id'));
    this.selectedProperty = propertiesList.find(p => p.id === propertyId);
  }
  editorLoaded() {
    this.editorReady = true;
    if (this.selectedProperty?.jsonSource) {
      this.emailEditor.editor.loadDesign(this.selectedProperty.jsonSource);
      console.log('Design loaded into editor from Edit button');
    }

    this.emailEditor.editor.addEventListener(
      'design:loaded',
      () => {
        console.log('Design loaded into editor');
      }
    );

    this.editorReady = true;

    console.log('Editor ready');
  }

  saveDesign() {
    if (!this.emailEditor?.editor) return;

    this.loading = true;

    this.emailEditor.editor.exportHtml(
      (data: any) => {

        const { design, html } = data;

        console.log(html);

      },
      {
        cleanup: true,
        minify: false
      }
    );
  }

  loadDesign(event: Event) {

    if (!this.editorReady) {
      console.error('Editor chưa sẵn sàng');
      return;
    }
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {

        const design = JSON.parse(
          reader.result as string
        );

        this.emailEditor.editor.loadDesign(design);

        console.log('Design loaded');

      } catch (error) {

        console.error('JSON không hợp lệ', error);

      }
    };
    reader.readAsText(file);
  }

  downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  goBack() {

    this.router.navigate(['/admin/properties']);
  }


}
