import { Injectable } from '@angular/core';
import { Post } from '../_models/Post.model';
import { PostFromRepo } from '../_models/PostFromRepo.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor (private http: HttpClient) { }

  getPosts() {
    this.http.get<{ message: string, posts: PostFromRepo[] }>('http://localhost:3000/api/posts')
      .pipe(map(data => data.posts.map(post => {
        return {
          id: post._id,
          title: post.title,
          content: post.content
        }
      }) ))
      .subscribe((transformedPosts: Post[]) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title, content };
    this.http.post<void>('http://localhost:3000/api/posts', post)
      .subscribe(() => {
        this.posts.push(post);
        this.postsUpdated.next([...this.posts])
      }, err => console.error(err))
  }
}
