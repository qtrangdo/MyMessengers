import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from 'src/app/_models/Post.model';
import { PostsService } from 'src/app/_services/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor (private postsService: PostsService) { }

  ngOnInit() {
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((data: Post[]) => this.posts = data);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
