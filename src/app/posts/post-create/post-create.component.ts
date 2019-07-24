import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  postTitle = '';
  postContent = '';
  @Output() postCreated = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  onAddPost() {
    const newPost = {
      title: this.postTitle,
      content: this.postContent
    };
    console.log(newPost);
    this.postCreated.emit(newPost);
  }

}
