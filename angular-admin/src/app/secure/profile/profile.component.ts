import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Emitters } from '../../emitters/emitters';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  infoForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.infoForm = this.formBuilder.group({
      first_name: '',
      last_name: '',
      email: ''
    })
    this.passwordForm = this.formBuilder.group({
      password: '',
      password_confirm: '',
    })

    if (this.authService.user) {
      this.infoForm.patchValue(this.authService.user)
    }

    Emitters.authEmitter.subscribe(user => {
      this.infoForm.patchValue(user)
    })
  }

  passwordSubmit() {
    this.authService.updatePassword(this.passwordForm.getRawValue())
      .then(e => {
        if (e.success) this.router.navigate(['/'])
        else console.log(e);
      })
  }
  infoSubmit() {
    this.authService.updateInfo(this.infoForm.getRawValue())
      .then(e => {
        if (e.success) this.router.navigate(['/'])
        else console.log(e)
      })
  }

}
