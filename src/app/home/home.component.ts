import {Component, OnDestroy, OnInit} from '@angular/core';
import {TodoService} from '../shared/todo.service';
import {Todo} from '../models/todo.model';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private todos: Array<Todo> = new Array<Todo>();
  private todosSubscription: Subscription;
  private error = false;
  private errorMessage: string;

  constructor(private todosService: TodoService, private titleSerice: Title) {
  }

  ngOnInit() {
    // Set component title
    this.titleSerice.setTitle("Todos Home");
    // Assign method subscription
    // Fetch data from the server (DJANGO REST FRAMEWORK SERVER)
    this.todosSubscription = this.todosService.getTodos().subscribe(
      (todos: Array<Todo>) => {
        this.todos = todos;
      },
      (error) => {
        this.error = true;
        this.errorMessage = error;
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from init subscription
    this.todosSubscription.unsubscribe();
  }


  onUpdateTasksList() {
    // Set empty array
    this.todos = new Array<Todo>();
    // Rerun init
    this.ngOnInit();
  }
}
