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

  private handleError(error) {
    return new Error('An error occurred');
  }
}
