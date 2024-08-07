import firebase from 'firebase/compat/app';
import { combineLatest, Observable, of } from 'rxjs';
import { distinct, map, switchMap } from 'rxjs/operators';
import { firebaseApp } from '../../../firebase/firebase.app';
import { inboxFetched } from './inbox-fetched';
import { AppState } from '../../../../state/app-state';
import { Message } from '../../../message/model/message';
import { Epic } from 'redux-observable';

const firestore = firebaseApp.firestore();
export const fetchInboxEpic: Epic<unknown, unknown, AppState> = (_, state$) => combineLatest([
    state$.pipe(
        map(state => state.authentication?.email)
    ),
    state$.pipe(
        map(state => state.team?.current?.id)
    )
]).pipe(
    distinct(([user, team]) => `${user}/${team}`),
    switchMap(([user, team]) => {
        if (team && user) {
            return new Observable<firebase.firestore.QuerySnapshot>(subscriber => {
                const inboxCollection = firestore.collection(`team/${team}/user/${user}/inbox`);
                inboxCollection.onSnapshot(subscriber);
            });
        } else {
            return of<firebase.firestore.QuerySnapshot>();
        }
    }),
    map(messages => inboxFetched({
        messages: messages.docs.map(doc => (<Message>{
            id: doc.id,
            ...doc.data(),
            type: doc.data().type ?? 'personal'
        }))
    }))
);
