import {Component, OnDestroy, OnInit} from '@angular/core';
import {TodoService} from '../shared/todo.service';
import {Todo} from '../models/todo.model';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import Swal from 'sweetalert2';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private todos: Array<Todo> = new Array<Todo>();
  private todosSubscription: Subscription;
  private todosDeleteSubscription: Subscription;
  private routeSubscription: Subscription;
  private error = false;
  private errorMessage: string;

  constructor(private todosService: TodoService, private titleSerice: Title, private route: ActivatedRoute) {
  }

  ngOnInit() {
    // Watch route query params
    this.routeSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        if (params['update'] != null) {
          this.fetchData();
        }
      }
    );
    // Set component title
    this.titleSerice.setTitle('Todos Home');
    // Fetch data
    this.fetchData();
  }

  fetchData() {
    // Assign method subscription
    // Fetch data from the server (DJANGO REST FRAMEWORK SERVER)
    this.todosSubscription = this.todosService.getTodos().subscribe(
      (todos: Array<Todo>) => {
        this.todos = todos;
      },
      (error) => {
        this.error = true;
        this.errorMessage = error.message;
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from route subscription
    this.routeSubscription.unsubscribe();
    // Unsubscribe from init subscription
    this.todosSubscription.unsubscribe();
    // Unsubscribe from delete subscription if not null
    if (this.todosDeleteSubscription != null) {
      this.todosDeleteSubscription.unsubscribe();
    }
  }

  onUpdateTasksList() {
    // Set empty array
    this.todos = new Array<Todo>();
    // Fetch data
    this.fetchData();
    ;
  }

  onDeleteTask(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fas fa-check"></i> Yes, delete it!',
      cancelButtonText: '<i class="fas fa-times"></i> No, Cancel'
    }).then((result) => {
      if (result.value) {
        // Delete request
        this.todosDeleteSubscription = this.todosService.deleteTodo(id).subscribe(
          (response) => {
            console.log(response);
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });
            Toast.fire({
              type: 'success',
              title: 'Task has been deleted successfully'
            });
            // Refresh data
            this.fetchData();
          },
          (error) => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });
            Toast.fire({
              type: 'error',
              title: error.message
            });
          }
        );
      }
    });
  }
}
