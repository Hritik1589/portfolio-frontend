import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { Location } from '@angular/common';
import {
  CommonModule
} from '@angular/common';


import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';


import {
  PublicProjectService
} from '../../../../core/services/public-project.service';


import {
  ProjectResponse
} from '../../../../core/models/project.model';



@Component({

selector:'app-project-detail',

standalone:true,

imports:[

CommonModule,

RouterLink

],


templateUrl:'./project-detail.component.html',


styleUrl:'./project-detail.component.scss'


})


export class ProjectDetailComponent implements OnInit {

private readonly location = inject(Location); // 🚨 Inject Location

  // 🚨 Add this method
  goBack(): void {
    this.location.back();
  }

private readonly route =
inject(ActivatedRoute);



private readonly projectService =
inject(PublicProjectService);




project =
signal<ProjectResponse | null>(null);



isLoading =
signal<boolean>(true);



error =
signal<boolean>(false);





ngOnInit():void{


const slug =
this.route.snapshot.paramMap.get('slug');



if(slug){

this.loadProject(slug);

}

else{

this.isLoading.set(false);

this.error.set(true);

}


}




private loadProject(slug:string):void{


this.projectService

.getProjectBySlug(slug)

.subscribe({



next:(res)=>{


this.project.set(

res.data

);


this.isLoading.set(false);


},




error:(err)=>{


console.error(
'Project loading failed',
err
);



this.isLoading.set(false);


this.error.set(true);


}



});



}



}