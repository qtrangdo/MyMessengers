import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/_models/Post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from 'src/app/_services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  postTitle = '';
  postContent = '';

  constructor (private postsService: PostsService) { }

  ngOnInit() {
  }

  onAddPost(postForm: NgForm) {
    if (postForm.invalid) return;
    const { title, content } = postForm.value;
    postForm.valid && this.postsService.addPost(title, content);
    postForm.resetForm();
  }

}
