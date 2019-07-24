import { Component } from '@angular/core';
import { Post } from './_models/Post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedPosts: Post[] = [];

  onPostAdded(post: Post) {
    console.log("here");
    this.storedPosts.push(post);
  }
}
