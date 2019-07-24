import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from 'src/app/_models/Post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  postTitle = '';
  postContent = '';
  @Output() postCreated = new EventEmitter<Post>();

  constructor() { }

  ngOnInit() {
  }

  onAddPost() {
    const newPost: Post = {
      title: this.postTitle,
      content: this.postContent
    };
    this.postCreated.emit(newPost);
  }

}
