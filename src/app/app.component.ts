import { Component, OnInit } from '@angular/core';
import { Task } from './task';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  editMode = false;
  taskName: string = "Sprzątanie kuwety";
  taskDate = '';
  config: { [key: string]: string };
  tasks: Task[] = [];
  constructor() {
    this.config = {
      title: 'Lista zadań',
      footer: '© Lista zadań',
      date: new Date().toDateString(),
    }
    if (localStorage.getItem("tasks") === null) {
      this.tasks = [];
    } else {
      this.tasks = JSON.parse(localStorage.getItem("tasks") || '{}');
    }
    this.sortTasks();
  }

  clearTask() {
    this.tasks = [];
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  createTask() {
    const task: Task = {
      name: this.taskName,
      deadline: this.taskDate,
      done: false,
    }
    this.tasks.push(task);
    this.taskDate = '';
    this.taskName = '';
    this.sortTasks();
    localStorage.setItem("tasks", JSON.stringify(this.tasks))
  }

  switchEditMode() {
    this.editMode = !this.editMode;
  }

  markTaskAsDone(task: Task) {
    task.done = true;
    this.sortTasks();
    localStorage.setItem("tasks", JSON.stringify(this.tasks))
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(e => e !== task)
    this.sortTasks();
    localStorage.setItem("tasks", JSON.stringify(this.tasks))
  }
  private sortTasks() {
    this.tasks = this.tasks.sort((a: Task, b: Task) => {
      let dateA = new Date(a.deadline).getTime();
      let dateB = new Date(b.deadline).getTime();
      return dateA > dateB ? 1 : -1;
    })
    this.tasks = this.tasks.sort((a: Task, b: Task) =>
      a.done === b.done ? 0 : a.done ? 1 : -1
    )
  }
  setColor(deadline: string) {
    const colors = ["red", "lime"]
    let taskDate = new Date(deadline);
    taskDate.setHours(0, 0, 0, 0);
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    // console.log(colors.filter(item => taskDate.getTime() < today.getTime() ? item : taskDate.getTime() === today.getTime() ? item : item))
    let color;
    if (taskDate.getTime() < today.getTime()) {
      color = colors[0]
    } else if (taskDate.getTime() === today.getTime()) {
      color = colors[1]
    }
    return color
  }
  ngOnInit() {
    if (localStorage.getItem("tasks") === null) {
      this.tasks = [];
    } else {
      this.tasks = JSON.parse(localStorage.getItem("tasks") || '{}');
    }
  }
}
