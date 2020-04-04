import { Component ,Input, OnInit, OnDestroy} from '@angular/core';
import {Post} from '../post.model'
import { PostService } from '../post.service';
import {Subscription} from 'rxjs';
@Component({
  selector:'app-post-list',
  templateUrl:'./post-list.component.html',
  styleUrls:['./post-list.component.css']
})

export class PostListComponent implements OnInit,OnDestroy{
  storedPosts:Post[] =[];
  private postSub: Subscription;
  isLoading=false;;
  constructor(public postService:PostService) {

  }
  onDel(postId:string){
   this.postService.deletePost(postId);
  }
  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
  ngOnInit(): void {
    this.isLoading=true;
   this.postService.getPost();
    this.postSub=this.postService.getPostUpdatedlistener().subscribe((post:Post[])=>{
      this.isLoading=false;
      this.storedPosts=post;

    });
}
}
