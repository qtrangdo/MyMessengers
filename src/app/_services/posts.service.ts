import { Injectable } from '@angular/core';
import { Post } from '../_models/Post.model';
import { PostFromRepo } from '../_models/PostFromRepo.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor (private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    this.http.get<{ message: string, posts: PostFromRepo[], maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map(data => {
        return {
          posts: data.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              creator: post.creator
            }
          }),
          maxPosts: data.maxPosts
        }
      }))
      .subscribe((transformedPostData: { posts: Post[], maxPosts: number }) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts });
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
        // const post: Post = data.post;
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts])
        console.log(data)
        this.router.navigate(['/']);
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
      postData = { id, title, content, imagePath: image, creator: null };
    }
    this.http.put<{ message: string, post: Post }>(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe((data) => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        // updatedPosts[oldPostIndex] = { ...data.post };
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts])
        this.router.navigate(['/']);
      }, err => console.error(err))
  }

  deletePost(id: string) {
    return this.http.delete<{ message: string }>(`http://localhost:3000/api/posts/${id}`);
  }
}
