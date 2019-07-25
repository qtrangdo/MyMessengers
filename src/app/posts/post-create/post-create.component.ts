import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from 'src/app/_models/Post.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from 'src/app/_services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  mode = 'create';
  isLoading = false;
  postId: string;
  post: Post;
  form: FormGroup;

  constructor (private postsService: PostsService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(data => {
          this.post = {
            id: data.post._id,
            title: data.post.title,
            content: data.post.content
          }
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          })
          this.isLoading = false;
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    })
  }

  createForm() {
    this.form = this.fb.group({
      "title": ['', Validators.required],
      "content": ['', Validators.required],
      "image": ['', Validators.required]
    })
  }

  onSavePost() {
    if (this.form.invalid) return;
    const { title, content } = this.form.value;
    this.isLoading = true;
    this.mode === "create" && this.postsService.addPost(title, content);
    this.mode === "edit" && this.postsService.updatePost(this.postId, title, content);
    this.form.reset();
    this.router.navigate(['/']);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form)
  }

}
