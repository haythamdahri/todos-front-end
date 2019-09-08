import {Route, RouterModule,} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {NgModule} from '@angular/core';
import {SaveTaskComponent} from './home/save-task/save-task.component';

const routes: Route[] = [
  {
    path: '', component: HomeComponent, children: [
      {
        path: 'save', component: SaveTaskComponent
      },
      {
        path: 'save/:id', component: SaveTaskComponent
      }
    ]
  },
  {
    path: '**', component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

