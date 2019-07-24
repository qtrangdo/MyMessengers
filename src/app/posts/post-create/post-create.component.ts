import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from 'src/app/_models/Post.model';
import { NgForm } from '@angular/forms';

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

  onAddPost(postForm: NgForm) {
    const newPost: Post = {
      title: postForm.value.title,
      content: postForm.value.content
    };
    postForm.valid && this.postCreated.emit(newPost);
    return;
  }

}
