import { Injectable } from '@angular/core';
import * as actions from '../actions/song.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PlaylistDataService } from '../services/playlist-data.service';
import { of } from 'rxjs';

@Injectable()
export class SongEffects {

  // action.songAdded => songAddedSuccessfully || songAddedFailure
  addSong$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.songAdded),
      switchMap(orignalAction => this.service.addASong(orignalAction.payload)
        .pipe(
          map(response => actions.songAddedSuccessfully({
            oldId: orignalAction.payload.id,
            payload: response
          })),
          catchError(response => of(actions.songAddedFailure({
            oldId: orignalAction.payload.id,
            errorMessage: `Sorry, could not the song ${orignalAction.payload.title}`
          })))
        )
      )
    )
  );

  // actions.loadSongs => loadSongsSucceeded || loadSongsFailed
  loadSongs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.loadSongs),
      switchMap(() => this.service.getAll()
        .pipe(
          map(response => actions.loadSongsSucceeded({ payload: response }))
        )
      )
    )
    , { dispatch: true });

  constructor(
    private actions$: Actions,
    private service: PlaylistDataService, // todo: set up a provider
  ) { }
}
