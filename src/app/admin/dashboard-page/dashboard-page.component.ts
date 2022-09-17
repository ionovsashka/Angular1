import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/interface';
import { PostsService } from 'src/app/shared/posts.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  postList:Post[] = []
  pSub: Subscription
  dSub: Subscription
  fieldForFilter: string = ''

  constructor(private postsService: PostsService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.pSub = this.postsService.getAll().subscribe(posts => {
      this.postList = posts
    })
  }

  remove(id: string){
    this.dSub = this.postsService.remove(id).subscribe(() => {
      this.postList = this.postList.filter(post => post.id !== id)
      this.alertService.danger('Пост был удален')
    })
  }

  ngOnDestroy(){
    if(this.pSub){
      this.pSub.unsubscribe()
    }

    if(this.dSub){
      this.dSub.unsubscribe()
    }
  }

}
