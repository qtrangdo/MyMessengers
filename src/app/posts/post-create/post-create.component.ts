import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
  mode = 'create';
  postId: string;
  post: Post;

  constructor (private postsService: PostsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.post = this.postsService.getPost(this.postId);
        this.postTitle = this.post.title;
        this.postContent = this.post.content;
      } else {
        this.mode = "create";
        this.postId = null;
      }
    })
  }

  onSavePost(postForm: NgForm) {
    if (postForm.invalid) return;
    const { title, content } = postForm.value;
    this.mode === "create" && this.postsService.addPost(title, content);
    this.mode === "edit" && this.postsService.updatePost(this.postId, title, content);
    postForm.resetForm();
  }

}
