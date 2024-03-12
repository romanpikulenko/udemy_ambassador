import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { Stat } from '../../../interfaces/stat';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {
  stats: Stat[] = []

  constructor(private statService: StatsService) { }

  ngOnInit(): void {
    this.statService.all().then(e => {
      if (e.success) this.stats = e.stats!
      else console.log(e)
    })
  }
}
