import { Pipe, PipeTransform } from "@angular/core";
import { Post } from "src/app/shared/interface";

@Pipe({
  name: 'filterPosts'
})

export class FilterPipe implements PipeTransform{
  transform(posts:Post[], fieldForFilter: string): Post[] {
    if(!fieldForFilter.trim()){
      return posts
    }

    return posts.filter(post => {
      return post.title.toLowerCase().includes(fieldForFilter.toLowerCase())
    })
  }
}
