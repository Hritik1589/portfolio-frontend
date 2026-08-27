import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';

import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs';

import {
  PublicProjectService
} from '../../../core/services/public-project.service';

import {
  ProjectResponse
} from '../../../core/models/project.model';



@Component({

selector:'app-public-projects',

standalone:true,

imports:[
  CommonModule,
  RouterLink,
  ReactiveFormsModule
],

templateUrl:'./public-projects.component.html',

styleUrl:'./public-projects.component.scss'

})


export class PublicProjectsComponent implements OnInit {



private readonly projectService = inject(
  PublicProjectService
);



featuredProjects = signal<ProjectResponse[]>([]);


allProjects = signal<ProjectResponse[]>([]);



isLoadingFeatured = signal(true);


isLoadingAll = signal(true);



searchControl = new FormControl('');



currentPage = signal(0);



pageSize = 9;



ngOnInit():void{


this.loadFeaturedProjects();


this.loadAllProjects();



this.searchControl.valueChanges

.pipe(

debounceTime(400),

distinctUntilChanged()

)

.subscribe(search=>{


this.currentPage.set(0);


this.loadAllProjects(
search || ''
);


});


}




private loadFeaturedProjects():void{


this.projectService
.getFeaturedProjects()

.subscribe({

next:(res)=>{


this.featuredProjects.set(
res.data
);


this.isLoadingFeatured.set(false);


},


error:()=>{


this.isLoadingFeatured.set(false);


}


});


}





private loadAllProjects(
search:string=''
):void{


this.isLoadingAll.set(true);



this.projectService

.getAllProjects(

this.currentPage(),

this.pageSize,

search

)

.subscribe({

next:(res)=>{


this.allProjects.set(

res.data.content

);



this.isLoadingAll.set(false);



},


error:()=>{


this.isLoadingAll.set(false);


}


});


}




getVisibleTechnologies(
project:ProjectResponse
):string[]{


return project.technologies.slice(0,3);


}




nextPage():void{


this.currentPage.update(
page=>page+1
);


this.loadAllProjects(
this.searchControl.value || ''
);


}





previousPage():void{


if(this.currentPage()>0){


this.currentPage.update(
page=>page-1
);



this.loadAllProjects(
this.searchControl.value || ''
);


}


}





cardMove(event:MouseEvent):void{


const card =
event.currentTarget as HTMLElement;



const rect =
card.getBoundingClientRect();



const x =
event.clientX - rect.left;



const y =
event.clientY - rect.top;



const rotateY =
((x / rect.width)-0.5)*20;



const rotateX =
((rect.height/2-y)/rect.height)*20;



card.style.transform =

`
perspective(1000px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
scale3d(1.02,1.02,1.02)
`;



}





leaveCard(event:MouseEvent):void{


const card =
event.currentTarget as HTMLElement;



card.style.transform = '';



}



}