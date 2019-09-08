import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Todo} from '../../models/todo.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TodoService} from '../../shared/todo.service';
import {NgForm} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-save-task',
  templateUrl: './save-task.component.html',
  styleUrls: ['./save-task.component.css']
})
export class SaveTaskComponent implements OnInit, OnDestroy {

  private todo: Todo = new Todo();
  private routeSubscription: Subscription;
  private todoSubscription: Subscription;
  private saveTodoSubscription: Subscription;
  @ViewChild('saveBtn', {static: false}) saveBtn: HTMLButtonElement;
  @ViewChild('taskForm', {static: false}) private taskForm: NgForm;

  constructor(private route: ActivatedRoute, private todoService: TodoService,
              private router: Router) {
  }

  // On component init
  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(
      (params: Params) => {
        if (params['id'] != null) {
          this.todoSubscription = this.todoService.getTodo(params['id']).subscribe(
            (todo: Todo) => {
              this.todo = todo;
            },
            (error) => {
              console.log('Error: ' + error.message);
            }
          );
        }
      }
    );
  }

  // On component destroy
  ngOnDestroy() {
    // Unsubscribe from route subscription
    this.routeSubscription.unsubscribe();
    // Unsubscribe from todo subscription if not null
    if (this.todoSubscription != null) {
      this.todoSubscription.unsubscribe();
    }
    // Unsubscribe from save todo subscription if not null
    if (this.saveTodoSubscription != null) {
      this.saveTodoSubscription.unsubscribe();
    }
  }

  // On task saving
  onSaveTask() {
    if (this.taskForm.valid) {
      // Save todo on server side
      this.saveTodoSubscription = this.todoService.saveTodo(this.todo).subscribe(
        (response) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            type: 'success',
            title: 'Task has been saved successfully'
          });
          // Redirect user to home page
          this.router.navigateByUrl('/?update=true');
        },
        (error) => {
          console.log('Error: ' + error.message);
        }
      );
    } else {
      // Invalid form error message
      Swal.fire(
        'Error!',
        'Invalid task data!',
        'error'
      );
    }
  }
}
