import { Component, OnInit } from '@angular/core';
import { LinkService } from '../services/link.service';
import { ActivatedRoute } from '@angular/router';
import { Link } from '../interfaces/link';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  code = ''
  link?: Link

  constructor(private linkService: LinkService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.code = this.route.snapshot.params['code']
    this.linkService.get(this.code).then(e => {
      if (e.success) this.link = e.links![0]
      else console.log(e)
    })
  }

  get user() {
    return this.link?.user
  }

}
