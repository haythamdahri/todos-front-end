import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Todo} from '../models/todo.model';
import {catchError, map, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private API_URL = 'http://localhost:8000/api/todos/';

  constructor(private http: HttpClient) {
  }

  getTodos() {
    return this.http.get<Array<Todo>>(this.API_URL).pipe(
      retry(4)
    );
  }

  getTodo(id: number) {
    return this.http.get<Todo>(`${this.API_URL}${id}/`).pipe(
      retry(4)
    );
  }

  saveTodo(todo: Todo) {
    const saveUrl = todo.id != null ? `${this.API_URL}${todo.id}/` : this.API_URL;
    if (todo.id != null) {
      return this.http.put(saveUrl, todo).pipe(
        retry(2)
      );
    } else {
      return this.http.post(saveUrl, todo).pipe(
        retry(2)
      );
    }
  }

  deleteTodo(id: number) {
    return this.http.delete(`${this.API_URL}${id}/`).pipe(
      retry(2)
    );
  }

  private handleError(error) {
    return new Error('An error occurred');
  }
}
