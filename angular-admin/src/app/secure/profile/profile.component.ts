import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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

    this.authService.userAsync().then(e => {
      if (e.success) {
        const user = e.user!
        this.infoForm.patchValue(user)
      }
      else console.log(e)
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
        else console.log(e);
      })
  }

}
