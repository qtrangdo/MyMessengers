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
      })))
      .subscribe((transformedPosts: Post[]) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return { ...this.posts.find(p => p.id === id) }
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title, content };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((data) => {
        post.id = data.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts])
      }, err => console.error(err))
  }

  updatePost(id: string, title:string, content: string) {
    const post = { title, content };
    this.http.put<{ message: string, postId: string }>(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe(console.log)
  }

  deletePost(id: string) {
    this.http.delete<{ message: string }>(`http://localhost:3000/api/posts/${id}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts])
      }, err => console.error(err))
  }
}
