import {Component, OnDestroy, OnInit} from '@angular/core';
import {TodoService} from '../shared/todo.service';
import {Todo} from '../models/todo.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private todos: Array<Todo>;
  private todosSubscription: Subscription;
  private error = false;
  private errorMessage: string;

  constructor(private todosService: TodoService) { }

  ngOnInit() {
    this.todosSubscription = this.todosService.getTodos().subscribe(
      (todos: Array<Todo>) => {

      },
      (error) => {
        this.error = true;
        this.errorMessage = error;
      }
    );
  }

  ngOnDestroy(): void {
    this.todosSubscription.unsubscribe();
  }



}
