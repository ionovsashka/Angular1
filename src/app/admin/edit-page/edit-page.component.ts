import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Post } from 'src/app/shared/interface';
import { PostsService } from 'src/app/shared/posts.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  post: Post
  submited: boolean = false

  uSub: Subscription


  constructor(private route: ActivatedRoute, private postsService: PostsService, private router: Router, private alertService: AlertService) { }


  ngOnInit(): void {
    this.route.params
      .pipe(switchMap((params: Params) => {
        return this.postsService.getPostById(params['id'])
      })).subscribe((post: Post) => {
        this.post = post
        this.form = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required)
        })
      })
    }

    submit(){
      if(this.form.invalid){
        return
      }

      this.submited = true
      this.uSub = this.postsService.updatePost({
        ...this.post,
        text: this.form.value.text,
        title: this.form.value.title,
      }).subscribe(() => {
        this.submited = false
        this.router.navigate(['/admin', 'dashboard'])
        this.alertService.success('Пост был успешно изменен')
      })
    }

    ngOnDestroy(){
      if(this.uSub){
        this.uSub.unsubscribe()
      }
    }
}
