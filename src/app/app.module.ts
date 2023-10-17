import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { QuizComponent } from "./quiz/quiz.component";
import { TrackComponent } from './track/track.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "quiz", component: QuizComponent },
];

@NgModule({
  declarations: [AppComponent, HomeComponent, QuizComponent, TrackComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
