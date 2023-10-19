import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { QuizComponent } from "./quiz/quiz.component";
import { ArtistComponent } from "./components/artist/artist.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { TracksComponent } from "./components/tracks/tracks.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerComponent } from './components/player/player.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "quiz", component: QuizComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuizComponent,
    ArtistComponent,
    TracksComponent,
   PlayerComponent],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    DragDropModule,
   FontAwesomeModule,],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
