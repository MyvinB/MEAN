import {Post} from './post.model'
import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

import { Router } from '@angular/router';

@Injectable({providedIn :'root'})
export class PostService{
private posts:Post[]=[];
private postsUpdated =new Subject<Post[]>();
apiUrl:'http://localhost:3000';

constructor(private http:HttpClient,private router:Router){

}

getPostUpdatedlistener(){
  return this.postsUpdated.asObservable();
}
getPost(){
  this.http.get<{message:string,posts:any}>('http://localhost:3000/posts')
  .pipe(map((postData)=>{
    return postData.posts.map(post =>{
      return {
        title:post.title,
        content:post.content,
        id:post._id,
        imagePath:post.imagePath
      }
    })
  }))
  .subscribe((transformedPost)=>{
    this.posts=transformedPost;
    this.postsUpdated.next([...this.posts]);
  })

}
addPost(title:string,content:string,image:File){
const postData=new FormData();
postData.append('title',title);
postData.append('content',content);
postData.append('image',image,title);
this.http.post<{message :string,post:Post}>('http://localhost:3000/posts',postData)
.subscribe((responseData)=>
{

const post:Post ={id:responseData.post.id,title:title,content:content,imagePath:responseData.post.imagePath};


this.posts.push(post);
this.postsUpdated.next([...this.posts]);
this.router.navigate(["/"]);
});

}

updatePost(id:string,title:string,content:string,image: File|string){
  let postData:Post | FormData;
  if(typeof(image)=="object"){
    postData=new FormData();
    postData.append("id",id);
    postData.append("title",title);
    postData.append("content",content);
    postData.append("image",image,title);
  }
  else{
    postData={
      id:id,
      title:title,
      content:content,
      imagePath:image
    };
  }



  this.http.put("http://localhost:3000/posts/"+id,postData)
  .subscribe(response=>{
    //to maintain immutability of our data
    const updatedPost=[...this.posts];
    const oldPostIndex=updatedPost.findIndex(p=>p.id==post.id);
    const post: Post ={
      id:id,
      title:title,
      content:content,
      imagePath:""
    }
    updatedPost[oldPostIndex]=post;
    this.posts=updatedPost;
    this.postsUpdated.next([...this.posts]);
    this.router.navigate(["/"]);
  });
}


getSinglePost(id:string){
  return this.http.get<{_id:string,title:string,content:string,imagePath:string}>("http://localhost:3000/posts/"+id);

}
deletePost(postId:string){

this.http.delete("http://localhost:3000/posts/"+postId)
.subscribe(()=>{
  this.posts=this.posts.filter(post=>post.id !==postId)
  this.postsUpdated.next([...this.posts]);
});
}

}
