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
          content: post.content,
          imagePath: post.imagePath
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
    return this.http.get<{ message: string, post: PostFromRepo, imagePath: string }>(`http://localhost:3000/api/posts/${id}`)
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((data) => {
        const post: Post = data.post;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts])
      }, err => console.error(err))
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if (typeof (image) === "object") {
      postData = new FormData();
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = { id, title, content, imagePath: image };
    }
    this.http.put<{ message: string, post: Post }>(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe((data) => {
        console.log(data)
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        updatedPosts[oldPostIndex] = {...data.post};
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts])
      }, err => console.error(err))
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
