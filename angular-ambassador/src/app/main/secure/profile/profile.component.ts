import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Emitters } from '../../../emitters/emitters';


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

    if (this.authService.authenticatedUser) {
      this.infoForm.patchValue(this.authService.authenticatedUser)
    }

    Emitters.authEmitter.subscribe(user => {
      this.infoForm.patchValue(user)
    })
  }

  passwordSubmit() {
    this.authService.updatePassword(this.passwordForm.getRawValue())
      .then(e => {
        console.log(e);
      })
  }
  infoSubmit() {
    this.authService.updateInfo(this.infoForm.getRawValue())
      .then(e => {
        console.log(e)
      })
  }

}
