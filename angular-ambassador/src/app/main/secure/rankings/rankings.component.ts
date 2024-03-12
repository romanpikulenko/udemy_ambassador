import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../../services/stats.service';

@Component({
  selector: 'app-rankings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rankings.component.html',
  styleUrl: './rankings.component.css'
})
export class RankingsComponent implements OnInit {
  ranking: any = {}

  constructor(private statService: StatsService) { }

  ngOnInit(): void {
    this.statService.rankings().then(e => {
      if (e.success) this.ranking = e.responseBody
      else console.log(e)
    })
  }


}
