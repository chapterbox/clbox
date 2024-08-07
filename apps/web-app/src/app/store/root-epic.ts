import { combineEpics } from 'redux-observable';
import { authenticationEpic } from '../features/authentication/state/authentication.epic';
import { inboxEpic } from '../features/inbox/state/inbox.epic';
import { sentEpic } from '../features/sent/state/sent.epic';
import { statsEpic } from '../features/stats/state/stats.epic';
import { teamEpic } from '../features/team/state/team.epic';
import { profileEpic } from '../features/profile/state/profile.epic';

export const rootEpic = combineEpics(
    authenticationEpic,
    teamEpic,
    inboxEpic,
    sentEpic,
    statsEpic,
    profileEpic
);
