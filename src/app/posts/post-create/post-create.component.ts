import { Component ,EventEmitter,Output, OnInit} from '@angular/core';
import {Post} from '../post.model'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import {ActivatedRoute, ParamMap, UrlHandlingStrategy} from "@angular/router"
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import {mimeType} from './mime-type-validator';
@Component({
  selector :'app-post-create',
  templateUrl:'./post-create.component.html',
  styleUrls:['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
private mode="create";
private postId:string="";


post:Post
isLoading=false;
form: FormGroup
imagePreview:any="";

constructor(public postService:PostService,public route:ActivatedRoute){

}
onImagePicked(event:Event){

const file=(event.target as HTMLInputElement).files[0];
console.log(file);
this.form.patchValue({image: file});
this.form.get('image').updateValueAndValidity();
const reader =new FileReader();
reader.onload= ()=>{
  this.imagePreview=reader.result
}
reader.readAsDataURL(file);

}

  ngOnInit(): void {
      this.form=new FormGroup({
        title:new FormControl(null,{
          validators: [Validators.required,Validators.minLength(3)]
        }),
        content:new FormControl(null,{
         validators: [Validators.required]
        }),
        image:new FormControl(null,{
          validators:[Validators.required],
          asyncValidators:[mimeType]
        })

      });

    this.route.paramMap.subscribe((paramMap :ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode='edit';
        this.postId=paramMap.get('postId');
        this.isLoading=true;
        this.postService.getSinglePost(this.postId)
        .subscribe((postData)=>{
          this.isLoading=false;
          this.post={
            id:postData._id,
            title:postData.title,
            content:postData.content,
            imagePath:postData.imagePath
          };
          this.form.setValue({
            title:this.post.title,
            content:this.post.content,
            image:this.post.imagePath
          })

        });
      }else{
        this.mode='create';
        this.postId=null;
      }
    });
  }


  onSavePost(){

    console.log("in"+" "+this.form.invalid)
    if(this.form.invalid)return;
  const post:Post={
    id:null,
    title:this.form.value.title,
    content:this.form.value.content,
    imagePath:null

  };
  console.log(post +" "+this.mode)
  this.isLoading=true;
  if(this.mode=="create"){
    console.log("saving")
    this.postService.addPost(post.title,post.content,this.form.value.image);
  }
  else{
    this.postService.updatePost(this.post.id,this.form.value.title,this.form.value.content,this.form.value.image);

  }
 this.form.reset();
}
}
